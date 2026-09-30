Un servidor proxy consiste en un programa o dispositivo que hace de intermediario en las peticiones de recursos que realiza un cliente a otro servidor, por tanto voy a instalar el servidor proxy en mi máquina Ubuntu Server con un sudo apt install squid:
```bash 
apt install squid
```
Activamos el servicio de squid y consultamos cual es el puerto que está utilizando:
```bash
systemctl start squid

```
Y ahora con este comando podemos comprobar por qué puerto por defecto que está escuchando este proxy, que es el 3128:
```bash
┌──(root@kali)-[/home/mario]
└─# netstat -apn | grep squid
tcp6       0      0 :::3128                 :::*                    LISTEN      2744/(squid-1)
udp        0      0 0.0.0.0:45459           0.0.0.0:*                           2744/(squid-1)
udp6       0      0 :::52456                :::*                                2744/(squid-1)
udp6       0      0 ::1:40565               ::1:44258               ESTABLISHED 2744/(squid-1)

unix  3      [ ]                 STREAM     CONNECTED     22854    2744/(squid-1)
unix  2      [ ]                 DGRAM      CONNECTED     22817    2742/squid
unix  2      [ ]                 DGRAM      CONNECTED     22837    2744/(squid-1)
```
Ahora vamos a entrar dentro de la configuración de squid, que está dentro de /etc/squid:
```bash
cd /etc/squid/
ls 
conf.d errorpage.css squid.conf
```
Una vez dentro de este fichero que es enorme podemos borrarlo todo e ir haciendo nuestra configuración poco a poco:
```bash
#       WELCOME TO SQUID 5.7
#       ____________________
#
#       This is the documentation for the Squid configuration file.
#       This documentation can also be found online at:
#               http://www.squid-cache.org/Doc/config/
#
#       You may wish to look at the Squid home page and wiki for the
#       FAQ and other documentation:
#               http://www.squid-cache.org/
#               http://wiki.squid-cache.org/SquidFaq
#               http://wiki.squid-cache.org/ConfigExamples
#
#       This documentation shows what the defaults for various directives
#       happen to be.  If you don't need to change the default, you should
#       leave the line out of your squid.conf in most cases.
#
#       In some cases "none" refers to no default setting at all,
#       while in other cases it refers to the value of the option
#       - the comments for that keyword indicate if this is the case.
```
Para eliminar todo el texto podemos hacerlo con el editor gedit. Y lo primero será añadir un nombre del proxy y el puerto por el cual estará corriendo, que en mi caso puedo dejar el que viene por defecto:
```bash
1 # Nombre del proxy
2 visible_hostname proxyMario
3
4 # Puerto del proxy
5 http_port 3128
6
```
Y ahora también podemos configurar la cache del proxy, ya que el proxy necesita una configuración para guardar logs y archivos. En este caso establezco una configuración genérica:
```bash 
# Cache del proxy
cache_dir ufs /var/spool/squid 4096 16 256
cache_mem 512 MB
maximum_object_size_in_memory 256 MB
```
Y ahora configuramos los logs del proxy:
```bash
# Logs de SQUID / access.log guarda los usuarios que acceden al proxy.
access_log /var/log/squid/access.log
cache_log /var/log/squid/cache.log
```
A continuación las ACL, que esto básicamente serán las reglas que se van a aplicar, es decir, define un tipo de tráfico. Por tanto creamos una variable que será websDenegadas que almacenarán dominios que estén dentro de un fichero, y lo mismo con la variable palabrasDenegadas que almacenará palabras prohibidas.
```bash
# ACLs
acl todos src all
acl LAN src 192.168.0.0/24
acl localhost src 127.0.0.1/32
acl websDenegadas dstdomain "/etc/squid/websDenegadas"
acl palabrasDenegadas url_regex "/etc/squid/palabrasDenegadas"
```
Pero todavía no hemos aceptado ni denegado nada, sólo estamos estableciendo variables, por lo que ahora debemos dar la orden de las prohibiciones:
```bash
# Control de acceso
http_access deny websDenegadas
http_access deny palabrasDenegadas
http_access allow LAN
http_access allow localhost

# Denegamos los diferentes tipos de tráfico.
http_access deny all
```
Así nos quedaría nuestro fichero de configuración:
```bash
# Nombre del proxy
visible_hostname proxyMario

# Puerto del proxy
http_port 3128

# Cache del proxy
cache_dir ufs /var/spool/squid 4096 16 256
cache_mem 512 MB
maximum_object_size_in_memory 256 MB

# Logs de SQUID / access.log guarda los usuarios que acceden al proxy.
access_log /var/log/squid/access.log
cache_log /var/log/squid/cache.log

# ACLs
acl todos src all
acl LAN src 192.168.0.0/24
acl localhost src 127.0.0.1/32
acl websDenegadas dstdomain "/etc/squid/websDenegadas"
acl palabrasDenegadas url_regex "/etc/squid/palabrasDenegadas"

# Control de acceso
http_access deny websDenegadas
http_access deny palabrasDenegadas
http_access allow LAN
http_access allow localhost

# Denegamos los diferentes tipos de tráfico.
http_access deny all
```
Ahora vamos a crear los ficheros donde se contienen los dominios bloqueados y las palabras bloqueadas:
```bash
www.marca.es
www.sport.es
```
Y ahora creamos el otro fichero de palabrasDenegadas:
```bash
elmundo
elpais
```
Y ya tenemos los dos archivos:
```bash
┌──(root@kali)-[/etc/squid]
└─# ls
conf.d  errorpage.css  palabrasDenegadas  squid.conf  squid.conf.bak  websDenegadas
```
Ahora vamos a comprobar que no haya ningún error sintáctico dentro de nuestro fichero de squid; y para ello usamos el comando squid -k parse y vemos que está todo correcto:
```bash
┌──(root@kali)-[/etc/squid]
└─# squid -k parse
2023/01/25 11:16:15| Startup: Initializing Authentication Schemes ...
2023/01/25 11:16:15| Startup: Initialized Authentication Scheme 'basic'
2023/01/25 11:16:15| Startup: Initialized Authentication Scheme 'digest'
2023/01/25 11:16:15| Startup: Initialized Authentication Scheme 'negotiate'
2023/01/25 11:16:15| Startup: Initialized Authentication Scheme 'ntlm'
2023/01/25 11:16:15| Startup: Initialized Authentication.
2023/01/25 11:16:15| Processing Configuration File: /etc/squid/squid.conf (depth 0)
2023/01/25 11:16:15| Processing: visible_hostname proxyMario
2023/01/25 11:16:15| Processing: http_port 3128
2023/01/25 11:16:15| Processing: cache_dir ufs /var/spool/squid 4096 16 256
2023/01/25 11:16:15| Processing: cache_mem 512 MB
2023/01/25 11:16:15| Processing: maximum_object_size_in_memory 256 MB
2023/01/25 11:16:15| Processing: access_log /var/log/squid/access.log
2023/01/25 11:16:15| Processing: cache_log /var/log/squid/cache.log
2023/01/25 11:16:15| Processing: acl todos src all
2023/01/25 11:16:15| Processing: acl LAN src 192.168.0.0/24
2023/01/25 11:16:15| Processing: acl localhost src 127.0.0.1/32
2023/01/25 11:16:15| WARNING: (B) '127.0.0.1' is a subnetwork of (A) '127.0.0.1'
2023/01/25 11:16:15| WARNING: because of this '127.0.0.1' is ignored to keep splay tree searching predictable
2023/01/25 11:16:15| WARNING: You should probably remove '127.0.0.1' from the ACL named 'localhost'
2023/01/25 11:16:15| WARNING: (B) '127.0.0.1' is a subnetwork of (A) '127.0.0.1'
2023/01/25 11:16:15| WARNING: because of this '127.0.0.1' is ignored to keep splay tree searching predictable
2023/01/25 11:16:15| WARNING: You should probably remove '127.0.0.1' from the ACL named 'localhost'
2023/01/25 11:16:15| Processing: acl websDenegadas dstdomain "/etc/squid/websDenegadas"
2023/01/25 11:16:15| Processing: acl palabrasDenegadas url_regex "/etc/squid/palabrasDenegadas"
2023/01/25 11:16:15| Processing: http_access deny websDenegadas
2023/01/25 11:16:15| Processing: http_access deny palabrasDenegadas
2023/01/25 11:16:15| Processing: http_access allow LAN
2023/01/25 11:16:15| Processing: http_access allow localhost
2023/01/25 11:16:15| Processing: http_access deny all
2023/01/25 11:16:15| Initializing https:// proxy context
```
Iniciamos el servicio de squid con systemctl:
```bash
┌──(root@kali)-[/etc/squid]
└─# systemctl start squid
┌──(root@kali)-[/etc/squid]
└─# systemctl status squid
● squid.service - Squid Web Proxy Server
     Loaded: loaded (/lib/systemd/system/squid.service; disabled; preset: disabled)
     Active: active (running) since Wed 2023-01-25 11:17:37 CET; 1s ago
       Docs: man:squid(8)
    Process: 20965 ExecStartPre=/usr/sbin/squid --foreground -z (code=exited, status=0/SUCCESS)
   Main PID: 20968 (squid)
      Tasks: 4 (limit: 2275)
```
Y con nmap comprobamos que está funcionando por el puerto 3128:
```bash
┌──(root@kali)-[/etc/squid]
└─# nmap localhost
Starting Nmap 7.93 ( https://nmap.org ) at 2023-01-25 11:18 CET
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0000030s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 998 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
3128/tcp open  squid-http
```

