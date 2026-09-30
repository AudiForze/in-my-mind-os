Una de las habilidades más importantes que necesita un administrador de redes es el dominio de las listas de control de acceso (ACL). Esto es lo que usted debe saber…

### 1. ¿Qué es la lista de control de acceso?
Una ACL es una serie de comandos del IOS que controlan si un router reenvía o descarta paquetes según la información que se encuentra en el encabezado del paquete. Las ACL son una de las características del software IOS de Cisco más utilizadas.

### Tareas de las ACL

Cuando se las configura, las ACL realizan las siguientes tareas:

- **Limitan el tráfico de la red para aumentar su rendimiento.** Por ejemplo, si la política corporativa no permite el tráfico de video en la red, se pueden configurar y aplicar ACL que bloqueen el tráfico de video. Esto reduciría considerablemente la carga de la red y aumentaría su rendimiento.

* **Proporcionan control del flujo de tráfico.** Las ACL pueden restringir la entrega de actualizaciones de routing para asegurar que las actualizaciones provienen de un origen conocido.

* **Proporcionan un nivel básico de seguridad para el acceso a la red. **Las ACL pueden permitir que un host acceda a una parte de la red y evitar que otro host acceda a la misma área.

* **Filtran el tráfico según el tipo de tráfico.** Por ejemplo, una ACL puede permitir el tráfico de correo electrónico, pero bloquear todo el tráfico de Telnet.

* **Filtran a los hosts para permitirles o denegarles el acceso a los servicios de red.** Las ACL pueden permitirles o denegarles a los usuarios el acceso a determinados tipos de archivos, como FTP o HTTP.

![[acl.png]]

### 2. Filtrado de paquetes
Una ACL es una lista secuencial de instrucciones permit (permitir) o deny (denegar), conocidas como “entradas de control de acceso” (ACE). Las ACE también se denominan comúnmente “instrucciones de ACL”. Cuando el tráfico de la red atraviesa una interfaz configurada con una ACL, el router compara la información dentro del paquete con cada ACE, en orden secuencial, para determinar si el paquete coincide con una de las ACE. Este proceso se denomina filtrado de paquetes.

Comando:
```bash
R1(config)# access-list 10 permit 192.168.10.0

```

```bash
Router(config)# access-list access-list-number { deny | permit | remark } source [ source-wildcard ][ log ]


```

| Parámetro                 | Descripción                                                                                                                                                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Número de lista de acceso | Número de una ACL. Es un número decimal del 1 al 99 o del 1300 al 1999 (para las ACL estándar).                                                                                                                                                                                                            |
| Deny                      | Deniega el acceso si las condiciones concuerdan.                                                                                                                                                                                                                                                           |
| Permit                    | Permite el acceso si las condiciones concuerdan.                                                                                                                                                                                                                                                           |
| Remark                    | Agregue un comentario sobre las entradas en la lista de acceso IP para facilitar la comprensión y el análisis de la lista.                                                                                                                                                                                 |
| Origen                    | Número de la red o del host desde el que se envía el paquete. Existen dos formas de especificar el origen.  <br>Utilice una cantidad de 32 bits en formato decimal punteado de cuatro partes.  <br>Utilice la palabra clave any como abreviatura de origen y comodín de fuente de 0.0.0.0 255.255.255.255. |
| Comodín de fuente         | (Optativo) Máscara wildcard de 32 bits para aplicar al origen. Coloca unos en las posiciones de bits que desea omitir.                                                                                                                                                                                     |

```bash
R1(config)# access-list 10 permit host 192.168.10.10
```
1.1. Eliminación de una ACL
Para crear una instrucción que permita un rango de direcciones IPv4 en una ACL numerada 10 que permite todas las direcciones IPv4 en la red 192.168.10.0/24, debe introducir lo siguiente:
```bash
R1(config)# access-list 10 permit 192.168.10.0 0.0.0.255
```
Para eliminar la ACL, se utiliza el comando de configuración global no access-list. La ejecución del comando show access-list confirma que se eliminó la lista de acceso 10.
```bash
R1# show access-lists 
Standard IP access list 10
 10 permit 192.168.10.0, wildcard bits 0.0.0.255
R1# conf t
``` 
Enter configuration commands, one per line. End with CNTL/Z.
```bash
R1(config)# no access-list 10 
R1(config)# exit 
R1# show access-lists 
R1#
``