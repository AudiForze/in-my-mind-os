Las VLAN se utilizan para segmentar redes conmutadas. Los switches de capa 2, tales como los de la serie Catalyst 2960, se pueden configurar con más de 4000 VLAN. Una VLAN es un dominio de difusión, por lo que las computadoras en VLAN separadas no pueden comunicarse sin la intervención de un dispositivo de routing. Los switches de capa 2 tienen una funcionalidad muy limitada en cuanto a IPv4 e IPv6, y no pueden realizar las funciones de routing dinámico de los routers. Si bien los switches de capa 2 adquieren cada vez más funcionalidad de IP, como la capacidad de realizar routing estático, esto no es suficiente para abordar esta gran cantidad de VLAN.

![[routingvlan.png]]

Se puede usar cualquier dispositivo que admita routing de capa 3, como un router o un switch multicapa, para lograr la funcionalidad de routing necesaria. Independientemente del dispositivo empleado, el proceso de reenvío del tráfico de la red de una VLAN a otra mediante routing se conoce como “routing entre VLAN”.

Hay tres opciones para el routing entre VLAN:

- Routing entre VLAN antiguo
- Router-on-a-stick
- Switching de capa 3 mediante las SVI

**1.1. Routing entre VLAN antiguo**
Históricamente, la primera solución para el routing entre VLAN se valía de routers con varias interfaces físicas. Era necesario conectar cada interfaz a una red separada y configurarla para una subred diferente.

1.2. Routing entre VLAN con router-on-a-stick
A diferencia del routing entre VLAN antiguo, que requiere varias interfaces físicas, tanto en el router como en el switch, las implementaciones más comunes y actuales de routing entre VLAN no tienen esos requisitos. En cambio, algunos softwares de router permiten configurar una interfaz del router como enlace troncal, lo que significa que solo es necesaria una interfaz física en el router y en el switch para enrutar paquetes entre varias VLAN.

```bash
S1(config)# vlan 10 
S1(config-vlan)# vlan 30 
S1(config-vlan)# interface f0/5 
S1(config-if)# switchport mode trunk 
S1(config-if)# end 
S1#
```

### 3.3. Configuración de subinterfaces del router

```bash
R1(config)# interface g0/0.10
R1(config-subif)# encapsulation dot1q 10
R1(config-subif)# ip address 172.17.10.1 255.255.255.0
R1(config-subif)# interface g0/0.30
R1(config-subif)# encapsulation dot1q 30
R1(config-subif)# ip address 172.17.30.1 255.255.255.0
R1(config)# interface g0/0
R1(config-if)# no shutdown
*Mar 20 00:20:59.299: %LINK-3-UPDOWN: Interface GigabitEthernet0/0, 
 changed state to down
*Mar 20 00:21:02.919: %LINK-3-UPDOWN: Interface GigabitEthernet0/0,
 changed state to up
*Mar 20 00:21:03.919: %LINEPROTO-5-UPDOWN: Line protocol on 
 Interface GigabitEthernet0/0, changed state to up
```
Cada subinterfaz se crea con el comando interfaz id_interfaz id_subinterfaz comando global configuration mode. La sintaxis para la subinterfaz es la interfaz física, en este caso g0/0, seguida de un punto y un número de subinterfaz. Como se muestra en la figura, la subinterfaz GigabitEthernet0/0.10 se crea con el comando de modo de configuración global interface g0/0.10. El número de subinterfaz normalmente se configura para reflejar el número de VLAN.

Antes de asignar una dirección IP a una subinterfaz, es necesario configurar la subinterfaz para que funcione en una VLAN específica mediante el comando encapsulation dot1q id_de_vlan. En este ejemplo, la subinterfaz G0/0.10 se asignó a la VLAN 10.