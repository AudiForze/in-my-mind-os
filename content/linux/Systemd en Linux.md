*Servicios, arranque, logs y automatización desde la terminal*

Cuando utilizamos Linux normalmente ejecutamos comandos, abrimos aplicaciones y trabajamos con procesos sin preocuparnos demasiado por lo que ocurre detrás de ellos. Sin embargo, desde que encendemos el ordenador hasta que aparece nuestro escritorio, existe todo un sistema encargado de iniciar procesos, montar sistemas de archivos, levantar servicios, administrar dependencias, registrar errores y mantener funcionando determinados programas.

En la mayoría de distribuciones modernas ese trabajo está relacionado con **systemd**.

Systemd no es simplemente un programa para iniciar servicios. Es un **system and service manager** que, cuando se ejecuta como PID 1, actúa como el primer proceso del sistema y coordina gran parte del espacio de usuario. Además, trabaja con un modelo basado en unidades (*units*) y dependencias.

En este artículo veremos systemd desde cero hasta llegar a la creación de servicios y automatizaciones reales.

---

# 1. ¿Qué es systemd?

**systemd** es el sistema de inicialización y administrador de servicios utilizado por muchas distribuciones Linux modernas.

Cuando Linux termina de cargar el kernel, necesita iniciar el resto del sistema:

```text
Kernel
   │
   ▼
systemd (PID 1)
   │
   ├── Servicios
   ├── Montajes
   ├── Dispositivos
   ├── Timers
   ├── Sockets
   ├── Targets
   └── Otros componentes
```

Podemos comprobar si nuestro sistema utiliza systemd con:

```bash
ps -p 1 -o pid,comm,args
```

Un resultado típico sería:

```text
PID COMMAND COMMAND
  1 systemd /sbin/init
```

El dato importante es:

```text
PID = 1
```

PID 1 es un proceso especial. Es el proceso que inicia y supervisa el espacio de usuario.

También podemos ejecutar:

```bash
systemctl --version
```

Por ejemplo:

```text
systemd 259
+PAM +AUDIT +SELINUX +APPARMOR +IMA +SMACK
+SECCOMP +GCRYPT +GNUTLS +OPENSSL
...
```

La versión exacta dependerá de nuestra distribución.

---

# 2. ¿Por qué systemd es importante?

Una de las tareas principales de systemd es administrar servicios.

Por ejemplo:

```text
NetworkManager
sshd
bluetooth
docker
cups
postgresql
nginx
```

Todos ellos pueden ser administrados mediante systemd.

En lugar de ejecutar manualmente:

```bash
./servidor &
```

podemos crear un servicio:

```text
mi-servidor.service
```

y permitir que systemd se encargue de:

* iniciarlo;
* detenerlo;
* reiniciarlo;
* supervisarlo;
* registrar sus logs;
* controlar sus dependencias;
* iniciarlo automáticamente durante el boot;
* reiniciarlo si falla, cuando así se configure.

---

# 3. El concepto fundamental: Units

Antes de aprender `systemctl`, hay que entender qué es una **unit**.

Systemd utiliza diferentes tipos de unidades para representar recursos o mecanismos que necesita administrar. Entre ellas existen:

```text
.service
.socket
.target
.device
.mount
.automount
.swap
.timer
.path
.slice
.scope
```

Por ejemplo:

```text
nginx.service
docker.service
sshd.service
backup.timer
multi-user.target
```

Cada extensión representa un tipo diferente de unidad.

Las más importantes para comenzar son:

| Unit       | Función                                                    |
| ---------- | ---------------------------------------------------------- |
| `.service` | Gestiona servicios/procesos                                |
| `.timer`   | Programa la activación de unidades                         |
| `.target`  | Agrupa unidades y representa estados del sistema           |
| `.socket`  | Gestiona sockets y activación por socket                   |
| `.mount`   | Gestiona puntos de montaje                                 |
| `.path`    | Puede activar unidades cuando cambia un archivo/directorio |

---

# 4. ¿Qué es un `.service`?

Un archivo:

```text
algo.service
```

describe cómo systemd debe ejecutar y controlar un servicio.

Por ejemplo:

```text
mi-servidor.service
```

podría decir:

```text
Descripción:
    Mi servidor web

Programa:
    /usr/bin/python

Argumentos:
    /home/user/server.py

Usuario:
    user

Reinicio:
    si falla
```

Los archivos de unidades utilizan secciones como:

```ini
[Unit]

[Service]

[Install]
```

Cada sección tiene una responsabilidad diferente.

---

# 5. La arquitectura básica de un servicio

Un servicio sencillo puede tener esta estructura:

