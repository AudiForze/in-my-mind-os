Para configurar las redes de Linux, tendremos que modificar el fichero de configuración de netplan, que lo encontramos en la ruta /etc/netplan:
```bash
root@server:/home/mario# cd /etc/netplan
root@server:/etc/netplan# ls
00-installer-config.yaml
root@server:/etc/netplan#
```
Este fichero con extensión .yaml será el que tengamos que modificar:
```bash
# This is the network config written by 'subiquity'
network:
  ethernets:
    enp0s3:
      addresses: [192.168.1.2/24]
  version: 2
```
Y podremos añadir nosotros la configuración que queramos:
```bash
# This is the network config written by 'subiquity'
network:
  ethernets:
    enp0s3:
      addresses: [192.168.0.25/24]  # Ponemos la IP que queramos
      gateway4: 192.168.0.1  # La puerta de enlace
      nameservers:
        addresses: [8.8.8.8]  # Servidores DNS
      dhcp4: false  # Desactivamos el protocolo DHCP.
  version: 2
```
```bash
# This is the network config written by 'subiquity'
network:
  ethernets:
    enp0s3:
      addresses: [192.168.0.10/24] # Ponemos la IP que queramos
      gateway4: 192.168.0.1 # La puerta de enlace
      nameservers:
        addresses: [8.8.8.8] # Servidores DNS
      dhcp4: false # Desactivamos el protocolo DHCP.
  version: 2

```
Ahora sólo tenemos que aplicar los cambios con el comando `netplan apply`
Y si hacemos un ifconfig ya vemos la nueva configuración:
```bash
root@server:/etc/netplan# ifconfig
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.10  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::a00:27ff:fe2a:8920  prefixlen 64  scopeid 0x20<link>
        inet6 ::a00:27ff:fe2a:8920  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:2a:89:20  txqueuelen 1000  (Ethernet)
        RX packets 114465  bytes 166363702 (166.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 16829  bytes 1164171 (1.1 MB)
        TX errors 0  dropped 0  overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3440  bytes 249523 (249.5 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3440  bytes 249523 (249.5 KB)
        TX errors 0  dropped 0  overruns 0  carrier 0  collisions 0
```