# PROBAMOS SQUID DESDE UN CLIENTE
Vamos a abrir un cliente windows para comprobar si el proxy está funcionando, por tanto vamos a los ajustes del sistema e indicamos la IP y el puerto del servidor proxy:
```bash 
┌──(root@kali)-[/etc/squid]
└─# ifconfig
eth0: flags=4163<UP,BROADCAST
      inet 192.168.0.11 r
      inet6 fe80::a00:27ff
```
![[Pasted image 20230125112249.png]]
Y ahora ya tenemos el proxy activado, por lo que si intentamos acceder a uno de los dominios denegados como marca.es, veremos que se bloquea:
![[Pasted image 20230125112348.png]]
Pero en cambio si vamos a cualquier otra web sí podremos porque sólo el marca y el sport estaban bloqueados:
![[Pasted image 20230125112433.png]]
## IMPLEMENTAR AUTENTICACIÓN Y GESTIÓN DE LOGS
Añadimos estas nuevas líneas dentro del fichero de configuración del proxy, donde decimos primero donde estará el fichero que guardará las claves, después el número máximo de usuarios conectados simultáneamente:
```bash
# Autenticación
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/claves
auth_param basic children 5
auth_param basic realm "Proxy ASIR: Identifíquese"
auth_param basic credentialsttl 2 hours
acl autenticacion proxy_auth REQUIRED
```
Y también debemos crear esta línea dentro de las líneas de autenticación, para activarlo:
```bash
# Control de acceso
http_access deny websDenegadas
http_access deny palabrasDenegadas
http_access allow autenticacion
http_access allow LAN
http_access allow localhost
```
Y ahora dentro del control de acceso creamos esta nueva regla para que se permita la autenticación:

