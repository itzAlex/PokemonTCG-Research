import "frida-il2cpp-bridge";

var originalCertificate = `
DigiCertGlobalRootG2
==================
-----BEGIN CERTIFICATE-----
MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh
MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH
MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT
MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j
b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI
2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx
1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ
q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz
tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ
vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP
BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV
5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY
1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4
NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG
Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91
8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe
pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl
MrY=
-----END CERTIFICATE-----
`

var proxyCertificate = `
mitmproxy
==================
-----BEGIN CERTIFICATE-----
MIIDNTCCAh2gAwIBAgIUUNIDUBPfNegLmI9K0YDLbCTRmGswDQYJKoZIhvcNAQEL
BQAwKDESMBAGA1UEAwwJbWl0bXByb3h5MRIwEAYDVQQKDAltaXRtcHJveHkwHhcN
MjQwMTEwMjEwNjQ2WhcNMzQwMTA5MjEwNjQ2WjAoMRIwEAYDVQQDDAltaXRtcHJv
eHkxEjAQBgNVBAoMCW1pdG1wcm94eTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBAMStrsmDqxF1iwXpgSiSSKsXI+4zj3I2fEqlb2xVUcKKBAZCoe1OJCyz
XW2Ks0LgG/ghxMGQZ9D2sa/kA8hSAirBzg2uiw2uASb2U/LPcLfCM6zI358ba9Lo
G8uO/gPXLJHY4kN2BiDs8G1qM6jLsr4XtguNb9wgIjb9kcO3Di97ZMY0UTgDZlsd
LZUyXhCk/7xuGIKhmqjYJatHKgUUWg5iyR/dvAnbNEf+G25eJqDU7JD3R5Y0W12M
CiM0eXHiZBZ01lJURNUpvCuf2eMELZ0rQ6o6BYU5K6kScJ9VzXvz07stsID8TPsJ
RgEltcVObVrLN0/aRi7PV9T+tpq8Jk8CAwEAAaNXMFUwDwYDVR0TAQH/BAUwAwEB
/zATBgNVHSUEDDAKBggrBgEFBQcDATAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYE
FN1zz21G0e07u3UbcSd2PlASyuc+MA0GCSqGSIb3DQEBCwUAA4IBAQDEUiHqGkvR
LPgYDD2IsuEWfj59fqS9Xxz3BqTL3x4rDcd7mY3gigFZFUHZjVLCJnnqzPvGz23T
wrCL6robPf6UxJnfsXnrdDPCxmXOAbj+19Y563suqbqv8jmUqJt4c9JW92HTjBt8
UO9U0GzoDufrYzI/vFa5g0RGi2U3PYq1o2pzf8hyTM99dZSmntdckST/Fn2rxP6K
zs8i8ZO4NAkix4z0VB1VIxEyPA2I+yCNkHB5WgNJt807ouELN/CfqbGuiRFkz/WW
yMOdTg3s4rVmNMTx6NVAAVTheo7jSVzmBiupWdBV0zDZRvrSFKTfgyFpm1TGB3no
o4iQjPVju0CT
-----END CERTIFICATE-----
`

const bypassSSLPinning = false;