```ini
[Unit]
Description=Mi servidor Python
After=network.target

[Service]
ExecStart=/usr/bin/python /home/user/server.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Vamos a analizarlo.

## `[Unit]`

Contiene información general y dependencias.

```ini
[Unit]
Description=Mi servidor Python
After=network.target
```

`Description` proporciona una descripción legible.

`After=` define un orden.

En este caso:

```ini
After=network.target
```

significa que systemd debe ordenar este servicio después de `network.target`.

Esto **no significa por sí solo que `network.target` sea iniciado por este servicio**. Las relaciones de dependencia y las relaciones de orden son conceptos diferentes.

---

# 6. `[Service]`

Esta sección define cómo se ejecutará el programa.

Por ejemplo:

```ini
[Service]
ExecStart=/usr/bin/python /home/user/server.py
Restart=on-failure
```

`ExecStart` indica qué programa debe ejecutarse.

`Restart=on-failure` indica que systemd puede intentar reiniciar el servicio si termina debido a un fallo.

También podemos especificar el usuario:

```ini
User=geremy
```

y el directorio de trabajo:

```ini
WorkingDirectory=/home/geremy/app
```

Por ejemplo:

```ini
[Service]
User=geremy
WorkingDirectory=/home/geremy/app
ExecStart=/usr/bin/python /home/geremy/app/server.py
Restart=on-failure
```

Esto es preferible a ejecutar automáticamente todo como `root` cuando no existe una necesidad real de privilegios.

---

# 7. `[Install]`

Esta sección determina cómo puede integrarse la unidad con otros targets cuando utilizamos operaciones como:

```bash
systemctl enable
```

Por ejemplo:

```ini
[Install]
WantedBy=multi-user.target
```

Esto permite habilitar el servicio para que sea incorporado al conjunto de unidades asociadas con `multi-user.target`.

Los `target` funcionan como agrupaciones y puntos de sincronización dentro del modelo de dependencias de systemd. Son una evolución más flexible de los antiguos runlevels de SysV init.

---

# 8. `systemctl`: el controlador de systemd

El comando principal que utilizamos para comunicarnos con systemd es:

```bash
systemctl
```

Podemos pensar en él como el cliente que envía instrucciones al administrador de servicios.

Por ejemplo:

```bash
systemctl status
```

muestra información general del estado del sistema.

Para trabajar con un servicio:

```bash
systemctl status nginx
```

---

# 9. Ver el estado de un servicio

Ejecutemos:

```bash
systemctl status sshd
```

Podríamos obtener algo parecido a:

```text
● sshd.service - OpenSSH server daemon
     Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled)
     Active: active (running) since Mon 2026-09-28 18:21:03 AST
   Main PID: 842 (sshd)
      Tasks: 1
     Memory: 4.8M
        CPU: 32ms
```

Hay varias líneas importantes.

### Loaded

```text
Loaded: loaded
```

significa que systemd encontró y cargó la unidad.

También puede aparecer:

```text
enabled
```

Esto indica que la unidad está habilitada para ser incorporada mediante su mecanismo de instalación correspondiente.

### Active

```text
Active: active (running)
```

indica que actualmente está funcionando.

Otros estados comunes incluyen:

```text
active
inactive
failed
activating
deactivating
```

### Main PID

```text
Main PID: 842
```

nos muestra el PID principal asociado al servicio.

---

# 10. Iniciar un servicio

Podemos iniciar un servicio con:

```bash
sudo systemctl start nginx
```

Después comprobamos:

```bash
systemctl status nginx
```

Si todo funciona correctamente veremos:

```text
Active: active (running)
```

---

# 11. Detener un servicio

Para detenerlo:

```bash
sudo systemctl stop nginx
```

Y:

```bash
systemctl status nginx
```

podría mostrar:

```text
Active: inactive (dead)
```

---

# 12. Reiniciar un servicio

Podemos reiniciarlo:

```bash
sudo systemctl restart nginx
```

Esto detiene y vuelve a iniciar el servicio.

Es especialmente útil después de realizar cambios de configuración.

---

# 13. Recargar la configuración

Existe una diferencia importante entre:

```bash
restart
```

y:

```bash
reload
```

Un servicio que soporte recarga puede utilizar:

```bash
sudo systemctl reload nginx
```

La idea es aplicar cambios sin necesariamente reiniciar completamente el proceso.

No todos los servicios soportan `reload`.

Podemos consultar qué ofrece una unidad mediante:

```bash
systemctl cat nginx
```

o:

```bash
systemctl show nginx
```

---

# 14. `enable` vs `start`

Esta es una de las diferencias más importantes de systemd.

```bash
systemctl start nginx
```

significa:

> Inicia nginx ahora.

Mientras:

```bash
systemctl enable nginx
```

significa:

> Configura la unidad para que sea incorporada automáticamente al arranque según sus relaciones de instalación.

Por lo tanto:

```bash
start ≠ enable
```

Podemos tener:

```text
START
  ↓
