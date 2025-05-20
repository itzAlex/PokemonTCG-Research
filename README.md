# Pokémon TCG - Research tools

Making public part of the tools developed after reporting several vulnerabilities by Bugcrowd.

## Description
Right now there are two tools developed:
* Frida script: SSL pinning bypass, view gRPC endpoint requests/responses in plain text and modify requests on the fly
* Interceptor web: Web page to receive and modify in plain text the Protobuf messages sent by gRPC requests

## TODO
* Right now with these tools all traffic can be seen except that which is sent to the PvP servers. The DLLs that handle the game's PvP need to be reverse engineered.
