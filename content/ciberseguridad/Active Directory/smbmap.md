Smbmap es una herramienta de línea de comandos que se utiliza para enumerar y explorar recursos compartidos en una red SMB.
## Enumerar recursos compartidos en un servidor SMB
```python
smbmap -H <IP address or hostname>
```
Por ejemplo, para enumerar los recursos compartidos en un servidor con la dirección IP 192.168.1.100, puede ejecutar el siguiente comando, el cual mostrará una lista de los recursos compartidos en el servidor, junto con información sobre los permisos de acceso.
```python
smbmap -H 192.168.1.100
```
Y este sería el resultado:
```bash
(root@kali)-[/home/physco/Escritorio/blog]
# smbmap -H 10.10.212.237
[+] Guest session     IP: 10.10.212.237:445    Name: unknown
    Disk                                                  Permissions     Comment
    ----                                                  -----------     -------
    print$                                                NO ACCESS       Printer Drivers
    BillySMB                                              READ, WRITE     Billy's local SMB Share
    IPC$                                                  NO ACCESS       IPC Service (blog server (Samba, Ubuntu))
```
### Enumerar archivos y directorios en un recurso compartido
Podemos enumerar recursos compartidos sin proporcionar credenciales haciendo uso de una null session simplemente usando el parámetro -H:
```bash
(root@kali)-[/home/kali/Desktop/CVE-2017-7494]
# smbmap -H 127.0.0.1
[+] Guest session     IP: 127.0.0.1:445       Name: localhost
    Disk                                                  Permissions     Comment
    ----                                                  -----------     -------
    myshare                                               READ, WRITE     
    IPC$                                                  NO ACCESS       IPC Service (Samba Server Version 4.6.3)
```
También podríamos conectarnos haciendo uso de una null session de esta forma:
```bash
smbmap -u "null" -H 10.10.182.108
```
```bash
(root@kali)-[/home/kali/Desktop]
# smbmap -u "null" -H 10.10.182.108
[+] Guest session     IP: 10.10.182.108:445    Name: vulnnet-rst.local
    Disk                                                  Permissions     Comment
    ----                                                  -----------     -------
    ADMIN$                                                NO ACCESS       Remote Admin
    C$                                                    NO ACCESS       Default share
    IPC$                                                  READ ONLY       Remote IPC
    NETLOGON                                              NO ACCESS       Logon server share
    SYSVOL                                                NO ACCESS       Logon server share
    VulnNet-Business-Anonymous                            READ ONLY       VulnNet Business Sharing
    VulnNet-Enterprise-Anonymous                          READ ONLY       VulnNet Enterprise Sharing
```
Si quisiéramos proporcionar credenciales, lo haríamos de esta forma:
```python
smbmap -H <IP address or hostname> -u <username> -p <password> -s <sharename> -R
```
Por ejemplo, para enumerar los archivos y directorios en el recurso compartido "compartido1" en un servidor con la dirección IP 192.168.1.100, puede ejecutar el siguiente comando, el cual mostrará una lista de los archivos y directorios en el recurso compartido "compartido1", junto con información sobre los permisos de acceso.
```python
smbmap -H 192.168.1.100 -u usuario -p contrasena -r compartido1
```
```bash
(root@kali)-[~kali/Desktop/kerbrute]
# smbmap -H 10.10.41.180 -u 'backup' -p backup251760 -r 'NETLOGON'
[+] IP: 10.10.41.180:445    Name: spookysec.local
    Disk                                                  Permissions     Comment
    ----                                                  -----------     -------
    NETLOGON                                              READ ONLY       
    .\NETLOGON\*
    dr--r--r--                  0 Sat Apr  4 14:39:35 2020    .
    dr--r--r--                  0 Sat Apr  4 14:39:35 2020    ..
```
--- 
## EJEMPLO FUNCIONAMIENTO SMBMAP

Así sería el funcionamiento de smbmap
```bash
(root@kali)-[/home/mario/Escritorio/secnotes]
# smbmap -H 10.10.10.97 -u 'Tyler' -p '92g!mA8BGjOiRkL%OG*&'
[+] IP: 10.10.10.97:445 Name: 10.10.10.97
    Disk                                                  Permissions     Comment
    ----                                                  -----------     -------
    ADMIN$                                                NO ACCESS       Remote Admin
    C$                                                    NO ACCESS       Default share
    IPC$                                                  READ ONLY       Remote IPC
    new-site                                              READ, WRITE     
```
# DESCARGAR UN ARCHIVO CON SMBMAP
Lo haríamos con el parámetro --download:
root@attackdefense:~# smbmap -H 10.2.18.83 -u 'administrator' -p 'smbserver_771' --download C$/flag.txt
[+] Starting download: C$\flag.txt (32 bytes)
[+] File output to: /root/10.2.18.83-C_flag.txt
```[cite: 10]