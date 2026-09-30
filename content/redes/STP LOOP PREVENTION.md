Practica: Investigate STP Loop Prevention

### ¿Qué es STP?

El **Spanning Tree Protocol (STP)** es un protocolo de red utilizado para evitar bucles en una topología de red conmutada. Los bucles pueden causar inundaciones de tráfico y colapsar la red. STP trabaja creando una estructura de árbol sin bucles a partir de la topología de red, desactivando enlaces redundantes.

### Cómo funciona STP

1. **Electo de Root Bridge**: Todos los switches en la red eligen un "root bridge" (puente raíz) basado en el identificador de puente más bajo.
2. **Cálculo de Rutas**: Cada switch calcula la mejor ruta hacia el root bridge.
3. **Port States**: Los puertos de los switches pueden estar en uno de varios estados:
    - **Blocking**: El puerto no reenvía tráfico.
    - **Listening**: El puerto escucha el tráfico pero no lo reenvía.
    - **Learning**: El puerto aprende direcciones MAC.
    - **Forwarding**: El puerto reenvía tráfico.
    - **Disabled**: El puerto está deshabilitado.

### Implementación de STP en Cisco Packet Tracer

```java
enable
configure terminal
hostname Switch1
vlan 10
name VLAN10
interface range fa0/1 - 24
switchport mode access
switchport access vlan 10

```

**Habilitar STP**: STP está habilitado por defecto en los switches Cisco, pero puedes verificarlo.

```java
show spanning-tree
```

**Ajustar parámetros STP**: Si es necesario, puedes ajustar el tiempo de transición entre estados, el tiempo de espera (hello time), y el tiempo de inactividad (max age).

```java
configure terminal
spanning-tree vlan 10 hello-time 2
spanning-tree vlan 10 forward-time 15
spanning-tree vlan 10 max-age 20
```

**Verificar la configuración**: Usa los siguientes comandos para verificar el estado del STP y los puertos.

```java
show spanning-tree vlan 1
```