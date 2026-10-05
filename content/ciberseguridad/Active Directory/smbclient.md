# SMBClient — Guía completa

`smbclient` es una herramienta de línea de comandos perteneciente al conjunto de herramientas **Samba**, utilizada para interactuar con servidores que implementan el protocolo **SMB (Server Message Block)**.

Permite conectarse a recursos compartidos de sistemas Windows, Linux, Unix y otros dispositivos compatibles con SMB. Desde una sesión interactiva es posible listar archivos, navegar por directorios, descargar y subir archivos, crear directorios, eliminar archivos y realizar diferentes operaciones sobre los recursos compartidos.

En administración de sistemas y ciberseguridad, `smbclient` resulta especialmente útil durante procesos de:

* Enumeración de servicios SMB.
* Identificación de recursos compartidos.
* Comprobación de acceso anónimo.
* Auditorías de permisos.
* Transferencia de archivos.
* Administración remota de recursos.
* Pentesting y CTFs.
* Análisis de servidores Windows/Samba.

> **Nota:** Los ejemplos de esta guía deben utilizarse únicamente sobre sistemas propios o sobre infraestructura para la que tengas autorización.

---

# 1. ¿Qué es SMB?

**SMB (Server Message Block)** es un protocolo utilizado para compartir recursos a través de una red.

Entre los recursos que puede proporcionar un servidor SMB se encuentran:

* Carpetas.
* Archivos.
* Impresoras.
* Recursos administrativos.
* Otros servicios relacionados con archivos y Windows.

Un recurso compartido SMB normalmente se representa mediante una ruta como:

```text
\\192.168.1.10\documentos
```

En sistemas Linux utilizando `smbclient`, normalmente se utiliza:

```text
//192.168.1.10/documentos
```

Por ejemplo:

```bash
smbclient //192.168.1.10/documentos
```

---

# 2. Instalación de smbclient

En distribuciones basadas en Debian/Ubuntu:

```bash
sudo apt update
sudo apt install smbclient
```

En Arch Linux:

```bash
sudo pacman -S smbclient
```

En Fedora:

```bash
sudo dnf install samba-client
```

Una vez instalado, podemos comprobar la versión:

```bash
smbclient --version
```

También podemos consultar la ayuda:

```bash
smbclient --help
```

---

# 3. Sintaxis básica

La estructura general de `smbclient` es:

```bash
smbclient [OPCIONES] //HOST/SHARE
```

Por ejemplo:

```bash
smbclient //192.168.1.10/public
```

Donde:

```text
192.168.1.10 → Dirección IP del servidor
public       → Nombre del recurso compartido
```

---

# 4. Enumerar recursos compartidos

Antes de conectarnos a una carpeta concreta, normalmente queremos conocer qué recursos SMB están disponibles.

Para ello utilizamos:

```bash
smbclient -L <IP>
```

Ejemplo:

```bash
smbclient -L 192.168.1.10
```

El parámetro `-L` solicita al servidor una lista de recursos compartidos.

---

## 4.1. Enumeración anónima

Algunos servidores permiten consultar los recursos compartidos sin proporcionar credenciales.

Podemos probar:

```bash
smbclient -L 192.168.1.10 -N
```

`-N` indica que no se debe solicitar una contraseña.

Un servidor podría devolver algo parecido a:

```text
Sharename       Type      Comment
---------       ----      -------
public          Disk      Public Share
documents       Disk      Company Documents
IPC$            IPC       IPC Service
```

En este caso hemos identificado:

```text
public
documents
IPC$
```

como recursos accesibles desde el servidor.

---

# 5. Conectarse a un recurso compartido

Una vez conocemos el nombre del recurso, podemos conectarnos utilizando:

```bash
smbclient //192.168.1.10/public
```

Si el servidor solicita credenciales, `smbclient` las pedirá de forma interactiva.

Ejemplo:

```text
Enter WORKGROUP\username's password:
```

Después de autenticarnos correctamente aparecerá un prompt similar a:

```text
smb: \>
```

Esto significa que estamos dentro de una sesión SMB interactiva.

---

# 6. Conectarse especificando el usuario

Podemos especificar el usuario mediante `-U`:

```bash
smbclient //192.168.1.10/public -U usuario
```

El programa solicitará posteriormente la contraseña:

```text
Enter WORKGROUP\usuario's password:
```

También podemos especificar el dominio:

```bash
smbclient //192.168.1.10/public -U DOMINIO/usuario
```

Por ejemplo:

```bash
smbclient //192.168.1.10/public -U CONTOSO/alice
```

---

# 7. Utilizar credenciales desde la línea de comandos

También existe la posibilidad de proporcionar usuario y contraseña directamente:

```bash
smbclient //192.168.1.10/public -U 'usuario%contraseña'
```

Ejemplo:

```bash
smbclient //192.168.1.10/public -U 'alice%Password123!'
```

Sin embargo, **no es recomendable utilizar este método en entornos reales**, ya que la contraseña puede quedar expuesta en el historial del shell o en determinados mecanismos de inspección de procesos.

Es preferible:

```bash
smbclient //192.168.1.10/public -U alice
```

y proporcionar la contraseña cuando sea solicitada.

---

# 8. Conexión anónima

Si el recurso permite acceso anónimo:

```bash
smbclient //192.168.1.10/public -N
```

También podemos intentar enumerar los recursos:

```bash
smbclient -L 192.168.1.10 -N
```

El acceso anónimo depende de la configuración del servidor. Que SMB esté abierto no significa necesariamente que permita sesiones anónimas.

---

# 9. La consola interactiva

Después de conectarnos veremos:

```text
smb: \>
```

A partir de ese momento podemos utilizar los comandos internos de `smbclient`.

Podemos obtener ayuda utilizando:

```text
smb: \> help
```

También podemos consultar un comando específico:

```text
smb: \> help get
```

---

# 10. Listar archivos y directorios

El comando más utilizado es:

```text
smb: \> ls
```

También podemos utilizar:

```text
smb: \> dir
```

Ejemplo:

```text
smb: \> ls

  .                                   D        0  Mon Oct  4 20:10:10 2026
  ..                                  D        0  Mon Oct  4 20:10:10 2026
  documents                           D        0  Mon Oct  4 20:11:02 2026
  backup.zip                          A     2048  Mon Oct  4 20:12:15 2026

        12345678 blocks of size 1024
        9876543 blocks available
```

---

# 11. Navegar por directorios

Para entrar en un directorio:

```text
smb: \> cd documents
```

Podemos comprobar nuestra ubicación:

```text
smb: \documents\> pwd
Current directory is \\192.168.1.10\public\documents
```

Para regresar al directorio anterior:

```text
smb: \documents\> cd ..
```

---

# 12. Descargar archivos

El comando `get` permite descargar un archivo remoto:

```text
smb: \> get archivo.txt
```

Por ejemplo:

```text
smb: \> get report.pdf
getting file \report.pdf of size 24576 as report.pdf
```

El archivo será almacenado en el directorio local desde el que iniciamos `smbclient`.

---

# 13. Descargar múltiples archivos

Podemos utilizar `mget` para descargar varios archivos.

Por ejemplo:

```text
smb: \> mget *.txt
```

Esto intentará descargar todos los archivos `.txt`.

También:

```text
smb: \> mget *.pdf
```

o:

```text
smb: \> mget *
```

Dependiendo de la configuración, `smbclient` puede solicitar confirmación para cada archivo.

Podemos desactivar las confirmaciones interactivas utilizando:

```text
smb: \> prompt
```

---

# 14. Subir archivos

El comando `put` permite subir un archivo local al recurso SMB:

```text
smb: \> put archivo.txt
```

Por ejemplo:

```text
smb: \> put backup.zip
```

Si la cuenta tiene permisos de escritura, el archivo será almacenado en el directorio remoto actual.

---

# 15. Subir múltiples archivos

Podemos utilizar `mput`:

```text
smb: \> mput *.txt
```

Por ejemplo:

```text
smb: \> mput *.pdf
```

Esto intentará transferir todos los archivos que coincidan con el patrón.

---

# 16. Crear directorios

Si tenemos permisos suficientes podemos crear directorios:

```text
smb: \> mkdir backup
```

Después:

```text
smb: \> ls
```

Podremos comprobar que el directorio fue creado.

---

# 17. Eliminar archivos

El comando `del` permite eliminar archivos:

```text
smb: \> del archivo.txt
```

También puede utilizarse:

```text
smb: \> rm archivo.txt
```

La posibilidad de eliminar archivos depende de los permisos asignados a nuestra cuenta.

---

# 18. Renombrar archivos

Podemos utilizar:

```text
smb: \> rename viejo.txt nuevo.txt
```

Por ejemplo:

```text
smb: \> rename report.txt report-old.txt
```

---

# 19. Obtener información de archivos

Para consultar información sobre un archivo podemos utilizar:

```text
smb: \> allinfo archivo.txt
```

