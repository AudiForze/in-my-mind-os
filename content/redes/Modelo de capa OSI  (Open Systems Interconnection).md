
ISO significa la ==Organización Internacional de Normalización==, una entidad internacional independiente que desarrolla estándares para productos, servicios y sistemas de gestión
El modelo de interconexión de sistemas abiertos (OSI) es un modelo conceptual creado por la Organización Internacional de Normalización (OIS) que permite que diversos sistemas de comunicación se comuniquen mediante [[Protocolos]] estándar . En términos sencillos, el OSI proporciona un estándar para que diferentes sistemas informáticos puedan comunicarse entre sí.
### La capa de aplicacion
Esta es la unica capa que interactúa directamente con los datos del usuario. Las aplicaciones de software, como los navegadores web y los clientes de correo electrónico, dependen de la capa de aplicación para iniciar las comunicación. Sin embargo es importante aclarar que `esta es responsable de los protocolos y la manipulación de datos que el software utiliza para presentar la información significativa al usuario.` Ejemplo:

- HTTP (80-8080) (hypertext transfer protocol)
- SMTP (25) (Simple Mail Transfer Protocol)

![[Pasted image 20251202212439.png]]

----
### La capa de presentación
Esta capa es la principal responsable de preparar los datos para que la capa de aplicación los pueda usar; en otras palabras, la capa 6 facilita la presentación de los datos para que las aplicaciones los consuman. La capa de presentación es responsable de la traducción, [el cifrado](https://www.cloudflare.com/learning/ssl/what-is-encryption/) y la compresión de los datos.
![[Pasted image 20251202212727.png]]
Dos dispositivos que se comunican pueden utilizar diferentes métodos de codificación, por lo que la capa 6 es responsable de traducir los datos entrantes a una sintaxis que la capa de aplicación del dispositivo receptor pueda entender.
- SSL 
- TLS

---
#### La capa de sesión
![[Pasted image 20251202212837.png]]

Esta es la capa responsable de abrir y cerrar la comunicación entre dos dispositivos. El tiempo transcurrido entre la apertura y el cierre de la comunicación se conoce como sesión. La capa de sesión garantiza que la sesión permanezca abierta el tiempo suficiente para transferir todos los datos intercambiados y la cierra rápidamente para evitar el desperdicio de recursos.

La capa de sesión también sincroniza la transferencia de datos con puntos de control. Por ejemplo, si se transfiere un archivo de 100 megabytes, la capa de sesión podría establecer un punto de control cada 5 megabytes. En caso de desconexión o fallo después de transferir 52 megabytes, la sesión podría reanudarse desde el último punto de control, lo que significa que solo se necesitarían transferir 50 megabytes más de datos. Sin los puntos de control, la transferencia tendría que comenzar desde cero.

- SMB sesión (parte de CIFS)
- RPC (Remote Procedure Call)
---
#### La capa de transporte

![[Pasted image 20251202212956.png]]
La capa 4 se encarga de la comunicación de extremo a extremo entre los dos dispositivos. Esto incluye tomar datos de la capa de sesión y dividirlos en fragmentos llamados segmentos antes de enviarlos a la capa 3. La capa de transporte del dispositivo receptor se encarga de reensamblar los segmentos para obtener datos que la capa de sesión pueda consumir.

La capa de transporte también es responsable del control de flujo y de errores. El control de flujo determina la velocidad óptima de transmisión para garantizar que un emisor con una conexión rápida no sature a un receptor con una conexión lenta. La capa de transporte realiza el control de errores en el receptor, garantizando que los datos recibidos estén completos y solicitando una retransmisión en caso contrario. Los protocolos mas utilizados para este proceso son:

- TCP (Transfer Control Protocol)
- UDP (User Datagram Protocol)
---
#### La capa de red (router)
![[Pasted image 20251202213504.png]]

La capa de red se encarga de facilitar la transferencia de datos entre dos redes diferentes. Si los dos dispositivos que se comunican están en la misma red, la capa de red es innecesaria. La capa de red divide los segmentos de la capa de transporte en unidades más pequeñas, llamadas paquetes , en el dispositivo del emisor y los reensambla en el dispositivo receptor.

- Ip (IPv4/IPv6)
- ARP
- ODPF
- EIGRP
- RIP (Routing Information Protocol)

![[Pasted image 20251202213604.png]]

**PD:** Capa en la que trabajan los routers

---
#### La capa de enlace de datos

![[Pasted image 20251202213708.png]]

La capa de enlace de datos es muy similar a la capa de red, salvo que `facilita la transferencia de datos entre dos dispositivos en la _misma_ red.` La capa de enlace de datos toma paquetes de la capa de red y los divide en fragmentos más pequeños llamados tramas. Al igual que la capa de red, la capa de enlace de datos también es responsable del control de flujo y de errores en la comunicación intrared (la capa de transporte solo realiza el control de flujo y de errores en las comunicaciones entre redes).

- PPP (Point-to-Point Protocol)
- VLAN (IEEE 802.1Q)

---
#### La capa física
![[Pasted image 20251202214047.png]]
Esta capa incluye los equipos físicos que intervienen en la transferencia de datos, como cables e [interruptores](https://www.cloudflare.com/learning/network-layer/what-is-a-network-switch/) . También es la capa donde los datos se convierten en un flujo de bits, que consiste en una cadena de unos y ceros. La capa física de ambos dispositivos también debe concordar una convención de señales para que los unos se distingan de los ceros en ambos dispositivos.

- SDH (Synchronous Digital Hierarchy) (Protocolo de comunicacion por fibras optica que multiplexan varias señales digitales en una sola señal sincrona para transmitir trafico de voz, datos y videos de alta velocidad y a larga distancia)
-  DSL (Línea de Abonado Digital) es una tecnología de redes que proporciona acceso a Internet de alta velocidad utilizando las líneas telefónicas de cobre existentes

related[[Redes]]
related[[Protocolos]]

Tags: #redes #puertos #protocolos #modelos_osi #iso 