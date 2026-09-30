El primer paso será configurar una IP estática añadiendo la siguiente configuración al fichero de interfaces:
![[Pasted image 20231023155831.png]]
Y ya tenemos correctamente configurada nuestra IP estática:
```bash
servidor@servidor:~$ ifconfig
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::b0d7:d864:d264:ca1c  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:00:5b:a5  txqueuelen 1000  (Ethernet)
        RX packets 24  bytes 2529 (2.5 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 63  bytes 7774 (7.7 KB)
        TX errors 0  dropped 0  overruns 0  carrier 0  collisions 0
```
Y procedemos a cambiar el nombre de nuestro equipo en /etc/hostname:
```bash
                        /etc/hostname
    server                                  
```
Añadimos las zonas que crearemos más adelante dentro del named.conf.default-zones:
```bash
# Nuevas zonas

zone "alvarez.local" {
        type master;
        file "/etc/bind/db.alvarez.local";
};

zone "0.168.192.in-addr.arpa" {
        type master;
        file "/etc/bind/db.0.168.192";
};
```
```bash
zone "255.in-addr.arpa" {
	type master;
	file "/etc/bind/db.255";
};

# Nuevas zonas

zone "alvarez.local" {
	type master;
	file "/etc/bind/db.alvarez.local";
};

zone "0.168.192.in-addr.arpa" {
	type master;
	file "/etc/bind/db.0.168.192";
};
```

Ahora el siguiente paso será abrir el archivo named.conf.options y añadir las siguientes líneas:
```bash
options {
	directory "/var/cache/bind";
	forwarders {
		1.1.1.1;
		9.9.9.9;
	};
	dnssec-validation auto;
	auth-nxdomain no;
	listen-on { any; };
	listen-on-v6 { any; };
	allow-query{
		192.168.0.0/24;
		localhost;
	};
};
```
Ahora abrimos el archivo named.conf.options y añadimos las siguientes líneas:
```bash
options {
	directory "/var/cache/bind";
	forwarders {
		1.1.1.1;
		9.9.9.9;
	};
	dnssec-validation auto;
	auth-nxdomain no;
	listen-on { any; };
	listen-on-v6 { any; };
	allow-query{
		192.168.0.0/24;
		localhost;
	};
};
```
En la zona de búsqueda directa, añade un registro A llamado servidor con la IP 192.168.0.100, dos registros de tipo A: pc1 y pc2 que tendrán las direcciones IP 192.168.0.30 para el pc1 y la 192.168.0.31 para el pc2, además de un registro de tipo CNAME ‘ftp’ apuntando a servidor, otro registro de tipo NS apuntando al equipo servidor, y un intercambiador de correo MX con prioridad 10 apuntando a servidor. Por lo que editamos el archivo db.alvarez.local:
```bash
; Zona para el dominio alvarez.local

$TTL 1D
@       IN      SOA     alvarez.local. root.alvarez.local. (
                        1         ; número de serie
                        604800    ; tiempo de refresco (1 semana)
                        86400     ; tiempo de reintento (1 día)
                        2419200   ; tiempo de expiración (4 semanas)
                        86400 )   ; tiempo de vida en caché (1 día)

@       IN      NS      servidor.alvarez.local.
@       IN      MX      10 servidor.alvarez.local.
servidor IN      A       192.168.0.100
pc1      IN      A       192.168.0.30
pc2      IN      A       192.168.0.31
dns      IN      CNAME   servidor.alvarez.local.
www      IN      CNAME   servidor.alvarez.local.
mail     IN      CNAME   servidor.alvarez.local.
```
Y ahora abrimos el fichero db.0.168.192 que hemos creado anteriormente y le añadimos lo siguiente:
```bash
; Zona inversa para la red 192.168.0.0/24

$TTL 86400
@       IN      SOA     alvarez.local. root.alvarez.local. (
                        1         ; número de serie
                        604800    ; tiempo de refresco (1 semana)
                        86400     ; tiempo de reintento (1 día)
                        2419200   ; tiempo de expiración (4 semanas)
                        86400 )   ; tiempo de vida en caché (1 día)

@       IN      NS      servidor.alvarez.local.
100     IN      PTR     servidor.alvarez.local.
30      IN      PTR     pc1.alvarez.local.
31      IN      PTR     pc2.alvarez.local.
```
Por último, si ejecutamos el comando named-checkconf, vemos que no nos muestra ningún error:
```bash
named-checkconf
named-checkzone alvarez.local db.alvarez.local
named-checkzone 0.168.192.in-addr.arpa db.0.168.192
```
Reiniciamos el servicio y comprobamos que se esté ejecutando:
Una vez hecho todo lo anterior, verificamos con el comando nmcli dev show | grep DNS los servidores DNS existentes, donde podemos ver el que acabamos de crear:
```bash
root@servidor:/etc/bind# nmcli dev show | grep DNS
IP4.DNS[1]:                             192.168.0.100
IP4.DNS[2]:                             8.8.8.8
root@servidor:/etc/bind#
```
Por último, editamos el fichero resolv.conf para añadir nuestro servidor DNS:
```bash
# Do not edit.
#
# This file might be symlinked as /etc/resolv.conf. If you're looking at
# /etc/resolv.conf and seeing this text, you have followed the symlink.
#
# This is a dynamic resolv.conf file for connecting local clients to the
# internal DNS stub resolver of systemd-resolved. This file lists all
# configured search domains.
#
# Run "resolvectl status" to see details about the uplink DNS servers
# currently in use.
#
# Third party programs should typically not access this file directly, but only
# through the symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a
# different way, replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 192.168.0.100
nameserver 8.8.8.8
options edns0 trust-ad
search .
```