ejecutar ahora
```

y:

```text
ENABLE
  ↓
preparar para arranque automático
```

También podemos hacer ambas cosas:

```bash
sudo systemctl enable --now nginx
```

Esto habilita el servicio y lo inicia inmediatamente.

---

# 15. Deshabilitar un servicio

Para evitar que una unidad habilitada sea incorporada automáticamente al arranque:

```bash
sudo systemctl disable nginx
```

Si además queremos detenerla ahora:

```bash
sudo systemctl disable --now nginx
```

---

# 16. Comprobar si un servicio está habilitado

```bash
systemctl is-enabled nginx
```

Resultado:

```text
enabled
```

o:

```text
disabled
```

También podemos preguntar si está activo:

```bash
systemctl is-active nginx
```

Resultado:

```text
active
```

Esto resulta muy útil para scripts.

Por ejemplo:

```bash
if systemctl is-active --quiet nginx; then
    echo "Nginx está funcionando"
else
    echo "Nginx está detenido"
fi
```

---

# 17. Listar servicios

Podemos consultar las unidades activas:

```bash
systemctl list-units --type=service
```

Ejemplo:

```text
UNIT                         LOAD   ACTIVE SUB     DESCRIPTION
dbus.service                 loaded active running D-Bus System Message Bus
NetworkManager.service       loaded active running Network Manager
sshd.service                 loaded active running OpenSSH server daemon
systemd-journald.service     loaded active running Journal Service
```

Para incluir unidades que no están activas:

```bash
systemctl list-units --type=service --all
```

---

# 18. Buscar servicios fallidos

Una de las herramientas más útiles para diagnosticar un sistema es:

```bash
systemctl --failed
```

Podríamos obtener:

```text
UNIT                 LOAD   ACTIVE SUB    DESCRIPTION
● example.service    loaded failed failed Example Service
```

Si aparece algo en esta lista, tenemos un punto de partida para investigar.

---

# 19. Inspeccionar una unidad

Podemos utilizar:

```bash
systemctl cat sshd
```

Esto muestra el contenido de la unidad y, cuando corresponde, sus fragmentos relacionados.

También podemos utilizar:

```bash
systemctl show sshd
```

que devuelve propiedades internas de la unidad.

Por ejemplo:

```text
Id=sshd.service
Type=notify
Restart=on-failure
ExecStart={ path=/usr/bin/sshd ; argv[]=/usr/bin/sshd -D ; ... }
User=root
```

`systemctl show` es especialmente útil cuando queremos obtener información que pueda ser procesada por scripts.

---

# 20. ¿Dónde están los archivos `.service`?

Systemd tiene diferentes ubicaciones para las unidades.

Las unidades proporcionadas por paquetes suelen encontrarse en:

```text
/usr/lib/systemd/system/
```

Mientras que las unidades creadas por el administrador normalmente se colocan en:

```text
/etc/systemd/system/
```

Para servicios propios, una ubicación habitual es:

```text
/etc/systemd/system/
```

Por ejemplo:

```text
/etc/systemd/system/quantlab.service
```

La búsqueda de unidades de systemd utiliza diferentes rutas y prioridades; no debemos asumir que todos los archivos estarán en un único directorio.

---

# 21. Crear nuestro primer servicio

Vamos a crear un servicio sencillo.

Nuestro programa será:

```bash
/usr/bin/bash
```

y simplemente escribirá un mensaje en el journal.

Primero creamos:

```bash
sudo nano /etc/systemd/system/hello.service
```

Contenido:

```ini
[Unit]
Description=Mi primer servicio systemd

[Service]
Type=oneshot
ExecStart=/usr/bin/bash -c 'echo "Hola desde systemd"'

[Install]
WantedBy=multi-user.target
```

Guardamos el archivo.

Ahora debemos informar a systemd de que existe una nueva unidad:

```bash
sudo systemctl daemon-reload
```

Este paso es importante después de crear o modificar archivos de unidades.

---

# 22. Ejecutar nuestro servicio

Ahora:

```bash
sudo systemctl start hello.service
```

Comprobamos:

```bash
systemctl status hello.service
```

Podríamos ver:

```text
● hello.service - Mi primer servicio systemd
     Loaded: loaded (/etc/systemd/system/hello.service)
     Active: inactive (dead)
