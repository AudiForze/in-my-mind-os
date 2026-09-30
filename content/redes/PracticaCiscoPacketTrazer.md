# Practica Complicada

# NOTA:

**The LMI type must be manually configured as q933a for HQ, B1, and B2. B3 uses ANSI.**

---

Como ya he hecho en los demas en este documento voy a escribir todo lo necesario para completar la practica final

### Terminos a conocer

```jsx
-Frame Relay Point-To-Point
-LMI type
-Dlci
```

### Enlaces

https://ccnadesdecero.es/como-configurar-frame-relay/

### Contenido

La configuración manual del tipo de LMI es optativa, ya que los routers Cisco detectan automáticamente el tipo de LMI de manera predeterminada. Recuerde que Cisco admite tres tipos de LMI: cisco, ANSI anexo D y Q933-A anexo A. El tipo de LMI predeterminado para los routers Cisco es cisco.

### Configuración de las subinterfaces punto a punto

Para crear una subinterfaz, utilice el comando:

```arduino
router(config-if)#interface serialnumber.subinterface-number {multipoint |point-to-point}
```

Para simplificar la resolución de problemas, utilice el DLCI como número de subinterfaz. También debe especificar si la interfaz es punto a multipunto o punto a punto con la palabra clave multipoint o point-to-point, ya que no hay un valor predeterminado. Estas palabras clave se definen en la tabla:

!Untitled

Untitled

`R1(config-if)# **interface serial 0/0/0.103 point-to-point**`

### Configuración del DLCI

Si la subinterfaz se configura como punto a punto, también se debe configurar el DLCI local de la subinterfaz para distinguirlo de la interfaz física. El DLCI también se requiere para las subinterfaces multipunto con ARP inverso habilitado para IPv4. No se requiere para las subinterfaces multipunto configuradas con mapas de rutas estáticas.

```arduino
router(config-subif)# frame-relay interface-dlci dlci-number
```

### Resolucion.

Lo primero que hacemos es entrar al router hq y hacer la configuracion basica del nombre y contraseña, para luego utilizar la siguiente serie de comandos, con el cambio en los valores de {ip} {mascara} {Dcli}

```arduino
int Se0/0/0
encapsulation frame-relay
frame-relay lmi-type Q933a
no sh
//////////Configuracion de subinterfaces////////
int S0/0/0.4() point-to-point
ip add {ip} {mascara}
0frame-relay interface-dlci 4()
```

## Configuracion De los otros routers (B1,B2,B3)

Basado en un pequeño analis logico el manual no dice que tenemos que poner la segunda direccion ip del serial, para esto vamos a utilizar la siguiente secuencia de comandos

```arduino
int Se0/0/0
ip add 10.255.255.2 255.255.255.252
encapsulation frame-relay
frame-relay lmi-type q33a
exit
```

### Paso 3: verificar la conexion

para este paso vamos a utilizar el formato base del router (Enable) y utilizaremos el comando `ping 10.255.255.x` y el resultado tiene que se positivo o `(succes (5/5)`

### Task 2: Configure PPP with CHAP and PAP Authentication

Para esto que nos tardo un buen tiempo vamos a utilizar el metodo de autentificacion PAP, para eso utilizaremos la siguiente estructura de comando:

### Enlace:

```arduino
username ISP password ciscochap
int Se0/1/0
ip add 209.165.201.1 255.255.255.252
encaptulation ppp
ppp authentication chap
no sh
exit
```

https://contenthub.netacad.com/legacy/CCNA/CoN/6.0/es/course/files/2.3.2.6 Packet Tracer - Configuring PAP and CHAP Authentication.pdf

### Step 2. Configure the WAN link from HQ to NewB using PPP encapsulation and PAP authentication.

