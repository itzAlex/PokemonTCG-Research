// host.js

const frida = require('frida');
const fs = require('fs');
const fetch = require('node-fetch');
const process= require('process');
process.removeAllListeners('warning');

(async () => {
  // Adjust the device and process name as needed
  const device = await frida.getUsbDevice();
  const session = await device.attach('Gadget');

  // Read your compiled agent.js
  const agentCode = fs.readFileSync('_agent.js', 'utf8');

  const script = await session.createScript(agentCode);
  const antitamperScript = await session.createScript(`
    Java.perform(function () {
      // Path to BootSequenceUserPrefs file
      var BootSequenceUserPrefs = "/data/data/jp.pokemon.pokemontcgp/files/UserPreferences/v1/BootSequenceUserPrefs";

      // Check if the file exists
      var File = Java.use('java.io.File');
      var BootSequenceUserPrefsFile = File.$new(BootSequenceUserPrefs);

      if (BootSequenceUserPrefsFile.exists()) {
        console.log("⚠  The BootSequenceUserPrefs file exists, deleting it so that the game does not crash")
        // Attempt to delete the file
        var deleted = BootSequenceUserPrefsFile.delete();
        if (deleted) {
            console.log("🛈  Successfully deleted BootSequenceUserPrefs");
        } else {
            console.log("⚠  Failed to delete BootSequenceUserPrefs, do it manually!");
        }
      }
    });
  `);

  // Handle messages from the agent script
  script.message.connect(async (message) => {
    if (message.type === 'send') {
      const { jsonData, title } = message.payload;

      // Send data to the backend server
      try {
        const response = await fetch('http://localhost:3000/intercept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonData, title }),
        });

        const result = await response.json();

        // Send the modified JSON back to the agent script
        script.post({
          type: 'modifiedJson',
          payload: result.modifiedJson,
        });
      } catch (error) {
        console.error('Error communicating with backend:', error);
      }
    } else if (message.type === 'error') {
      console.error('Script error:', message.stack);
    }
  });

  console.log('🛈 Loading scripts\n');
  await antitamperScript.load();
  await script.load();
})();