Dependiendo del servidor y de la implementación SMB, podemos obtener información como:

* Tamaño.
* Fechas.
* Atributos.
* Metadatos.
* Información del archivo.

---

# 20. Consultar atributos

Podemos utilizar:

```text
smb: \> getfacl archivo.txt
```

En servidores compatibles, esto puede proporcionar información relacionada con las ACL del archivo.

---

# 21. Descargar archivos desde una ruta específica

También podemos indicar una ruta remota:

```text
smb: \> get documents/report.pdf
```

Por ejemplo:

```text
smb: \> get documents/financial-report.pdf
```

---

# 22. Ejecutar comandos directamente sin entrar en la consola

Una característica muy útil de `smbclient` es que podemos ejecutar comandos directamente desde Bash utilizando `-c`.

Por ejemplo:

```bash
smbclient //192.168.1.10/public -N -c 'ls'
```

Esto permite obtener el contenido del recurso sin entrar en la consola interactiva.

Otro ejemplo:

```bash
smbclient //192.168.1.10/public -U alice -c 'ls'
```

Podemos ejecutar varias operaciones:

```bash
smbclient //192.168.1.10/public -U alice -c 'cd documents; ls'
```

---

# 23. Descargar un archivo directamente

Podemos combinar `-c` con `get`:

```bash
smbclient //192.168.1.10/public -U alice -c 'get report.pdf'
```

También:

```bash
smbclient //192.168.1.10/public -N -c 'get public.txt'
```

Esto resulta especialmente útil para automatización mediante scripts Bash.

---

# 24. Subir archivos desde Bash

De la misma manera:

```bash
smbclient //192.168.1.10/public -U alice -c 'put backup.zip'
```

---

# 25. Utilizar archivos de credenciales

Para evitar escribir credenciales directamente en el comando podemos utilizar un archivo de credenciales.

Crear:

```bash
nano ~/.smbcredentials
```

Contenido:

```text
username=alice
password=Password123!
domain=CONTOSO
```

Proteger el archivo:

```bash
chmod 600 ~/.smbcredentials
```

Posteriormente podemos utilizarlo:

```bash
smbclient //192.168.1.10/public -A ~/.smbcredentials
```

Esta opción es preferible a colocar contraseñas directamente en comandos que pueden quedar registrados en el historial.

---

# 26. Especificar el dominio

En entornos Windows/Active Directory podemos especificar un dominio:

```bash
smbclient //192.168.1.10/share -U 'CONTOSO/alice'
```

También:

```bash
smbclient //192.168.1.10/share -U 'alice' -W CONTOSO
```

Donde:

```text
CONTOSO → Dominio o grupo de trabajo
alice   → Usuario
```

---

# 27. Seleccionar la versión del protocolo SMB

SMB tiene diferentes versiones y dialectos.

Podemos especificar una versión utilizando:

```bash
smbclient //192.168.1.10/share --option='client min protocol=SMB2'
```

También podemos establecer un protocolo máximo:

```bash
smbclient //192.168.1.10/share --option='client max protocol=SMB3'
```

En sistemas modernos se recomienda evitar protocolos antiguos como SMB1/CIFS cuando no sean estrictamente necesarios, debido a sus problemas de seguridad y compatibilidad.

---

# 28. Enumeración básica durante un pentest

Cuando encontramos un servicio SMB, una metodología básica puede ser:

```text
1. Identificar el puerto SMB
2. Enumerar recursos compartidos
3. Comprobar acceso anónimo
4. Identificar recursos interesantes
5. Revisar permisos
6. Descargar archivos autorizados para análisis
7. Analizar la información obtenida
```

Por ejemplo:

```bash
smbclient -L 10.10.10.20 -N
```

Si encontramos:

```text
Sharename
---------
public
backup
documents
```

podemos probar individualmente:

```bash
smbclient //10.10.10.20/public -N
```

```bash
smbclient //10.10.10.20/backup -N
```

```bash
smbclient //10.10.10.20/documents -N
```

---

# 29. Diferencia entre SMB y SMBClient

Es importante no confundir ambos conceptos.

**SMB** es el protocolo.

```text
SMB
│
├── Compartición de archivos
├── Acceso remoto
├── Impresoras
└── Recursos de red
```

Mientras que:

```text
smbclient
```

es una herramienta que permite interactuar con servidores SMB desde la terminal.

Por ejemplo:

```bash
smbclient //192.168.1.10/public
```

utiliza SMB para comunicarse con el servidor.

---