Así debería quedarnos:
```bash
# Autenticación
auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/claves
auth_param basic children 5
auth_param basic realm "Proxy ASIR: Identifíquese"
auth_param basic credentialsttl 2 hours
acl autenticacion proxy_auth REQUIRED

# Control de acceso
http_access deny websDenegadas
http_access deny palabrasDenegadas
http_access allow autenticacion
http_access allow LAN
http_access allow localhost
```
### CREAR CREDENCIALES PARA QUE SÓLO PUEDAN NAVEGAR LOS USUARIOS REGISTRADOS
Para crear credenciales para los usuarios, necesitamos un paquete que se llama htpasswd, que lo podemos obtener con el comando apt install apache2-utils:
```bash
┌──(root@kali)-[/etc/squid]
└─# apt install apache2-utils
```
Y ahora por ejemplo vamos a crear el usuario Juan con una contraseña que nos va a encriptar (en mi caso será la contraseña alvarez):
```bash
┌──(root@kali)-[/etc/squid]
└─# htpasswd -c /etc/squid/claves juan
New password: 
Re-type new password: 
Adding password for user juan
```
Ahora dentro del fichero tenemos el usuario juan con su contraseña encriptada:
```bash
┌──(root@kali)-[/etc/squid]
└─# cat claves
juan:$apr1$2/NlhJ1R$RDWXqpS0pRQKwOZT/EXxL1

```
Ahora una vez que lo tengamos todo listo, ya podemos reiniciar el servicio con un systemctl restart squid:
```bash
┌──(root@kali)-[/etc/squid]
└─# systemctl restart squid
```
Y ahora si vamos al equipo cliente veremos que nos está pidiendo unas credenciales, donde el usuario era juan y la contraseña alvarez:
![[Pasted image 20230125115206.png]]
Y el tráfico denegado sigue denegado de esta forma, ya que sólamente con esta configuración estamos estableciendo unas credenciales:
![[Pasted image 20230125115554.png]]
## DENEGAR TRÁFICO A UN DETERMINADO EQUIPO
Si queremos denegar todo el tráfico a un determinado equipo, tenemos que ir dentro de las líneas de ACLs y añadir esta, donde pondremos la IP:
```bash 
# ACLs
acl todos src all
acl LAN src 192.168.0.0/24
acl pc_windows src 192.168.0.4/32
acl websDenegadas dstdomain "/etc/squid/websDenegadas"
acl palabrasDenegadas url_regex "/etc/squid/palabrasDenegadas"
```
Y añadimos la etiqueta de este equipo en esta otra línea:
```bash
# Control de acceso
http_access deny websDenegadas
http_access deny palabrasDenegadas
http_access deny pc_windows
http_access allow autenticacion
http_access allow LAN
http_access allow localhost
```
Reiniciamos el servicio como siempre y veremos que ya no podemos navegar desde el equipo Windows:
![[Pasted image 20230125120108.png]]
Por último, si queremos comprobar los logs de accesos desde las máquinas clientes, podemos acceder al fichero /var/log/squid.conf (que lo habíamos configurado anteriormente), y vemos que podemos acceder a ellos e incluso vemos la dirección IP del equipo cliente con las acciones que hizo:
```bash
1674642192.562     0 192.168.0.4 TCP_DENIED/403 4000 CONNECT www.marca.es:443 - HIER_NONE/- text/html
1674642192.562     0 192.168.0.4 TCP_DENIED/403 4000 CONNECT www.marca.es:443 - HIER_NONE/- text/html
1674642192.570     0 192.168.0.4 TCP_DENIED/403 4000 CONNECT www.marca.es:443 - HIER_NONE/- text/html
1674642192.602     3 192.168.0.4 TCP_DENIED/403 4358 GET http://www.marca.es/ - HIER_NONE/- text/html
1674642192.679   20 192.168.0.4 TCP_HIT/200 13063 GET http://proxymario:3128/squid-internal-static/icons/SN.png - HIER_NONE/- image/png
1674642192.718     0 192.168.0.4 TCP_DENIED/403 4313 GET http://www.marca.es/favicon.ico - HIER_NONE/- text/html
1674642197.413    73 192.168.0.4 TCP_MISS/200 681 HEAD http://edgedl.me.gvt1.com/edgedl/release2/chrome_component/d...
1674642197.841    33 192.168.0.4 TCP_MISS/200 5503 GET http://edgedl.me.gvt1.com/edgedl/release2/chrome_component/d...
1674642220.554   555 192.168.0.4 TCP_TUNNEL/200 2955 CONNECT slscr.update.microsoft.com:443 - HIER_DIRECT/52.242.10...
1674642221.123   506 192.168.0.4 TCP_TUNNEL/200 2957 CONNECT slscr.update.microsoft.com:443 - HIER_DIRECT/52.242.10...
1674642222.916   285 192.168.0.4 TCP_TUNNEL/200 35900 CONNECT settings-win.data.microsoft.com:443 - HIER_DIRECT/51...
1674642223.094    63 192.168.0.4 TCP_MISS/200 7842 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642223.114    18 192.168.0.4 TCP_MISS/200 7840 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642223.134    20 192.168.0.4 TCP_MISS/200 7842 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642223.155    19 192.168.0.4 TCP_MISS/200 7844 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642223.176    18 192.168.0.4 TCP_MISS/200 7835 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.200    19 192.168.0.4 TCP_MISS/200 7835 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.224    21 192.168.0.4 TCP_MISS/200 11395 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.244    19 192.168.0.4 TCP_MISS/200 11399 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.267    21 192.168.0.4 TCP_MISS/200 11374 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.288    19 192.168.0.4 TCP_MISS/200 11405 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.307    18 192.168.0.4 TCP_MISS/200 11379 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.328    19 192.168.0.4 TCP_MISS/200 11181 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.350    20 192.168.0.4 TCP_MISS/200 11211 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.377    19 192.168.0.4 TCP_MISS/200 11415 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.398    20 192.168.0.4 TCP_MISS/200 11406 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.457    19 192.168.0.4 TCP_MISS/200 11221 GET http://download.windowsupdate.com/c/msdownload/update/d/others/...
1674642223.506   530 192.168.0.4 TCP_TUNNEL/200 16788 CONNECT settings-win.data.microsoft.com:443 - HIER_DIRECT/51...
1674642223.720   284 192.168.0.4 TCP_TUNNEL/200 6069 CONNECT settings-win.data.microsoft.com:443 - HIER_DIRECT/51...
1674642225.076    25 192.168.0.4 TCP_MISS/200 7762 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642225.096    18 192.168.0.4 TCP_MISS/200 7762 GET http://download.windowsupdate.com/c/msdownload/update/others/...
1674642225.117    20 192.168.0.4 TCP_MISS/200 7754 GET http://download.windowsupdate.com/c/msdownload/update/others/...
```
