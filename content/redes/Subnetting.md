El Subnetting es una técnica utilizada para dividir una red IP en subredes más pequeñas y manejables. Esto se logra mediante el uso de máscaras de red, que permiten definir qué bits de la dirección IP corresponden a la red y cuáles a los hosts.

Por ejemplo podemos acceder a ella utilizando simplemente el comando ifconfig:
![[Pasted image 20230411212702.png]]

El origen de los 255 sirve para representar la totalidad de dispositivos que se pueden conectar a la red; y se consigue con el siguiente cálculo:

![[Pasted image 20230411213301.png]]

### Hosts máximos según la máscara de subred al hacer subnetting

255.255.255.128 -> 126 hosts

255.255.254.0 -> 510 hosts

255.255.128.0 -> 32.766 hosts

255.224.0.0 -> 2.097.150 hosts

255.128.0.0 -> 8.388.606 hosts

0.0.0.0 -> 4.294.967.294 hosts

Una IP tiene una parte de Red y una parte de Host (dispositivos). La máscara de red indica qué bits pertenecen a la red y cuáles al host (ej. 255.255.255.0 o /24).

La barra diagonal (ej. /26)**(CIDR (Classless Inter-Domain Routing))** indica cuántos bits están encendidos (en 1) en la máscara de subred, contando de izquierda a derecha de un total de 32 bits.

### Paso a Paso para Hacer Subnetting

Imaginemos que tienes la red **`192.168.1.0/24`** y necesitas crear al menos **4 subredes**.

#### Paso 1: Determinar cuántos bits robar ($s$)

Busca una potencia de 2 que sea mayor o igual al número de subredes que necesitas ($2^s \ge \text{Subredes}$).

- Si necesitas 4 subredes: $2^2 = 4$. Por lo tanto, debes **robar 2 bits** a la porción de host.
    

#### Paso 2: Calcular la nueva máscara de subred

- La máscara original era `/24` (24 bits de red).
    
- Le sumamos los 2 bits robados: $24 + 2 =$ **`/26`**.
    
- En formato decimal, los 26 bits encendidos equivalen a: `255.255.255.192`.
    

#### Paso 3: Calcular el salto (tamaño de cada subred)

- Los bits totales de una IP son 32. Si usamos 26 bits para la red, nos quedan $32 - 26 = 6$ bits para los hosts ($h = 6$).
    
- El total de IPs por subred es $2^6 = 64$. Este número (64) es el **salto** o bloque entre cada subred.
    

#### Paso 4: Listar las subredes y rangos utilizables

Con un salto de 64, las subredes quedan de la siguiente manera:

|**Subred**|**Dirección de Red**|**Rango de IPs Utilizables**|**Dirección de Broadcast**|
|---|---|---|---|
|**Subred 0**|`192.168.1.0`|`192.168.1.1` – `192.168.1.62`|`192.168.1.63`|
|**Subred 1**|`192.168.1.64`|`192.168.1.65` – `192.168.1.126`|`192.168.1.127`|
|**Subred 2**|`192.168.1.128`|`192.168.1.129` – `192.168.1.190`|`192.168.1.191`|
|**Subred 3**|`192.168.1.192`|`192.168.1.193` – `192.168.1.254`|`192.168.1.255`|
