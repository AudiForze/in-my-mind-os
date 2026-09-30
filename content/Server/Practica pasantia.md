### Que tenemos que hacer?(Lifegood0312##)

- [x]  Crear 200 usuarios con diferentes departamentos
- [x]  5 usuarios admin

Políticas

- [x]  Fondo
- [x]  Política De Admin Local
- [x]  Carpa Compartida
    
- [x]  Prohibición de extensiones
    
- [x]  Crear una por departamento (Que solo puedan acceder los de ese departamento)
    
- [x]  Prohibir cmd a un grupo
- [x]  Prohibir el ejecutar
- [x]  Prohibir Juegos

## How to create 200 uses on diferents areas

Para crear una cantidad masiva de usuarios vamos a tener que realizar un diccionario que contengo los usuarios, contraseñas y el departamento al que pertenece cada usuario. Para esto vamos a implementar la siguiente sentencia: `Name,Username,Password,Department` .

### Diccionarios

usuarios.csv

Ahora vamos a optimizar el proceso de creacion de usuarios, en vez de crear usuairos por usuarios vamos a crear un script que nos permita automatizar este proceso y hacerlo mas rapido. Para esto podemos emplear el siguiente codigo alterando la ruta segun el nombre y la ubicacion del archivo `usuarios.csv` y el  nombre del `dominio`.

```bash
Import-Csv -Path "C:\usuarios.csv" | Where-Object { $_.Username -and $_.Name -and $_.Password -and $_.Department } | ForEach-Object {
    New-ADUser -Name $_.Name `
               -SamAccountName $_.Username `
               -UserPrincipalName "$($_.Username)@red.interna" `
               -GivenName $_.Name.Split(" ")[0] `
               -Surname $_.Name.Split(" ")[1] `
               -Department $_.Department `
               L
               -AccountPassword (ConvertTo-SecureString $_.Password -AsPlainText -Force) `
               -Enabled $true
}
```

### Create 5 admin users.

Luego de crear nuestros 200 usuarios y sus diferentes departamentos, vamos a crear 5 usuarios de administracion que tengan permiso de administradores.

Comenzaremos creando un grupo de admins donde le pondremos los permisos de adminsitradores para luego crear un archivo `admins.csv` y desarrollar un nuevo script para automatizar este proceso.

```java
Name,Username,Password,Department
Admin1,admin1,P@sswordA1,Administración
Admin2,admin2,P@sswordA2,Administración
Admin3,admin3,P@sswordA3,Administración
Admin4,admin4,P@sswordA4,Administración
Admin5,admin5,P@sswordA5,Administración

```

Ahora vamos a modificar el codigo anterior que habiamos desarrollado y vamos a implementar una nueva `ruta`, donde tenemos alojado nuestro archivo `admins.csv`

```bash
Import-Csv -Path "C:\ruta\admins.csv" | ForEach-Object {
    New-ADUser -Name $_.Name `
               -SamAccountName $_.Username `
               -UserPrincipalName "$($_.Username)@tu_dominio.com" `
               -GivenName $_.Name.Split(" ")[0] `
               -Surname $_.Name.Split(" ")[1] `
               -Department $_.Department `
               -AccountPassword (ConvertTo-SecureString $_.Password -AsPlainText -Force) `
               -Enabled $true

    Add-ADGroupMember -Identity "Administradores" -Members $_.Username
}
```

### GPO to prevent changes of the wallpapers

Para prevenir que las personas puedan cambiar el fondo de pantalla y tengan uno de la empresa que nosotros tenemos crear un configurar una nuevo gpo para administrar el acceso a los cambios del fondo de pantalla.

![[image1.png]]

Para esto vamos a `User configuration` >`Administrave Temp` > `Desktop Wallpaper` y vamos a activar esta configuración para poder utilizar un wallpaper predetenimado donde esta la opción de Wallpaper Name, pondremos el path o ruta de la imagen ya sea.

- Png
- JPG
- JEPG

### GPO of local admin

La **GPO de Administradores Locales** es una configuración que nos permite controlar quién tiene permisos de administrador en una computadora o servidor específico. Para controlar y monitorizar los usuarios y roles que tiene cada uno en sus distintivas maquinas.}

Para esto vamos abrir el controlador de dominio y vamos agregar un nuevo grupo de usuario. 

![[image2.png]]

A este grupo le daremos el permiso de administradores de todos los usuarios del dominio

![[image3.png]]

Luego vamos a entrara a las gpo de nuestro servidor para poder agregar una nueva una nueva politica.

![[image4.png]]

Continuando con el proceso vamos a dirigirnos hacia la política y con clic derecho vamos a editarla. y buscaremos la siguiente configuración.

`Computer Configuration > Policies > Windows Settings > Security Settings > Restricted Groups` y agregaremos un nuevo grupo donde pondremos el nombre del grupo que creamos anteriormente para los admin locales. 

![[image5.png]]

Después de esto podemos dirigirnos a la **Administración de directivas de grupo** hacemos clic con el botón derecho en la unidad organizativa deseada y seleccionar la opción para vincular un GPO existente.

![[image6.png]]

### Create a share folder on Windows server

Abriremos el Administrador del servidor y vamos a Administración de recursos compartidos, que se encuentra en Servicios de archivos y almacenamiento.

![[image7.png]]

Luego de esto vamos a darle click derecho y vamos a crear una nueva carpeta compatida o podemos agregar una nueva tarea.

1. Seleccionaremos el perfil `SMB Share – Fast` y hacemos clic en `Siguiente`.
2. Seleccionaremos `Escriba una ruta personalizada` y clic en `Examinar` .
3. Vamos a `buscar la carpeta para compartir` y luego clic en `Seleccionar esta carpeta`.
4. Si La `ruta de la carpeta` está configurada, hacemos clic en `Siguiente` .
5. Si es necesario, cambiamos el `nombre del recurso compartido` y luego clic en `Siguiente` .
6. Hacemos clic en `Personalizar permisos` .
7. Con los permisos configurados, hacemos clic en `Siguiente` .
8. Iniciamos la creación del recurso compartido haciendo clic en `Crear` .

Proceso a traves de imagenes

### Remove acces to CMD for a group

Para poder realizar este tipo de gpos vamos a dirigirnos al apartado de las gpo de nuestro servidor y vamos a crear una nueva política la cual le podremos como nombre el que deseamos (Como puede ser `“Acceso a cmd”` para que sea fácil de identificar) .

Luego nos vamos a dirigir al siguiente apartado para habilitar esta nueva política.

`User configuration` >`Administrave Temp` > `System` > `Prevent access to the command prompt` .

Luego de habilitarla tendremos una opción de habilitar o deshabilitar la **ejecución de scripts.** 

> *“Esta opción bloqueara a cualquier aplicación que quiera o necesite ejecutar cualquier script o comando en el símbolo de sistema, por lo que puede no ser la mejor opción”*
> 

### Remove Access to Run

Después de crear nuestra política vamos a irnos hasta las siguientes configuraciones:

`User configuration` >`Administrave Temp` > `System` > `Remove Run...` .

Luego de esto vamos a habilitar esta nueva configuración para la política que creamos.

![[image8.png]]

### Remove acces to run games or specified programs in our server

Vamos a crear una nueva política de seguridad y vamos a realizar la siguiente configuración con la misma.

`User Configuration` > `Administrative Templates` > `System`

![[image9.png]]

Entonces dentro de este espacio vamos a identificar cuales son las aplicaciones que no deseamos que se ejecuten en nuestro sistemas. 

![[image10.png]]