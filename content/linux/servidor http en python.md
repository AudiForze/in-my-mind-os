# Compartir archivos en Linux usando Python

Si necesitas compartir rápidamente archivos entre dispositivos conectados a una misma red, no necesitas instalar un servidor web completo. **Python incluye un pequeño servidor HTTP que permite convertir cualquier carpeta de tu computadora en una página web accesible desde otros dispositivos.**

En este artículo veremos qué es, cómo funciona, cómo utilizarlo y cómo compartir un archivo `hola.txt` paso a paso.

---

## ¿Qué es `python -m http.server`?

Python incluye un módulo llamado `http.server` que permite iniciar un servidor HTTP sencillo.

El comando:

```bash
python3 -m http.server 8000
```

crea un servidor web que utiliza el puerto `8000`.

El servidor toma como punto de partida la **carpeta donde ejecutaste el comando** y muestra su contenido mediante una página web.

Por ejemplo, si tenemos:

```text
/home/usuario/Compartir/
├── hola.txt
├── foto.jpg
└── documento.pdf
```

y ejecutamos:

```bash
cd /home/usuario/Compartir
python3 -m http.server 8000
```

podremos acceder desde un navegador a:

```text
http://IP-DE-TU-PC:8000
```

y veremos los archivos disponibles.

---

# ¿Cómo funciona?

El funcionamiento es bastante sencillo:

```text
┌──────────────────────┐
│      Tu PC Linux     │
│                      │
│  python3             │
│  http.server         │
│       :8000          │
│                      │
│  📄 hola.txt         │
│  📷 foto.jpg         │
│  📄 documento.pdf    │
└──────────┬───────────┘
           │
           │ HTTP
           │
           ▼
┌──────────────────────┐
│   Otro dispositivo   │
│                      │
│  Navegador web       │
│                      │
│  192.168.1.50:8000   │
└──────────────────────┘
```

Cuando otro dispositivo visita la dirección del servidor, Python recibe la petición HTTP y responde mostrando los archivos de la carpeta.

Por ejemplo:

```text
GET /hola.txt
```

Python encuentra `hola.txt` y envía su contenido al navegador.

---

# 1. Comprobar que Python está instalado

Primero podemos comprobar la versión de Python:

```bash
python3 --version
```

Un resultado esperado sería:

```text
Python 3.13.7
```

La versión exacta puede ser diferente.

Si aparece una versión de Python, podemos continuar.

---

# 2. Crear una carpeta para compartir

Vamos a crear una carpeta llamada `Compartir`:

```bash
mkdir ~/Compartir
```

Después entramos en ella:

```bash
cd ~/Compartir
```

Podemos comprobar nuestra ubicación:

```bash
pwd
```

Resultado esperado:

```text
/home/usuario/Compartir
```

También podemos comprobar qué contiene:

```bash
ls
```

Si acabamos de crearla, probablemente no aparecerá ningún archivo:

```text
```

---

# 3. Crear nuestro archivo `hola.txt`

Ahora vamos a crear un archivo de texto:

```bash
echo "Hola desde mi servidor Linux!" > hola.txt
```

Comprobamos que existe:

```bash
ls
```

Resultado:

```text
hola.txt
```

Podemos comprobar su contenido:

```bash
cat hola.txt
```

Resultado:

```text
Hola desde mi servidor Linux!
```

Ahora nuestra carpeta tiene:

```text
Compartir/
└── hola.txt
```

---

# 4. Iniciar el servidor

Desde la carpeta `Compartir`, ejecutamos:

```bash
python3 -m http.server 8000
```

Python mostrará algo parecido a:

```text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Esto significa que el servidor está funcionando.

El proceso permanecerá ejecutándose en la terminal.

---

# 5. Obtener la dirección IP de Linux

Necesitamos conocer la dirección IP de nuestra computadora dentro de la red.

Podemos utilizar:

```bash
hostname -I
```

Por ejemplo:

```text
192.168.1.50
```

También podemos utilizar:

```bash
ip addr
```

y buscar una dirección similar a:

```text
inet 192.168.1.50/24
```

En este ejemplo, nuestra IP sería:

```text
192.168.1.50
```

---

# 6. Acceder desde otro dispositivo

Si nuestro servidor está funcionando en el puerto `8000`, desde otro dispositivo conectado a la misma red podemos abrir:

```text
http://192.168.1.50:8000
```

El navegador mostrará algo parecido a:

```text
Directory listing for /


hola.txt
```

Podemos hacer clic sobre `hola.txt` y el navegador mostrará:

```text
Hola desde mi servidor Linux!
```

Dependiendo del navegador y del tipo de archivo, también podremos descargarlo.

---

# 7. ¿Qué está ocurriendo en la terminal?

Mientras alguien accede al servidor, la terminal de Linux mostrará las peticiones HTTP.

Por ejemplo:

```text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
192.168.1.25 - - [30/Sep/2026 21:15:32] "GET / HTTP/1.1" 200 -
192.168.1.25 - - [30/Sep/2026 21:15:35] "GET /hola.txt HTTP/1.1" 200 -
```

Podemos interpretar esto de la siguiente manera:

```text
192.168.1.25
```

Es la dirección IP del dispositivo que realizó la petición.

```text
GET /hola.txt
```

Significa que el dispositivo solicitó el archivo `hola.txt`.

```text
200
```

Es el código HTTP que indica que la petición fue procesada correctamente.

---

# 8. Compartir un archivo específico

Es importante entender que `http.server` comparte una **carpeta**, no solamente un archivo.

Por eso, si solamente queremos compartir:

```text
hola.txt
```

podemos crear una carpeta exclusiva:

```bash
mkdir ~/Compartir
```

Crear el archivo:

```bash
echo "Hola desde Linux!" > ~/Compartir/hola.txt
```

Entrar en la carpeta:

```bash
cd ~/Compartir
```

Y ejecutar:

```bash
python3 -m http.server 8000
```

Ahora solamente estaremos exponiendo el contenido de esa carpeta.

La estructura será:

```text
~/Compartir/
└── hola.txt
```

Y podremos acceder a:

```text
http://192.168.1.50:8000/hola.txt
```

---

# 9. Compartir archivos usando otro puerto

El puerto `8000` no es obligatorio.

Podemos utilizar otro puerto, por ejemplo `8080`:

```bash
python3 -m http.server 8080
```

El resultado será:

```text
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