```

Puede parecer extraño.

¿Por qué dice `inactive` si funcionó?

Porque utilizamos:

```ini
Type=oneshot
```

El proceso ejecuta su tarea y termina.

No es un daemon que permanezca ejecutándose.

---

# 23. Ver el resultado con journalctl

Aquí aparece otra pieza fundamental de systemd:

```bash
journalctl
```

Ejecutemos:

```bash
journalctl -u hello.service
```

Podríamos obtener:

```text
Sep 30 20:14:31 linux bash[1234]: Hola desde systemd
```

El journal almacena registros gestionados por `systemd-journald`, y `journalctl` permite consultarlos y filtrarlos.

---

# 24. ¿Qué es journald?

`systemd-journald` es el servicio responsable de recopilar y gestionar registros del sistema.

En lugar de tener que buscar manualmente cada log, podemos utilizar:

```bash
journalctl
```

para consultar el journal.

Por ejemplo:

```bash
journalctl
```

muestra los registros disponibles a los que nuestro usuario tenga acceso.

---

# 25. Ver los logs de un servicio específico

Esta es probablemente una de las opciones más importantes:

```bash
journalctl -u nginx
```

O explícitamente:

```bash
journalctl -u nginx.service
```

Para nuestro ejemplo:

```bash
journalctl -u hello.service
```

Esto evita tener que buscar entre todos los logs del sistema.

---

# 26. Ver solamente los logs recientes

Podemos utilizar:

```bash
journalctl -u nginx -n 50
```

Esto muestra las últimas 50 entradas relacionadas con nginx.

También:

```bash
journalctl -n 100
```

muestra las últimas 100 entradas generales.

---

# 27. Seguir los logs en tiempo real

Una de las opciones más útiles:

```bash
journalctl -u nginx -f
```

La opción:

```text
-f
```

significa seguir el journal.

Es similar al comportamiento de:

```bash
tail -f
```

Podríamos ver:

```text
Sep 30 20:20:01 server nginx[1234]: request received
Sep 30 20:20:02 server nginx[1234]: request completed
Sep 30 20:20:05 server nginx[1234]: request received
```

Y las nuevas entradas aparecerán automáticamente.

Para salir:

```text
Ctrl + C
```

---

# 28. Buscar errores

Podemos filtrar por prioridad.

Por ejemplo:

```bash
journalctl -p err
```

o:

```bash
journalctl -p warning
```

También podemos combinarlo con un servicio:

```bash
journalctl -u nginx -p err
```

Esto resulta extremadamente útil cuando un servicio falla.

---

# 29. Ver los logs del boot actual

Podemos utilizar:

```bash
journalctl -b
```

Esto muestra los registros relacionados con el arranque actual.

Para consultar el boot anterior:

```bash
journalctl -b -1
```

Otro anterior:

```bash
journalctl -b -2
```

Esto es especialmente útil cuando el ordenador tuvo problemas después de reiniciarse.

---

# 30. Ver los logs del kernel

Podemos utilizar:

```bash
journalctl -k
```

Esto filtra los mensajes relacionados con el kernel.

También podemos utilizar:

```bash
dmesg
```

aunque `journalctl -k` resulta especialmente conveniente en sistemas que utilizan journald.

---

# 31. Logs desde una fecha determinada

Podemos filtrar por tiempo:

```bash
journalctl --since "2026-09-30 18:00:00"
```

También:

```bash
journalctl --since today
```

o:

```bash
journalctl --since yesterday
```

Y podemos especificar un intervalo:

```bash
journalctl \
    --since "2026-09-30 18:00:00" \
    --until "2026-09-30 20:00:00"
```

Esto resulta muy útil cuando sabemos aproximadamente cuándo ocurrió un problema.

---

# 32. ¿Dónde se almacenan los logs?

El journal puede utilizar almacenamiento persistente o volátil.

Cuando existe:

```text
/var/log/journal/
```

se puede utilizar almacenamiento persistente, dependiendo de la configuración de journald.

Sin almacenamiento persistente, el journal puede almacenarse bajo:

```text
/run/log/journal/
```

y esos registros pueden perderse al reiniciar.

Podemos comprobar:

```bash
ls -lah /var/log/journal/
```

Si queremos configurar almacenamiento persistente, una opción habitual es crear el directorio:

```bash
sudo mkdir -p /var/log/journal
```

y posteriormente permitir que systemd configure correctamente los permisos:

```bash
sudo systemd-tmpfiles --create --prefix /var/log/journal
```

---

# 33. ¿Qué ocurre durante el boot?

Ahora podemos entender una parte fundamental.

Un esquema simplificado sería:

```text
UEFI / BIOS
     │
     ▼
Bootloader
     │
     ▼
Linux Kernel
     │
     ▼
systemd (PID 1)
     │
     ▼
default.target
     │
     ├── servicios
     ├── mounts
     ├── sockets
     ├── timers
     └── otros targets