Il2Cpp.perform(() => {

  if (bypassSSLPinning) {
    const GrpLib = Il2Cpp.domain.assembly("Grpc.Core").image;
    const SslCredentials = GrpLib.class("Grpc.Core.SslCredentials");
    const SslCredentialsCtor = SslCredentials.methods.find(method => 
      method.name === ".ctor" && method.parameterCount === 3
    );

    if (!SslCredentialsCtor) {
      console.error("Constructor with 3 parameters not found, aborting...");
      return;
    }

    // @ts-ignore
    SslCredentialsCtor.implementation = function(...args: any[]) {
      console.log("Changing root certificates...")
      // @ts-ignore
      this.field<string>("rootCertificates").value = Il2Cpp.string(proxyCertificate);
    }
  }

  // Hook only DLLs where important requests are performed
  const libraries = {
    TakashoLib: "Takasho.ProtobufGenerated",
    TakashoKernelLib: "Takasho.ProtobufKernel.dll",
    SharinLib: "Sharin.Portable.Foundation.Runtime.dll",
    BattleLib: "Lettuce.Infrastructure.BattlePvP.dll",
    SummaryLib: "Lettuce.BattleEngine.Summary.Runtime.dll",
    SerializationLib: "Lettuce.BattleEngine.Serialization.Runtime.dll",
    BattleSchemaLib: "Lettuce.BattleEngine.BattleSchema.Proto.dll"
  };

  // Extract classes for each assembly
  const classes = Object.fromEntries(
    Object.entries(libraries).map(([name, assembly]) => [name, Il2Cpp.domain.assembly(assembly).image.classes])
  );

  // Combine all classes into one array
  // @ts-ignore
  const allClasses: Class[] = Object.values(classes).flat();

  /*
  Example:

  namespace Takasho.Schema.LettuceServer.PlayerApi
  {
    public sealed class SystemAuthorizeV1 : 
      IMessage<SystemAuthorizeV1>,
      IMessage,
      IEquatable<SystemAuthorizeV1>,
      IDeepCloneable<SystemAuthorizeV1>,
      IBufferMessage
    {
    ...
      public static class Types
      {
        public sealed class Request : 
          IMessage<SystemAuthorizeV1.Types.Request>,
          IMessage,
          IEquatable<SystemAuthorizeV1.Types.Request>,
          IDeepCloneable<SystemAuthorizeV1.Types.Request>,
          IBufferMessage
        {
          ...
          public void WriteTo(CodedOutputStream output) { }
          ...
        }
        public sealed class Response : 
          IMessage<SystemAuthorizeV1.Types.Response>,
          IMessage,
          IEquatable<SystemAuthorizeV1.Types.Response>,
          IDeepCloneable<SystemAuthorizeV1.Types.Response>,
          IBufferMessage
        {
          ...
          public void MergeFrom(CodedInputStream input) { }
          ...
        }
      }
    }
  }
  */

  allClasses.forEach(cls => {
    // Obtain root class name with a maximum depth of 2
    let mainClass = cls;
    let depth = 0;
    while (mainClass.declaringClass && depth < 2) {
      mainClass = mainClass.declaringClass;
      depth++;
    }

    // @ts-ignore
    cls.methods.forEach(method => {
      if (method.name === "MergeFrom" && cls.name === "Response") {
        // Hook MergeFrom method
        // @ts-ignore
        method.implementation = function (CodedInputStream) {
          // @ts-ignore
          this.method<Il2Cpp.Object>("MergeFrom").overload("Google.Protobuf.CodedInputStream").invoke(CodedInputStream);
          // @ts-ignore
          const body = this.method<string>("ToString").invoke().content;
          const bodyJson = JSON.stringify(JSON.parse(body), null, 2);
          console.log(`\n[◄] Request FROM gRPC endpoint: ${mainClass.name}\n-------------------------\n${bodyJson}`);
        };
        // @ts-ignore
        console.log(`Hooked responses in class ${mainClass.name}`);
      } else if (method.name === "WriteTo" && cls.name === "Request") {
        // Hook WriteTo method
        // @ts-ignore
        method.implementation = function (CodedOutputStream) {
          // @ts-ignore
          this.method<Il2Cpp.Object>("WriteTo").overload("Google.Protobuf.CodedOutputStream").invoke(CodedOutputStream);
          // @ts-ignore
          const body = this.method<string>("ToString").invoke().content;
          const bodyJson = JSON.stringify(JSON.parse(body), null, 2);
          console.log(`\n[►] Request TO gRPC endpoint: ${mainClass.name}\n-------------------------\n${bodyJson}`);
        };
        // @ts-ignore
        console.log(`Hooked requests in class ${mainClass.name}`);
      }
    });
  });
});