Entonces accederíamos utilizando:

```text
http://192.168.1.50:8080
```

La estructura de una dirección es:

```text
http://IP:PUERTO
```

Por ejemplo:

```text
http://192.168.1.50:8000
```

donde:

```text
192.168.1.50 → dirección IP
8000          → puerto
```

---

# 10. Compartir archivos dentro de una red local

Este método resulta especialmente útil cuando tenemos varios dispositivos en la misma red.

Por ejemplo:

```text
              Router
             /     \
            /       \
           ▼         ▼
      Linux PC     Laptop
      192.168.1.50 192.168.1.25
          │
          │
      HTTP :8000
```

En Linux:

```bash
cd ~/Compartir
python3 -m http.server 8000
```

En la laptop:

```text
http://192.168.1.50:8000
```

La laptop podrá acceder a los archivos publicados por el servidor.

---

# 11. Compartir archivos con `0.0.0.0`

También podemos especificar explícitamente que Python escuche en todas las interfaces de red:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Resultado:

```text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

`0.0.0.0` significa que el servidor no está limitado a una única interfaz de red.

Esto puede ser útil cuando la computadora tiene, por ejemplo:

```text
Wi-Fi
Ethernet
VPN
```

---

# 12. Detener el servidor

Cuando terminemos de compartir los archivos, podemos volver a la terminal donde está ejecutándose Python y presionar:

```text
Ctrl + C
```

La terminal mostrará algo similar a:

```text
^C
```

El servidor habrá dejado de funcionar.

Si intentamos acceder nuevamente:

```text
http://192.168.1.50:8000
```

ya no tendremos acceso al servidor.

---

# Ejemplo completo: compartir `hola.txt`

Ahora podemos resumir todo el proceso.

Primero creamos la carpeta:

```bash
mkdir ~/Compartir
```

Entramos:

```bash
cd ~/Compartir
```

Creamos el archivo:

```bash
echo "Hola desde mi servidor Linux!" > hola.txt
```

Comprobamos:

```bash
cat hola.txt
```

Resultado:

```text
Hola desde mi servidor Linux!
```

Iniciamos el servidor:

```bash
python3 -m http.server 8000
```

Resultado:

```text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

En otra terminal podemos obtener nuestra IP:

```bash
hostname -I
```

Resultado de ejemplo:

```text
192.168.1.50
```

Desde otro dispositivo abrimos:

```text
http://192.168.1.50:8000
```

Y veremos:

```text
Directory listing for /

hola.txt
```

Al entrar en `hola.txt`:

```text
Hola desde mi servidor Linux!
```

---

# Ventajas

Este método tiene varias ventajas:

* No requiere instalar software adicional.
* Python suele estar disponible en muchas distribuciones Linux.
* Es extremadamente rápido de configurar.
* Funciona desde cualquier navegador web.
* Es útil para transferencias rápidas dentro de una red local.
* Permite compartir múltiples archivos y carpetas.
* Puede utilizarse para transferir archivos entre Linux, Windows, macOS, Android y otros dispositivos.

---

# Limitaciones

Aunque es muy práctico, `http.server` es un servidor **simple**, no una plataforma de almacenamiento completa.

Por ejemplo, no proporciona por defecto:

* Usuarios y contraseñas.
* Cuentas individuales.
* Cifrado HTTPS.
* Gestión avanzada de permisos.
* Interfaz de administración.
* Sistema de subida de archivos mediante una interfaz web.

Además, debemos tener cuidado con **qué carpeta compartimos**.

Si ejecutamos:

```bash
cd ~
python3 -m http.server 8000
```

estaremos exponiendo todo el contenido de nuestro directorio personal a los dispositivos que puedan acceder al servidor.

Por eso es mucho más recomendable crear una carpeta específica:

```bash
mkdir ~/Compartir
cd ~/Compartir
python3 -m http.server 8000
```

---

# Conclusión

`python3 -m http.server` es una de las formas más sencillas de crear un servidor web temporal en Linux.

Con solamente:

```bash
python3 -m http.server 8000
```

podemos convertir una carpeta en un pequeño servidor HTTP y acceder a sus archivos desde otro dispositivo utilizando un navegador.

Para nuestro ejemplo, el flujo completo fue:

```text
Crear carpeta
     ↓
Crear hola.txt
     ↓
Iniciar Python HTTP Server
     ↓
Obtener IP
     ↓
Abrir IP:8000
     ↓
Descargar / visualizar archivo
```

Para transferencias rápidas dentro de una red local, es una herramienta pequeña pero extremadamente útil.