```

Durante el arranque, systemd activa `default.target`, que normalmente apunta a un target como `graphical.target` o `multi-user.target`, dependiendo de la configuración.

---

# 34. ¿Qué es un target?

Un target no es necesariamente un programa.

Podemos entenderlo como una **agrupación lógica de unidades y un punto de sincronización**.

Algunos targets importantes son:

```text
basic.target
multi-user.target
graphical.target
network.target
network-online.target
timers.target
shutdown.target
reboot.target
```

Por ejemplo:

```text
graphical.target
       │
       ├── display-manager.service
       ├── servicios
       ├── network
       └── otros componentes
```

Los targets permiten construir relaciones de dependencia entre diferentes unidades.

---

# 35. Ver el target predeterminado

Podemos ejecutar:

```bash
systemctl get-default
```

Un sistema gráfico podría devolver:

```text
graphical.target
```

Un servidor podría utilizar:

```text
multi-user.target
```

También podemos consultar:

```bash
systemctl list-dependencies graphical.target
```

Esto permite explorar qué unidades están relacionadas con ese target.

---

# 36. Iniciar automáticamente nuestro servicio

Volvamos a:

```text
hello.service
```

Tenemos:

```ini
[Install]
WantedBy=multi-user.target
```

Ahora podemos ejecutar:

```bash
sudo systemctl enable hello.service
```

Esto configura el servicio para que sea incorporado al arranque mediante la relación declarada en `[Install]`.

Podemos comprobarlo:

```bash
systemctl is-enabled hello.service
```

Resultado esperado:

```text
enabled
```

Para habilitarlo y arrancarlo inmediatamente:

```bash
sudo systemctl enable --now hello.service
```

---

# 37. Dependencias: una de las grandes ventajas de systemd

Systemd no solamente sabe:

> "Ejecuta este programa."

También puede saber:

> "Ejecuta este programa después de que otro recurso esté disponible."

Por ejemplo:

```ini
[Unit]
Description=Servidor web
After=network-online.target
Wants=network-online.target
```

Aquí aparecen dos conceptos diferentes:

```text
After=
```

establece orden.

Mientras:

```text
Wants=
```

establece una relación de dependencia más débil.

Una forma sencilla de visualizarlo:

```text
network-online.target
        │
        │ After=
        ▼
myserver.service
```

Las dependencias son una parte central del modelo de systemd. Las unidades pueden formar relaciones complejas y systemd utiliza esas relaciones para construir y ordenar los trabajos que debe ejecutar.

---

# 38. `Requires=` vs `Wants=`

También podemos encontrar:

```ini
Requires=network-online.target
```

y:

```ini
Wants=network-online.target
```

Conceptualmente:

### Wants

```ini
Wants=algo.service
```

expresa:

> Quiero que esta otra unidad también sea activada.

Pero su fallo no implica necesariamente que nuestra unidad deba fallar.

### Requires

```ini
Requires=algo.service
```

establece una relación más fuerte.

En configuraciones reales debemos estudiar también `After=`, `Before=`, `BindsTo=`, `PartOf=` y otras directivas antes de asumir exactamente cómo reaccionará una unidad ante el fallo de otra.

---

# 39. Crear un servicio real

Ahora vamos a crear algo más interesante.

Supongamos que tenemos:

```text
/home/user/myapp/server.py
```

y queremos que se ejecute automáticamente.

Podemos crear:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Contenido:

```ini
[Unit]
Description=Mi aplicación Python
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=user
WorkingDirectory=/home/user/myapp
ExecStart=/usr/bin/python /home/user/myapp/server.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Hay que sustituir:

```text
user
```

por el usuario real del sistema.

---

# 40. Aplicar el servicio

Después de guardar:

```bash
sudo systemctl daemon-reload
```

Luego:

```bash
sudo systemctl start myapp.service
```

Comprobamos:

```bash
systemctl status myapp.service
```

Si funciona:

```text
● myapp.service - Mi aplicación Python
     Loaded: loaded (/etc/systemd/system/myapp.service)
     Active: active (running)
     Main PID: 1452 (python)
```

Ahora podemos habilitarlo:

```bash
sudo systemctl enable myapp.service
```

o directamente:

```bash
sudo systemctl enable --now myapp.service
```

---

# 41. ¿Qué pasa si nuestro programa falla?

Supongamos que `server.py` se cierra.

Tenemos:

```ini
Restart=on-failure
RestartSec=5
```

Por lo tanto, systemd puede detectar la terminación por fallo y volver a intentar iniciar el servicio después de cinco segundos.

Podemos observar esto con:

```bash
journalctl -u myapp.service -f
```

Podríamos observar:

```text
server started
application error
Main process exited
Scheduled restart job
Starting service
server started
```

Esta supervisión es una de las razones por las que resulta mejor utilizar un service manager que simplemente ejecutar un proceso con:

```bash
python server.py &
```

---

# 42. Automatización con systemd timers

Hasta ahora hemos utilizado servicios.

Pero systemd tiene otro componente extremadamente interesante:

```text
.timer
```

Un **timer unit** permite activar otra unidad basándose en condiciones temporales.

Un timer normalmente activa un `.service` correspondiente. Por ejemplo:

```text
backup.timer
      │
      ▼
backup.service
```

Por convención, si tenemos:

```text
backup.timer
```

systemd puede activar:

```text
backup.service
```

cuando el timer expira.

---

# 43. Crear nuestro primer timer

Vamos a crear un pequeño sistema de backup.

Primero:

```bash
sudo nano /etc/systemd/system/backup.service
```

Contenido:

```ini
[Unit]
Description=Backup automático

[Service]
Type=oneshot
ExecStart=/usr/bin/bash -c 'echo "Backup ejecutado: $(date)"'
```

Ahora:

```bash
sudo nano /etc/systemd/system/backup.timer
```

Contenido:

```ini
[Unit]
Description=Ejecutar backup periódicamente

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
Unit=backup.service

[Install]
WantedBy=timers.target
```

---

# 44. ¿Qué significa `OnBootSec`?

```ini
OnBootSec=5min
```

significa que el timer puede activar el servicio cinco minutos después del arranque.

Por otro lado:

```ini
OnUnitActiveSec=1h
```

indica un intervalo de una hora respecto a la activación de la unidad correspondiente.

Los timers disponen de diferentes mecanismos de programación, incluyendo `OnCalendar=` para horarios basados en calendario.

---

# 45. Activar el timer

Después de crear los archivos:

```bash
sudo systemctl daemon-reload
```

Luego:

```bash
sudo systemctl enable --now backup.timer
```

Podemos comprobar:

```bash
systemctl status backup.timer
```

Y también:

```bash
systemctl list-timers
```

Podríamos ver:

```text
NEXT                         LEFT      LAST
Thu 2026-10-01 21:00:00 AST  42min     Thu 2026-10-01 20:00:00 AST
```

La columna importante es:

```text
NEXT
```

porque indica cuándo está programada la siguiente activación.

---

# 46. Automatización con `OnCalendar`

Para tareas más precisas podemos utilizar:

```ini
OnCalendar=daily
```

Por ejemplo:

```ini
[Timer]
OnCalendar=daily
Persistent=true
```

Esto puede utilizarse para ejecutar un servicio diariamente.

También podemos utilizar expresiones más específicas, por ejemplo:

```ini
OnCalendar=*-*-* 03:00:00
```

para programarlo alrededor de las 03:00.

La sintaxis exacta de `OnCalendar=` permite construir programaciones mucho más complejas.

Podemos consultar cómo interpreta systemd una expresión con:

```bash
systemd-analyze calendar "daily"
```

Ejemplo:

```text
Normalized form: daily
Next elapse: Thu 2026-10-01 00:00:00 AST
```

Esta herramienta es excelente para comprobar una expresión antes de ponerla en producción.

---

# 47. `Persistent=true`

Existe una opción particularmente útil:

```ini
Persistent=true
```

Supongamos que tenemos:

```ini
[Timer]
OnCalendar=daily
Persistent=true
```

y el ordenador estaba apagado cuando correspondía ejecutar la tarea.

Con `Persistent=true`, systemd puede ejecutar el servicio al activarse nuevamente el timer si la ejecución programada se perdió bajo las condiciones descritas por systemd.

Esto hace que los timers sean muy interesantes para tareas como:

```text
backups
limpieza
reportes
sincronización
mantenimiento
```

---

# 48. Ver todos los timers

Podemos ejecutar:

```bash
systemctl list-timers
```

o:

```bash
systemctl list-timers --all
```

Un resultado puede parecerse a:

```text
NEXT                         LEFT     LAST
Thu 2026-10-01 21:00:00 AST  30min    Thu 20:00:00
Fri 2026-10-02 00:00:00 AST  3h       Thu 00:00:00

UNIT
backup.timer
log-cleanup.timer
```

---

# 49. Cron vs systemd timers

Linux tradicionalmente utiliza `cron` para automatizaciones.

Por ejemplo:

```text
0 3 * * * /home/user/backup.sh
```

Systemd ofrece otra alternativa:

```text
backup.service
        +
backup.timer
```

Una ventaja de utilizar timers es que la tarea queda integrada en el ecosistema de systemd.

Podemos consultar:

```bash
systemctl status backup.service
```

y:

```bash
journalctl -u backup.service
```

Por lo tanto, la automatización tiene:

```text
programación
     ↓
timer
     ↓
service
     ↓
ejecución
     ↓
journal
```

