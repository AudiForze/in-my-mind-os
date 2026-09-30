Aquí tienes el texto con todas las faltas ortográficas, tildes y errores de tipeo corregidos, manteniendo intacta la estructura y el formato original:

Cuando me encontraba desarrollando para **Arduino**, me topé con un problema muy interesante, y es que Arduino solo permite la conexión de un dispositivo a la vez, por lo que no podíamos utilizar varios dispositivos de forma simultánea ni utilizar el cable USB-serial y aplicaciones PySerial simultáneamente. Esto nos deja un problema grande si creamos una aplicación de escritorio y un sitio web para que cualquier persona pueda interactuar con el proyecto.

Justo esto es lo que me motivó a desarrollar una arquitectura como la que ya implementábamos en redes en forma de cliente-servidor.

![[cliente-servidor.png]]

>Cliente-Servidor es uno de los estilos arquitectónicos distribuidos más conocidos, el cual está compuesto por dos componentes: el proveedor y el consumidor. El proveedor es un servidor que brinda una serie de servicios o recursos, los cuales son consumidos por el cliente.

> En una arquitectura cliente-servidor existe un servidor y múltiples clientes que se conectan a él para recuperar todos los recursos necesarios para funcionar. En este sentido, el cliente solo es una capa para representar los datos y se detonan acciones para modificar el estado del servidor, mientras que este último es el que hace todo el trabajo pesado.

El objetivo era claro: desarrollar un servidor en **Python** el cual se ejecutara directamente en la placa de Arduino y fuera el único que tuviera conexión con ella. Todos los demás dispositivos y secciones se conectarían directamente al servidor, y este utilizaría algunos algoritmos para determinar la prioridad de la solicitud de las instrucciones y comandos enviados a la placa.

El algoritmo toma en cuenta el dispositivo que emitía el comando, el tiempo de ejecución y el orden de llegada. Esto se hacía para ser eficiente con el uso de los recursos disponibles y para poder ofrecer una experiencia lo más cercana y cómoda posible al usuario.

### ¿Cómo está implementada la arquitectura?

Este script actúa como un Servidor TCP y a la vez como un Cliente Serial (hacia el Arduino). Su rol principal es el de puente de comunicación:

- Escucha peticiones de red provenientes de aplicaciones cliente (como la interfaz gráfica que vimos antes) utilizando sockets.
- Procesa y traduce los comandos recibidos y se los reenvía físicamente al hardware (Arduino) mediante comunicación serial (`pyserial`).
- Escucha en segundo plano las respuestas del Arduino mediante hilos (`threading`) para guardarlas en una base de datos local.
    
### Funcionamiento detallado paso a paso

#### 1. Configuración de Hardware (Puerto Serie)
```
puerto = 'COM8'
arduino = serial.Serial('COM8', 9600)
```

El script abre una comunicación serial con el Arduino conectado en el puerto `COM8` a una velocidad de `9600` baudios. Al iniciar, envía un comando de reseteo (`alarma off`) para asegurar un estado inicial conocido.
#### 2. Inicialización del Servidor de Sockets

```
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('localhost', 12345))
server.listen(5)
```

- Se crea un socket TCP (`AF_INET`, `SOCK_STREAM`).
- Se enlaza (`bind`) a `localhost` en el puerto `12345` (el mismo puerto al que apuntaban los clientes).
- Se pone a la escucha (`listen(5)`), quedando preparado para aceptar múltiples conexiones entrantes.
#### 3. Lectura concurrente desde el Arduino (Hilos / Threads)

```
thread_arduino = threading.Thread(target=leer_desde_arduino, daemon=True)
thread_arduino.start()
```

Para evitar que el programa se quede bloqueado esperando mensajes del Arduino, se lanza un hilo secundario (`threading`). Este hilo corre de forma independiente en un bucle (`leer_desde_arduino`), registrando y guardando en la base de datos cualquier información que la placa física envíe de manera espontánea.

#### 4. Bucle Principal de Recepción y Enrutamiento (El Servidor en Acción)

```
while True:
    client, addr = server.accept()
    data = client.recv(1024).decode().strip()
```

El servidor entra en un bucle infinito bloqueante (`server.accept()`) esperando que un cliente se conecte. Cuando un cliente establece conexión y envía datos (un comando):

- Se captura el mensaje y la dirección IP/puerto del cliente (`addr`).
- Se registra el evento en la base de datos (`guardar_log`).

#### 5. Lógica de Negocio y Respuesta Condicional

Dependiendo del comando que envíe el cliente, el servidor actúa de dos formas:

- **Caso especial (`humedad`):** Si el cliente pide la humedad, el servidor le escribe `"humedad\n"` al Arduino, espera un segundo a que responda, lee el valor devuelto por el hardware y se lo devuelve al cliente mediante `client.sendall(humedad.encode())` (comunicación bidireccional).
- 
- **Comandos generales (`servo`, `techo on`, etc.):** Cualquier otro texto recibido simplemente se le reenvía directamente al Arduino añadiéndole un salto de línea (`arduino.write((data + '\n').encode())`).

![[cliente-servidor.excalidraw]]