Para esta parte vamos a conectar el cable DCE desde el router HQ hasta el router que no esta conectado, paa eunsto utilizaremos en la configuracion el comando clock rate (se usa para el sincronismo de la conexión en serie. Sin el clockrate, la conexión no funciona porque no haya ningún entendimiento de la velocidad de los datos enviados entre los dos extremos de la conexión. (Esta parte si estuvo bien pesada). para esta parte tambien se utiliza un comando llamado ppp pap sent-username x password y.

```arduino
username ISP password ciscochap
int Se0/1/0
clock rate 64000
ip add 209.165.201.1 255.255.255.252
encaptulation ppp
ppp authentication chap
ppp pap sent-username HQ password ciscopap
no sh
exit
```

### Enlaces

https://www.youtube.com/watch?v=weOirQq27xE

## Task 3: Configure Static and Dynamic NAT on HQ

Para esta parte en la cual tardamos como (1h) vamos a utilizar el router (HQ) como router NAT y vamos sacar a la interfaz (Se0/1/0) del nat y vamos a meter a todas las demas.

Dibujo (FEO)

**NAT:**
La traducción de direcciones de red, también llamado enmascaramiento de IP o NAT, es un mecanismo utilizado por routers IP para cambiar paquetes entre dos redes que asignan mutuamente direcciones incompatibles.

```arduino
HQ(config)#interface Serial0/1/0
HQ(config-if)#ip nat out
HQ(config-if)#
%LINEPROTO-5-UPDOWN: Line protocol on Interface Serial0/0/1, changed state to up

HQ(config-if)#int f0/0
HQ(config-if)#ip nat in
HQ(config-if)#int Se0/0/1
HQ(config-if)#ip nat in
HQ(config-if)#int Se0/0/0.41
HQ(config-subif)#ip nat in
HQ(config-subif)#int Se0/0/0.42
HQ(config-subif)#ip nat in
HQ(config-subif)#int Se0/0/0.43
HQ(config-subif)#ip nat in
HQ(config-subif)#exit
HQ(config)#
```

### Task 3: Configure Static and Dynamic NAT on HQ

!Untitled

Untitled

Segun chat-gpt utilizando el comano Ip access-list standard nat-list podemos crear una lista de acceso para la nat.

```arduino
HQ#
HQ#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
HQ(config)#ip access-list standard NAT_LIST
HQ(config-std-nacl)#permit 10.0.0.0 0.255.255.255
HQ(config-std-nacl)#exit
HQ(config)#ip nat pool XYZCORP 209.165.200.241 209.165.200.245 net 255.255.255.248
HQ(config)#ip  nat inside source list Nat-list pool XYZCORP overload
HQ(config)#ip nat inside source static 10.0.1.2 209.165.200.246
HQ(config)#exi
```

### Verificar la conexion

```arduino
HQ#ping
Protocol [ip]:
Target IP address: 209.165.201.2
Repeat count [5]:
Datagram size [100]:
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: fastethernet0/0
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]:
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 209.165.201.2, timeout is 2 seconds:
Packet sent with a source address of 10.0.1.1
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/25/47 ms

HQ#show ip nat translations
Pro  Inside global     Inside local       Outside local      Outside global
icmp 209.165.200.241:3710.0.1.1:37        209.165.201.2:37   209.165.201.2:37
icmp 209.165.200.241:3810.0.1.1:38        209.165.201.2:38   209.165.201.2:38
icmp 209.165.200.241:3910.0.1.1:39        209.165.201.2:39   209.165.201.2:39
icmp 209.165.200.241:4010.0.1.1:40        209.165.201.2:40   209.165.201.2:40
icmp 209.165.200.241:4110.0.1.1:41        209.165.201.2:41   209.165.201.2:41
---  209.165.200.246   10.0.1.2           ---                ---
```

### Configure Static and Default Routing

Para esta parte vamos a poner la direccion ip 0.0.0.0 de la mascara 0.0.0. por el serial del ISP para luego configura el otro lado (News B) que tiene la direccion ip 10.4.5.0

```arduino
HQ(config)#ip route 0.0.0.0 0.0.0.0 Se0/1/0
HQ(config)#ip route 10.4.5.0 255.255.255.0 Se0/0/1
```

### Configure the Branch routers with a default route to HQ.

Para esta parte vamos a utilizar el comando de ip route para dirigir cualquier trafico externo a esa red por la via del next-hop

```arduino
ip route 0.0.0.0 0.0.0.0 10.255.255.{x}
```

## Task 5. configure inter-vlan.

```arduino
B1>en
B1#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
B1(config)#int f0/0
B1(config-if)#no sh

B1(config-if)#
%LINK-5-CHANGED: Interface FastEthernet0/0, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0, changed state to up

B1(config-if)#exit
B1(config)#int f0/0.10
B1(config-subif)#
%LINK-5-CHANGED: Interface FastEthernet0/0.10, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0.10, changed state to up

B1(config-subif)#enca
B1(config-subif)#encapsulation d
B1(config-subif)#encapsulation dot1Q 10
B1(config-subif)#ip add 10.1.10.1 255.255.255.0
B1(config-subif)#int f0/0.20
B1(config-subif)#
%LINK-5-CHANGED: Interface FastEthernet0/0.20, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0.20, changed state to up

B1(config-subif)#enc
B1(config-subif)#encapsulation d
B1(config-subif)#encapsulation dot1Q 20
B1(config-subif)#ip add 10.1.10.1 255.255.255.0
% 10.1.10.0 overlaps with FastEthernet0/0.10
B1(config-subif)#ip add 10.1.20.1 255.255.255.0
B1(config-subif)#int fa0/0.30
B1(config-subif)#
%LINK-5-CHANGED: Interface FastEthernet0/0.30, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0.30, changed state to up

B1(config-subif)#enc
B1(config-subif)#encapsulation d
B1(config-subif)#encapsulation dot1Q 30
B1(config-subif)#ip add 10.1.30.1 255.255.255.0
B1(config-subif)#int f0/0.88
B1(config-subif)#
%LINK-5-CHANGED: Interface FastEthernet0/0.88, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0.88, changed state to up

B1(config-subif)#en
B1(config-subif)#encapsulation d
B1(config-subif)#encapsulation dot1Q 88
B1(config-subif)#ip add 10.1.88.1 255.255.255.0
B1(config-subif)#int fa0/0.99
B1(config-subif)#
%LINK-5-CHANGED: Interface FastEthernet0/0.99, changed state to up

%LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/0.99, changed state to up

B1(config-subif)#enc
B1(config-subif)#encapsulation
B1(config-subif)#encapsulation dot1Q 99
B1(config-subif)#ip add 10.1.99.1 255.255.255.0
```

### Task 6: configure and optimeze EIGRP Routing

### Configure HQ,b1,B2,B3

El eigrp se utiliza para hacer un mapeado de las comunicaciones con los vecinos (router).

Es un **protocolo de enrutamiento híbrido** propiedad de Cisco . La **configuración** de **EIGRP** es similar a la de otros **protocolos de enrutamiento** . En este ejemplo, configuraremos **EIGRP en Packet Tracer con enrutadores Cisco.** .

Con esta **configuración de EIGRP** , aprenderemos **comandos importantes de Cisco EIGRP** en Cisco Packet Tracer. Para nuestro **ejemplo de configuración de EIGRP** , utilizaremos la siguiente topología que consta de cuatro enrutadores y cuatro PC en Packet Tracer.

### Enlaces:

https://ccnadesdecero.es/configuracion-eigrp-con-ipv4-ejemplo/https://ccnadesdecero.es/sumarizacion-eigrp-automatica-y-manual/

```arduino
////////////////////HQ/////////////////////
B1>en
B1#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
B1(config)#router eigrp 100
B1(config-router)#passive-inter
B1(config-router)#passive-interface fa0/0.10
B1(config-router)#passive-interface fa0/0.20
B1(config-router)#passive-interface fa0/0.30
B1(config-router)#passive-interface fa0/0.99
B1(config-router)#network 10.0.0.0
B1(config-router)#
%DUAL-5-NBRCHANGE: IP-EIGRP 100: Neighbor 10.255.255.1 (Serial0/0/0) is up: new adjacency

B1(config-router)#no auto-summary
///////////////////////B1-B2-B3/////////////////////////
B1(config)#router eigrp 100
B1(config-router)#passive-inter
B1(config-router)#passive-interface fa0/0.10
B1(config-router)#passive-interface fa0/0.20
B1(config-router)#passive-interface fa0/0.30
B1(config-router)#passive-interface fa0/0.99
B1(config-router)#network 10.0.0.0
B1(config-router)#
B1(config-router)#int Se0/0/0
B1(config-if)#ip summary-address eigrp 100 10.1.0.0 255.255.0.0
```

### Task7: configure vtp domain

Para esto que ya habiamos trabajado vamos a utilizar la sigueinte secuencia de comandoas para crear un servidor y 2 clientes en cada red utilizando el `dominio de xyzcorp` y la `password de xyzvtp`

```arduino
Switch>en
Switch#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
Switch(config)#hostname B3-S3
B3-S3(config)#vtp mode client
Setting device to VTP CLIENT mode.
B3-S3(config)#vtp domain xyzcorp
Changing VTP domain name from NULL to xyzcorp
B3-S3(config)#vtp password vtp
Setting device VLAN database password to vtp
```

### Step 2. Configure trunking on BX-S1, BX-S2, and BX-S3.

```arduino
B2-S2>en
B2-S2#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
B2-S2(config)#int range fa0/1-5
B2-S2(config-if-range)#swit
B2-S2(config-if-range)#switchport trunk native vlan 99
B2-S2(config-if-range)#sw
B2-S2(config-if-range)#switchport mode trunk
```

### Step 2. Configure trunking on BX-S1, BX-S2, and BX-S3.

En esta parte vamos a establecer el modo trunk y vamos a poner la vlan 99 que configuramos con este proposito.

```arduino
B1-S3(config)#int range f0/1-4
B1-S3(config-if-range)#switchport trunk native vlan 99
B1-S3(config-if-range)#switchport mode trunk
```

### Step 3. Configure the VLAN interface and default gateway on BX-S1, BX-S2, and BX-S3.

Esta es la parte que nos lleva al 50%, simplemente el configurar el gateway del swtich

```arduino
B3-S1(config)#ip default-gateway 10.3.99.1
B2-S1(config)#ip default-gateway 10.2.99.1
B1-S1(config)#ip default-gateway 10.1.99.1

B1-S1(config)#int vlan 99
B1-S1(config-if)#ip add 10.1.99.21 255.255.255.0
B1-S1(config-if)#no sh
B1-S1(config-if)#
```

!Untitled

Untitled

### Step 4. Create the VLANs on BX-S1.

Crear las vlan en los router, en el servidor para que se cree en los clientes pertenecientes al mismo dominio.

```arduino
B1-S1>
B1-S1>en
B1-S1#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
B1-S1(config)#vlan 10
B1-S1(config-vlan)#name Admin
B1-S1(config-vlan)#vlan 20
B1-S1(config-vlan)#name Sales
B1-S1(config-vlan)#vlan 30
B1-S1(config-vlan)#name Production
B1-S1(config-vlan)#vlan 88
B1-S1(config-vlan)#name Wireless
B1-S1(config-vlan)#vlan 99
B1-S1(config-vlan)#name Mgmt&Native
```

### Step 5. Verify that VLANs have been sent to BX-S2 and BX-S3.

Esto es solo verificar el estado de las vlans y el vtp(domain) al que pertenecen cada uno de los switch que estan en modo cliente.

```arduino
Sh vtp passw
sh vtp status
sh vlan
```

### Task 8: Assign VLANs and Configure Port Security

```arduino
int f0/(6)(11)(16)
switchport mode access
switchport access vlan (x)
```

### Step 2. Configure port security.

*Todas las configuraciones (a menos que no se haga la salvedad) serán configuradas en el modo de configuración de la interfaz* (**nombre_switch(config-if)#**), *para ingresar a este modo se utiliza el comando “**interface**” desde el modo de configuración global (***Primer_switch(config)#***) en conjunto con el nombre de la interfaz. Por ejemplo* [**nombre_switch(config)#interface fastEthernet 0/1**]*.*

### Enlaces

https://theosnews.com/2013/02/configurar-seguridad-en-los-puertos-de-un-switch-cisco/

```arduino
B1-S2(config)#int f0/6
B1-S2(config-if)#switchport access vlan 10
B1-S2(config-if)#switchport mode access
B1-S2(config-if)#switchport port-security
B1-S2(config-if)#switchport port-security maximum 1
B1-S2(config-if)#switchport port-security mac-address sticky
B1-S2(config-if)#switchport port-security violation shutdown
```

### Configurar la seguridad (MAC)

```arduino
B1-S2>en
B1-S2#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
B1-S2(config)#int f0/6
B1-S2(config-if)#swi
B1-S2(config-if)#switchport access vlan 10
B1-S2(config-if)#sw
B1-S2(config-if)#switchport mode access
B1-S2(config-if)#swit
B1-S2(config-if)#switchport port-security
B1-S2(config-if)#switchport port-security maximun 1
                                                ^
% Invalid input detected at '^' marker.

B1-S2(config-if)#switchport port-security maximum 1
B1-S2(config-if)#sw
B1-S2(config-if)#switchport port-security mac-address
% Incomplete command.
B1-S2(config-if)#switchport port-security mac-address sticky
B1-S2(config-if)#sw
B1-S2(config-if)#switchport port-se
B1-S2(config-if)#switchport port-security violation shutdown
B1-S2(config-if)#int f0/16
B1-S2(config-if)#sw
B1-S2(config-if)#switchport acc
B1-S2(config-if)#switchport access vlan 30
B1-S2(config-if)#sw
B1-S2(config-if)#switchport mode access
B1-S2(config-if)#sw
B1-S2(config-if)#switchport port-
B1-S2(config-if)#switchport port-security
B1-S2(config-if)#switchport port-security maximum 1
B1-S2(config-if)#switchport port-security mac-address sticky
B1-S2(config-if)#switchport port-security violation shutdown
B1-S2(config-if)#exit
B1-S2(config)#int F0/11
B1-S2(config-if)#switch
B1-S2(config-if)#switchport access vlan 20
B1-S2(config-if)#swit
B1-S2(config-if)#switchport mode access
B1-S2(config-if)#sw
B1-S2(config-if)#switchport p
B1-S2(config-if)#switchport port
B1-S2(config-if)#switchport port-security
B1-S2(config-if)#switchport port-security maximum 1
B1-S2(config-if)#switchport port-security mac-address
% Incomplete command.
B1-S2(config-if)#switchport port-security mac-address sticky
B1-S2(config-if)#switchport port-security violation shutdown
```

### Step 3. Verify VLAN assignments and port security

Enlaces
https://theosnews.com/2013/02/configurar-seguridad-en-los-puertos-de-un-switch-cisco/

```arduino
show port-security interface(f0/6)(f0/11)(f0/16)
```

## Task 9: Configure STP

### Step 1. Configure BX-S1 as the root bridge.

```arduino
spanning-tree vlan 1-1001 priority 4096
```

### Configure BX-S1 as the root bridge.

```arduino
spanning-tree vlan 1-1001 priority (8192)-(4096)
```

## Task 10: Configure DHCP

### Step 1. Configure DHCP pools for each VLAN.

Enalces:

https://www.computernetworkingnotes.com/ccna-study-guide/configure-dhcp-server-for-multiple-vlans-on-the-switch.html

```arduino
Bx(config)#ip dhcp excluded-address 10.1.10.1 10.1.10.10
Bx(config)#ip dhcp excluded-address 10.1.20.1 10.1.20.10
Bx(config)#ip dhcp excluded-address 10.1.30.1 10.1.30.10
Bx(config)#ip dhcp excluded-address 10.1.88.1 10.1.88.10
```

entonces luego de asignar los rango de las direcciones ip del dhcp vamos a configurar el dhcp en la vlan.

```arduino
B1(config)# ip dhcp pool B1_vlan10
B1(dhcp-config)#network 10.1.10.0 255.255.255.0
B1(dhcp-config)#default-router 10.1.10.1
B1(dhcp-config)#dns-server 10.0.1.4
```

y repetiremos este proceso con todos las vlans y luego con todas las vlans

### Step 2: Configure the PCs to use DHCP.

Ahora vamos a configurar las pc las pc en Dhcp en modo trafico

### Task 11: Configure a Firewall ACL

Esta es la parte de la configuracion del router donde vamos a decir el firewall que deseas utilizar en estecaso vamos a restringir puertos.

```arduino
HQ>en
HQ#conf t
Enter configuration commands, one per line.  End with CNTL/Z.
HQ(config)#ip access-list extend FIREWALL
HQ(config-ext-nacl)#permit tcp any host 209.165.200.244 eq www
HQ(config-ext-nacl)#permit tcp any any established
HQ(config-ext-nacl)#permit icmp any any echo-reply
HQ(config-ext-nacl)#exit
HQ(config)#int Se0/0/0
HQ(config-if)#ip access-group FIREWALL in
HQ(config-if)#exit
HQ(config)#
```

### Step 3. Verify connectivity from Outside Host.

Para este punto, ya unos estaban con sueño y otros estabamos locos pero el cafe con coca-cola nos matenia despiertos.
pd: ya no se lo que escribo

Referente a la practica: para esto lo unico que tenemos que hacer es desde la `outside host` hacer el ping al `www.xyzcorp.com`

### Task 12: Configure Wireless Connectivity

Utilizamos el ssid cisco packet tracer como un identificador(nombre) para identificar la red, esto lo haremos desde la parte grafica(GUI) de el WSrouter(Wireless Router)