Esto proporciona una forma coherente de programar y posteriormente investigar las ejecuciones.

---

# 50. Diagnosticar un servicio que falla

Imaginemos:

```bash
systemctl status myapp
```

y obtenemos:

```text
● myapp.service
     Loaded: loaded
     Active: failed
```

No debemos comenzar a modificar archivos aleatoriamente.

Podemos seguir una metodología.

### Paso 1: estado

```bash
systemctl status myapp
```

### Paso 2: logs

```bash
journalctl -u myapp -n 100
```

### Paso 3: logs recientes

```bash
journalctl -u myapp --since "10 minutes ago"
```

### Paso 4: configuración

```bash
systemctl cat myapp
```

### Paso 5: propiedades

```bash
systemctl show myapp
```

### Paso 6: comprobar el ejecutable

Si tenemos:

```ini
ExecStart=/usr/bin/python /home/user/myapp/server.py
```

comprobamos:

```bash
ls -l /usr/bin/python
```

y:

```bash
ls -l /home/user/myapp/server.py
```

---

# 51. Un error muy común: `ExecStart`

Supongamos que tenemos:

```ini
ExecStart=python server.py
```

Dependiendo del servicio y del entorno, esto puede provocar problemas.

Es preferible utilizar rutas explícitas:

```ini
ExecStart=/usr/bin/python /home/user/myapp/server.py
```

Esto evita depender del `PATH` interactivo de nuestro usuario.

Systemd no debe asumirse como equivalente a ejecutar un comando desde nuestra shell interactiva.

---

# 52. Otro error común: variables de entorno

Desde nuestra terminal puede funcionar:

```bash
python app.py
```

pero systemd puede fallar.

¿Por qué?

Porque nuestro shell interactivo puede tener variables como:

```text
PATH
HOME
API_KEY
VIRTUAL_ENV
```

que no existen de la misma forma en el entorno del servicio.

Podemos declarar variables mediante:

```ini
Environment="MODE=production"
```

Por ejemplo:

```ini
[Service]
Environment="MODE=production"
Environment="PORT=8080"
ExecStart=/usr/bin/python /home/user/app/server.py
```

Para configuraciones más grandes puede utilizarse:

```ini
EnvironmentFile=/etc/myapp/environment
```

---

# 53. Seguridad: no ejecutar todo como root

Un error frecuente al crear servicios es:

```ini
User=root
```

para absolutamente todo.

Si la aplicación no necesita privilegios administrativos, es preferible ejecutar:

```ini
User=usuario
```

Por ejemplo:

```ini
[Service]
User=geremy
ExecStart=/usr/bin/python /home/geremy/app/server.py
```

De esta manera, si la aplicación tiene una vulnerabilidad, el proceso no necesariamente tendrá todos los privilegios de `root`.

Systemd además proporciona diferentes mecanismos de aislamiento y restricciones de recursos que pueden utilizarse para endurecer servicios.

---

# 54. Analizar el boot

Systemd también proporciona herramientas para estudiar el arranque.

Podemos utilizar:

```bash
systemd-analyze
```

Ejemplo:

```text
Startup finished in 3.201s (firmware) + 1.102s (loader)
+ 2.421s (kernel) + 4.873s (userspace)
= 11.597s
graphical.target reached after 4.812s in userspace
```

Esto nos permite saber aproximadamente cuánto tardó cada etapa.

---

# 55. ¿Qué servicio está tardando demasiado?

Podemos utilizar:

```bash
systemd-analyze blame
```

Ejemplo:

```text
2.812s NetworkManager-wait-online.service
1.421s systemd-udev-settle.service
0.842s docker.service
0.412s systemd-logind.service
```

Esto nos muestra unidades que consumieron tiempo durante el arranque.

Pero hay que tener cuidado:

> `systemd-analyze blame` no significa automáticamente que el servicio de la primera línea sea "la causa" de un boot lento.

Las relaciones de dependencia y el paralelismo de systemd hacen que interpretar el tiempo de arranque requiera más contexto.

---

# 56. Visualizar la cadena de dependencias

Otra herramienta interesante:

```bash
systemd-analyze critical-chain
```

Podemos obtener algo parecido a:

```text
graphical.target
└─multi-user.target
  └─docker.service
    └─network-online.target
      └─NetworkManager.service
```

Esto ayuda a entender qué unidades forman parte de la cadena crítica del arranque.

---

# 57. El modelo mental completo

Después de conocer todas estas herramientas podemos visualizar systemd así:

```text
                         SYSTEMD
                            │
                            ▼
                    ┌──────────────┐
                    │     Units    │
                    └──────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      .service           .timer            .target
          │                 │                 │
          │                 │                 │
          ▼                 ▼                 ▼
       proceso          schedule          agrupación
          │                 │                 │
          └────────────┬────┘                 │
                       ▼                      │
                  ejecución                   │
                       │                      │
                       ▼                      │
                 journald                     │
                       │                      │
                       ▼                      │
                  journalctl                  │
```

Y `systemctl` es nuestra interfaz principal para administrar esas unidades:

```text
systemctl
   │
   ├── start
   ├── stop
   ├── restart
   ├── reload
   ├── enable
   ├── disable
   ├── status
   ├── cat
   ├── show
   └── list-units
```

---

# 58. Chuleta de comandos

## Servicios

```bash
systemctl status servicio
```

```bash
sudo systemctl start servicio
```

```bash
sudo systemctl stop servicio
```

```bash
sudo systemctl restart servicio
```

```bash
sudo systemctl reload servicio
```

```bash
sudo systemctl enable servicio
```

```bash
sudo systemctl disable servicio
```

```bash
sudo systemctl enable --now servicio
```

```bash
sudo systemctl disable --now servicio
```

---

## Estado

```bash
systemctl is-active servicio
```

```bash
systemctl is-enabled servicio
```

```bash
systemctl --failed
```

```bash
systemctl list-units --type=service
```

```bash
systemctl list-units --type=service --all
```

---

## Configuración

```bash
systemctl cat servicio
```

```bash
systemctl show servicio
```

```bash
sudo systemctl daemon-reload
```

---

## Logs

```bash
journalctl
```

```bash
journalctl -u servicio
```

```bash
journalctl -u servicio -f
```

```bash
journalctl -u servicio -n 50
```

```bash
journalctl -u servicio -p err
```

```bash
journalctl -b
```

```bash
journalctl -b -1
```

```bash
journalctl -k
```

```bash
journalctl --since today
```

---

## Timers

```bash
systemctl list-timers
```

```bash
systemctl list-timers --all
```

```bash
systemctl status backup.timer
```

```bash
systemd-analyze calendar "daily"
```

---

## Boot

```bash
systemd-analyze
```

```bash
systemd-analyze blame
```

```bash
systemd-analyze critical-chain
```

```bash
systemctl get-default
```

```bash
systemctl list-dependencies graphical.target
```

---

# 59. Flujo recomendado para trabajar con systemd

Cuando creemos un servicio nuevo, podemos seguir siempre este procedimiento:

```text
1. Crear .service
        ↓
2. Guardar en /etc/systemd/system/
        ↓
3. daemon-reload
        ↓
4. start
        ↓
5. status
        ↓
6. journalctl
        ↓
7. corregir errores
        ↓
8. enable
```

Por ejemplo:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Después:

```bash
sudo systemctl daemon-reload
```

Luego:

```bash
sudo systemctl start myapp.service
```

Comprobar:

```bash
systemctl status myapp.service
```

Logs:

```bash
journalctl -u myapp.service -n 100
```

Y finalmente:

```bash
sudo systemctl enable myapp.service
```

---

# 60. Conclusión

Systemd puede parecer complicado al principio porque no es simplemente un comando para iniciar servicios. Es un sistema completo de administración de unidades, dependencias, procesos, arranque, logs y automatización.

Sus componentes principales pueden resumirse así:

```text
systemd
│
├── systemctl
│     └── administrar unidades
│
├── .service
│     └── ejecutar y supervisar procesos
│
├── .timer
│     └── automatizar ejecuciones
│
├── .target
│     └── agrupar unidades
│
├── journald
│     └── recopilar logs
│
├── journalctl
│     └── consultar logs
│
└── systemd-analyze
      └── analizar el sistema y el boot
```

Una vez entendido este modelo, muchas tareas que parecen independientes comienzan a tener sentido.

Un servidor web puede ser:

```text
nginx.service
```

Una aplicación Python:

```text
myapp.service
```

Un backup automático:

```text
backup.timer
        ↓
backup.service
```

Los logs de todo ello:

```text
journalctl
```

Y la administración:

```text
systemctl
```

La idea fundamental es que **systemd convierte procesos y tareas del sistema en unidades administrables**, establece relaciones entre ellas y proporciona una infraestructura común para iniciarlas, detenerlas, supervisarlas, automatizarlas y diagnosticar sus problemas.

Por eso aprender systemd no consiste solamente en memorizar:

```bash
systemctl start
systemctl stop
systemctl restart
```

sino en aprender a pensar en términos de:

```text
UNITS
   ↓
DEPENDENCIES
   ↓
JOBS
   ↓
SERVICES
   ↓
LOGS
   ↓
AUTOMATION
```

Ese modelo mental permite pasar de simplemente "usar Linux" a **administrar y automatizar un sistema Linux de forma profesional**.
