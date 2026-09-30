---
title: VLANs en Cisco
date: 2026-06-18
tags: [redes, cisco]
---
Segmenta tu red para aislar tráfico.

```text
vlan 10
 name ADMIN
interface g0/1
 switchport access vlan 10
```

Los distintos switches Cisco Catalyst admiten diversas cantidades de VLAN. La cantidad de VLAN que admiten es suficiente para satisfacer las necesidades de la mayoría de las organizaciones. Por ejemplo, los switches de las series Catalyst 2960 y 3560 admiten más de 4000 VLAN. Las VLAN de rango normal en estos switches se numeran del 1 al 1005, y las VLAN de rango extendido se numeran del 1006 al 4094. En la siguiente ilustración, se muestran las VLAN disponibles en un switch Catalyst 2960 que ejecuta IOS de Cisco, versión 15.x.

```bash 
Switch# show vlan brief

VLAN Name                        Status    Ports
---- --------------------------- --------- ----------------------
1    default                     active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                           Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                           Fa0/9, Fa0/10, Fa0/11, Fa0/12
                                           Fa0/13, Fa0/14, Fa0/15, Fa0/16
                                           Fa0/17, Fa0/18, Fa0/19, Fa0/20
                                           Fa0/21, Fa0/22, Fa0/23, Fa0/24
                                           Gi0/1, Gi0/2
1002 fddi-default               act/unsup 
1003 token-ring-default         act/unsup 
1004 fddinet-default            act/unsup 
1005 trnet-default              act/unsup
```
### 1.1. VLAN de rango normal

- Se utiliza en redes de pequeños y medianos negocios y empresas.
- Se identifica mediante una ID de VLAN entre 1 y 1005.
- Las ID de 1002 a 1005 se reservan para las VLAN de Token Ring e interfaz de datos distribuidos por fibra óptica (FDDI).
- Las ID 1 y 1002 a 1005 se crean automáticamente y no se pueden eliminar.
- Las configuraciones se almacenan en un archivo de base de datos de VLAN, denominado vlan.dat. El archivo vlan.dat se encuentra en la memoria flash del switch.
- El protocolo de enlace troncal de VLAN (VTP), que permite administrar la configuración de VLAN entre los switches, solo puede descubrir y almacenar redes VLAN de rango normal.

### 1.2. VLAN de rango extendido

- Posibilita a los proveedores de servicios que amplíen sus infraestructuras a una cantidad de clientes mayor. Algunas empresas globales podrían ser lo suficientemente grandes como para necesitar las ID de las VLAN de rango extendido.
- Se identifican mediante una ID de VLAN entre 1006 y 4094.
- Las configuraciones no se escriben en el archivo vlan.dat.
- Admiten menos características de VLAN que las VLAN de rango normal.
- Se guardan, de manera predeterminada, en el archivo de configuración en ejecución.
- VTP no aprende las VLAN de rango extendido.

>Nota: la cantidad máxima de VLAN disponibles en los switches Catalyst es 4096, ya que el campo ID de VLAN tiene 12 >bits en el encabezado IEEE 802.1Q.

## 2. Creación de una VLAN

Al configurar redes VLAN de rango normal, los detalles de configuración se almacenan en la memoria flash del switch en un archivo denominado **vlan.dat**. La memoria flash es persistente y no requiere el comando **copy running-config startup-config**. Sin embargo, debido a que en los switches Cisco se suelen configurar otros detalles al mismo tiempo que se crean las VLAN, es aconsejable guardar los cambios a la configuración en ejecución en la configuración de inicio.


En la siguiente tabla, se muestra la sintaxis del comando de IOS de Cisco que se utiliza para agregar una VLAN a un switch y asignarle un nombre. Se recomienda asignarle un nombre a cada VLAN en la configuración de un switch.

Tabla de Comandos de Creación de una VLAN.
|Descripción|Comando|
|---|---|
|Ingresar al modo de configuración global.|S1# configure terminal|
|Crear una VLAN con un número de ID válido.|S1(config)#vlan id-vlan|
|Especificar un nombre único para identificar la VLAN.|S1(config-vlan)#name nombre-vlan|
|Volver al modo EXEC privilegiado.|S1(config-vlan)# end|

### 2.1. Ejemplo de Configuración VLAN

En la Imagen 1, se muestra cómo se configura la VLAN para estudiantes (VLAN 20) en el switch S1. En el ejemplo de topología, la computadora del estudiante (PC2) todavía no se asoció a ninguna VLAN, pero tiene la dirección IP 172.17.20.22.

```bash 
S1# configure terminal
S1(config)# vlan 20
S1(config-vlan)# name student
S1(config-vlan)# end
```
A continuación, se utiliza el comando **show vlan brief** para mostrar el contenido del archivo vlan.dat.
```bash 
S1# show vlan brief
VLAN Name                Status   Ports 
---- ------------------ --------- ----------------------------- 
1 default               active    Fa0/1, Fa0/2, Fa0/3, Fa0/4 
                                  Fa0/5, Fa0/6, Fa0/7, Fa0/8 
                                  Fa0/9, Fa0/10, Fa0/11, Fa0/12 
                                  Fa0/13, Fa0/14, Fa0/15, Fa0/16 
                                  Fa0/17, Fa0/18, Fa0/19, Fa0/20 
                                  Fa0/21, Fa0/22, Fa0/23, Fa0/24 
1 Gig0/1, Gig0/2 
20 Student active 
1002 fddi-default act/unsup 
1003 token-ring-default act/unsup 
1004 fddinet-default act/unsup 
1005 trnet-default act/unsup 
S1#
```
Además de introducir una única ID de VLAN, se puede introducir una serie de ID de VLAN separadas por comas o un rango de ID de VLAN separado por guiones con el comando **vlan** _id-vlan._ Por ejemplo, utilice el siguiente comando para crear las VLAN 100, 102, 105, 106 y 107:

S1(config)# vlan 100,102,105-107

## 3. Asignación de puertos a las redes VLAN

Después de crear una VLAN, el siguiente paso es asignar puertos a la VLAN. Un puerto de acceso puede pertenecer a sólo una VLAN por vez. Una excepción a esta regla es un puerto conectado a un teléfono IP, en cuyo caso hay dos VLAN asociadas con el puerto, una para voz y otra para datos.

En la siguiente 1, se muestra la sintaxis para definir un puerto como puerto de acceso y asignarlo a una VLAN. El comando **switchport mode access** es optativo, pero se aconseja como práctica recomendada de seguridad. Con este comando, la interfaz cambia al modo de acceso permanente.

Tabla de Asignación de puertos a las VLAN.
|Descripción|Comando|
|---|---|
|Ingresar al modo de configuración global.|S1# configure terminal|
|Ingresar al modo de configuración de interfaz.|S1(config)# interface id_interfaz|
|Establecer el puerto en modo de acceso.|S1(config-if)# switchport mode access|
|Asignar el puerto a una VLAN.|S1(config-if)# switchport access vlan id_vlan|

>**Nota**: utilice el comando **interface range** para configurar varias interfaces simultáneamente.