# 30. Puertos relacionados con SMB

SMB puede encontrarse principalmente en:

```text
TCP/445
```

También pueden aparecer servicios SMB antiguos relacionados con:

```text
TCP/139
```

Una comprobación básica con Nmap sería:

```bash
nmap -p 139,445 192.168.1.10
```

Para obtener información adicional sobre SMB:

```bash
nmap -p 139,445 --script smb-protocols 192.168.1.10
```

Y para consultar información básica del servidor:

```bash
nmap -p 139,445 --script smb-os-discovery 192.168.1.10
```

---

# 31. Herramientas complementarias

`smbclient` es solamente una de las herramientas disponibles para trabajar con SMB.

## smbmap

`smbmap` permite enumerar rápidamente recursos SMB y sus permisos.

Ejemplo:

```bash
smbmap -H 192.168.1.10
```

Con usuario:

```bash
smbmap -H 192.168.1.10 -u alice -p 'Password123!'
```

---

## rpcclient

`rpcclient` permite interactuar con servicios RPC de Windows.

Con una sesión anónima:

```bash
rpcclient -U "" -N 192.168.1.10
```

Una vez dentro:

```text
rpcclient $> enumdomusers
```

También:

```text
rpcclient $> enumdomgroups
```

Su utilidad depende de la configuración del servidor y de los permisos disponibles.

---

## enum4linux-ng

`enum4linux-ng` automatiza diferentes técnicas de enumeración de SMB, NetBIOS, RPC y otros servicios relacionados.

Ejemplo:

```bash
enum4linux-ng 192.168.1.10
```

Con credenciales:

```bash
enum4linux-ng -u alice -p 'Password123!' 192.168.1.10
```

---

## Nmap

Nmap puede utilizarse para identificar servicios SMB:

```bash
nmap -p 139,445 192.168.1.10
```

También podemos ejecutar scripts NSE relacionados con SMB:

```bash
nmap -p 445 --script smb-* 192.168.1.10
```

> Algunos scripts pueden realizar comprobaciones más intrusivas. Utilízalos únicamente sobre sistemas autorizados.

---

# 32. Ejemplo completo de flujo de trabajo

Supongamos que durante una auditoría autorizada encontramos:

```text
192.168.1.10
```

Primero comprobamos los puertos SMB:

```bash
nmap -p 139,445 192.168.1.10
```

Después enumeramos los recursos:

```bash
smbclient -L 192.168.1.10 -N
```

Supongamos que obtenemos:

```text
Sharename       Type
---------       ----
public          Disk
documents       Disk
backup          Disk
IPC$            IPC
```

Probamos el recurso público:

```bash
smbclient //192.168.1.10/public -N
```

Listamos su contenido:

```text
smb: \> ls
```

Entramos en un directorio:

```text
smb: \> cd documents
```

Volvemos a listar:

```text
smb: \documents\> ls
```

Descargamos un archivo autorizado para análisis:

```text
smb: \documents\> get report.pdf
```

Salimos:

```text
smb: \documents\> exit
```

---

# 33. Comandos interactivos de referencia

| Comando   | Función                             |
| --------- | ----------------------------------- |
| `help`    | Mostrar ayuda                       |
| `ls`      | Listar archivos                     |
| `dir`     | Listar archivos                     |
| `cd`      | Cambiar directorio                  |
| `pwd`     | Mostrar directorio actual           |
| `get`     | Descargar archivo                   |
| `mget`    | Descargar múltiples archivos        |
| `put`     | Subir archivo                       |
| `mput`    | Subir múltiples archivos            |
| `mkdir`   | Crear directorio                    |
| `rmdir`   | Eliminar directorio                 |
| `del`     | Eliminar archivo                    |
| `rename`  | Renombrar archivo                   |
| `allinfo` | Mostrar información del archivo     |
| `getfacl` | Consultar ACL cuando sea compatible |
| `lcd`     | Cambiar directorio local            |
| `lpwd`    | Mostrar directorio local            |
| `prompt`  | Activar/desactivar confirmaciones   |
| `recurse` | Activar/desactivar recursividad     |
| `exit`    | Salir                               |
| `quit`    | Salir                               |

---

# 34. Opciones importantes de smbclient

Algunas de las opciones más utilizadas son:

| Opción      | Función                                          |
| ----------- | ------------------------------------------------ |
| `-L`        | Enumerar recursos compartidos                    |
| `-N`        | No solicitar contraseña                          |
| `-U`        | Especificar usuario                              |
| `-A`        | Utilizar archivo de credenciales                 |
| `-W`        | Especificar grupo de trabajo/dominio             |
| `-c`        | Ejecutar comandos sin entrar en modo interactivo |
| `-I`        | Especificar dirección IP                         |
| `-p`        | Especificar puerto                               |
| `--help`    | Mostrar ayuda                                    |
| `--version` | Mostrar versión                                  |

---

# 35. Automatización con Bash

Una de las ventajas de `smbclient` es que puede integrarse fácilmente con scripts.

Por ejemplo:

```bash
#!/bin/bash

TARGET="192.168.1.10"
SHARE="public"

smbclient "//$TARGET/$SHARE" -N -c "ls"
```

También podemos descargar un archivo automáticamente:

```bash
#!/bin/bash

TARGET="192.168.1.10"
SHARE="public"

smbclient "//$TARGET/$SHARE" -N -c "get report.pdf"
```

O ejecutar varias instrucciones:

```bash
smbclient //192.168.1.10/public -N -c "cd documents; ls; get report.pdf"
```

Esto permite incorporar SMB dentro de procesos automatizados de administración, inventario o auditoría.

---

# 36. Consideraciones de seguridad

Durante una auditoría SMB debemos prestar especial atención a:

### Acceso anónimo

Un servidor que permita:

```bash
smbclient -L 192.168.1.10 -N
```

puede estar exponiendo información que debería requerir autenticación.

### Recursos con permisos de escritura

Un recurso accesible mediante:

```bash
smbclient //192.168.1.10/public -N
```

que además permita:

```text
smb: \> put archivo.txt
```

tiene permisos de escritura para esa sesión.

### Credenciales

Evita almacenar contraseñas directamente en comandos:

```bash
smbclient //192.168.1.10/public -U 'alice%Password123!'
```

si el entorno requiere una gestión segura de secretos.

Es preferible:

```bash
smbclient //192.168.1.10/public -U alice
```

o utilizar un archivo de credenciales adecuadamente protegido.

### Protocolos antiguos

Siempre que sea posible, evita SMB1 y utiliza versiones modernas del protocolo.

---

# 37. Cheat Sheet

### Enumerar shares

```bash
smbclient -L 192.168.1.10
```

### Enumerar shares sin contraseña

```bash
smbclient -L 192.168.1.10 -N
```

### Conectarse a un share

```bash
smbclient //192.168.1.10/public
```

### Conectarse con usuario

```bash
smbclient //192.168.1.10/public -U alice
```

### Conectarse como anónimo

```bash
smbclient //192.168.1.10/public -N
```

### Listar archivos

```text
smb: \> ls
```

### Cambiar de directorio

```text
smb: \> cd documents
```

### Descargar

```text
smb: \> get file.txt
```

### Descargar varios

```text
smb: \> mget *.txt
```

### Subir

```text
smb: \> put file.txt
```

### Subir varios

```text
smb: \> mput *.txt
```

### Crear directorio

```text
smb: \> mkdir backup
```

### Eliminar archivo

```text
smb: \> del file.txt
```

### Renombrar

```text
smb: \> rename old.txt new.txt
```

### Ejecutar comando directamente

```bash
smbclient //192.168.1.10/public -N -c 'ls'
```

### Descargar sin entrar a la consola

```bash
smbclient //192.168.1.10/public -N -c 'get file.txt'
```

### Usar credenciales desde archivo

```bash
smbclient //192.168.1.10/public -A ~/.smbcredentials
```

### Escanear puertos SMB

```bash
nmap -p 139,445 192.168.1.10
```

### Identificar protocolo SMB

```bash
nmap -p 445 --script smb-protocols 192.168.1.10
```

---

# 38. Resumen

`smbclient` es una de las herramientas fundamentales para trabajar con servicios SMB desde Linux.

Su uso puede resumirse en cuatro etapas principales:

```text
             ┌─────────────────────┐
             │ Identificar SMB      │
             │ 139 / 445            │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ Enumerar recursos   │
             │ smbclient -L        │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ Autenticarse        │
             │ -U / -N / -A        │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ Interactuar          │
             │ ls / cd / get / put │
             └─────────────────────┘
```

Los comandos más importantes que debemos recordar son:

```bash
smbclient -L <IP> -N
```

```bash
smbclient //<IP>/<SHARE> -U <USUARIO>
```

```bash
smbclient //<IP>/<SHARE> -N
```

y dentro de la sesión:

```text
ls
cd
pwd
get
mget
put
mput
mkdir
del
rename
help
exit
```