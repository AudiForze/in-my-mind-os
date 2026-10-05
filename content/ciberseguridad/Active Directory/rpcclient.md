
`rpcclient` es una herramienta incluida en el conjunto de Samba que permite interactuar desde Linux con servicios MS-RPC (Microsoft Remote Procedure Call) de sistemas Windows.

En un entorno de Active Directory, puede utilizarse durante la fase de reconocimiento para obtener información sobre:

* Usuarios.
* Grupos.
* Dominio.
* SID.
* Políticas de contraseñas.
* Información de cuentas.
* Relaciones y recursos del dominio.

Su utilidad depende de los permisos que tenga la cuenta utilizada y de la configuración del Domain Controller.

> **Nota:** Los ejemplos deben ejecutarse únicamente contra laboratorios o sistemas donde tengas autorización.

---

# 1. Instalación

En Debian/Ubuntu:

```bash
sudo apt install smbclient
```

En Arch Linux:

```bash
sudo pacman -S samba
```

Comprobar instalación:

```bash
rpcclient --help
```

---

# 2. Conexión a un Domain Controller

La sintaxis básica es:

```bash
rpcclient -U usuario 10.10.10.10
```

Por ejemplo:

```bash
rpcclient -U alice 10.10.10.10
```

Después se solicitará la contraseña:

```text
Enter WORKGROUP\alice's password:
```

Si la autenticación es correcta aparecerá:

```text
rpcclient $>
```

---

# 3. Probar una Null Session

En algunos entornos mal configurados puede ser posible conectarse sin credenciales.

```bash
rpcclient -U "" -N 10.10.10.10
```

Donde:

```text
-U "" → Usuario vacío
-N    → No solicitar contraseña
```

Si funciona, tendremos:

```text
rpcclient $>
```

Esto **no significa necesariamente que tengamos acceso administrativo**. Lo importante es comprobar qué información puede consultarse con esa sesión.

---

# 4. Obtener información del dominio

Uno de los primeros comandos que podemos utilizar es:

```text
rpcclient $> querydominfo
```

Puede proporcionar información relacionada con:

```text
Domain name
Domain SID
Número de usuarios
Número de grupos
Número de servidores
```

También podemos consultar información de contraseñas:

```text
rpcclient $> getdompwinfo
```

Dependiendo de la configuración, podemos obtener información sobre la política de contraseñas del dominio.

---

# 5. Enumerar usuarios

Uno de los comandos más importantes:

```text
rpcclient $> enumdomusers
```

Una salida podría ser:

```text
user:[Administrator] rid:[0x1f4]
user:[alice] rid:[0x451]
user:[bob] rid:[0x452]
user:[svc_backup] rid:[0x453]
```

Aquí obtenemos dos datos importantes:

```text
Usuario
RID
```

El **RID (Relative Identifier)** identifica al objeto dentro del dominio.

---

# 6. Enumerar grupos

Podemos listar los grupos del dominio:

```text
rpcclient $> enumdomgroups
```

Ejemplo:

```text
group:[Domain Admins] rid:[0x200]
group:[Domain Users] rid:[0x201]
group:[IT] rid:[0x452]
```

Esto permite comenzar a entender cómo están organizados los privilegios dentro del dominio.

---

# 7. Consultar información de un usuario

Una vez conocemos el RID de un usuario podemos utilizar:

```text
rpcclient $> queryuser 0x451
```

Dependiendo de los permisos, puede mostrar información como:

```text
User name
Full name
Description
Account flags
Password information
Last logon
Group information
```

También podemos consultar un usuario mediante su RID hexadecimal:

```text
rpcclient $> queryuser 0x1f4
```

El `0x1f4` corresponde normalmente al RID del usuario `Administrator` en muchos dominios Windows, aunque esto no debe asumirse para todos los entornos.

---

# 8. Enumerar miembros de un grupo

Primero podemos consultar el grupo:

```text
rpcclient $> querygroup 0x200
```

Después podemos utilizar los RIDs obtenidos para investigar los miembros.

Este proceso permite pasar de:

```text
Dominio
   │
   └── Grupo
        │
        └── Usuarios
```

y comenzar a identificar relaciones de privilegios.

---

# 9. Obtener el SID del dominio

Podemos utilizar:

```text
rpcclient $> lsaquery
```

Una respuesta puede contener:

```text
Domain Name: CORP
Domain Sid: S-1-5-21-123456789-987654321-111111111
```

El SID del dominio es especialmente importante porque los RIDs se agregan al SID para formar el identificador completo de los objetos.

Por ejemplo:

```text
Domain SID:
S-1-5-21-123456789-987654321-111111111

RID:
1105
```

El SID resultante sería:

```text
S-1-5-21-123456789-987654321-111111111-1105
```

---

# 10. Automatizar comandos

También podemos ejecutar comandos directamente desde Bash utilizando `-c`:

```bash
rpcclient -U "" -N 10.10.10.10 -c "enumdomusers"
```

Enumerar grupos:

```bash
rpcclient -U "" -N 10.10.10.10 -c "enumdomgroups"
```

Consultar información del dominio:

```bash
rpcclient -U "" -N 10.10.10.10 -c "querydominfo"
```

Esto resulta útil para crear scripts de enumeración.

---

# 11. Flujo básico de reconocimiento

Durante un laboratorio de Active Directory podemos seguir este flujo:

```text
             Domain Controller
                    │
                    ▼
             Puerto 445/139
                    │
                    ▼
               rpcclient
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Usuarios   Grupos    Dominio
          │         │         │
          └─────────┼─────────┘
                    ▼
             Analizar RIDs
                    │
                    ▼
          Identificar privilegios
```

Por ejemplo:

```bash
rpcclient -U "" -N 10.10.10.10
```

Dentro:

```text
rpcclient $> querydominfo
rpcclient $> enumdomusers
rpcclient $> enumdomgroups
rpcclient $> lsaquery
rpcclient $> getdompwinfo
```

Si la sesión anónima no funciona, podemos utilizar credenciales autorizadas:

```bash
rpcclient -U alice 10.10.10.10
```

---

# 12. Comandos principales

| Comando            | Función                             |
| ------------------ | ----------------------------------- |
| `querydominfo`     | Información del dominio             |
| `enumdomusers`     | Enumerar usuarios                   |
| `enumdomgroups`    | Enumerar grupos                     |
| `queryuser <RID>`  | Información de un usuario           |
| `querygroup <RID>` | Información de un grupo             |
| `lsaquery`         | Obtener información del dominio/SID |
| `getdompwinfo`     | Consultar política de contraseñas   |
| `srvinfo`          | Información del servidor            |
| `netshareenum`     | Enumerar recursos compartidos       |
| `help`             | Mostrar comandos disponibles        |
| `exit`             | Salir                               |

---

# 13. rpcclient dentro de un pentest

`rpcclient` es especialmente útil durante la **enumeración inicial** de Active Directory.

Un flujo sencillo sería:

```bash
# Identificar SMB/RPC
nmap -p 139,445 10.10.10.10

# Intentar Null Session
rpcclient -U "" -N 10.10.10.10

# Enumerar dominio
rpcclient $> querydominfo

# Enumerar usuarios
rpcclient $> enumdomusers

# Enumerar grupos
rpcclient $> enumdomgroups

# Obtener SID
rpcclient $> lsaquery
```

La información obtenida puede combinarse posteriormente con herramientas como:

```text
ldapsearch
NetExec
enum4linux-ng
BloodHound
Impacket
```

De esta manera, `rpcclient` se convierte en una pieza más dentro del proceso de reconocimiento de Active Directory.

---

# Cheat Sheet

```bash
# Conexión autenticada
rpcclient -U alice 10.10.10.10

# Null Session
rpcclient -U "" -N 10.10.10.10

# Enumerar usuarios
rpcclient -U "" -N 10.10.10.10 -c "enumdomusers"

# Enumerar grupos
rpcclient -U "" -N 10.10.10.10 -c "enumdomgroups"

# Información del dominio
rpcclient -U "" -N 10.10.10.10 -c "querydominfo"

# SID del dominio
rpcclient -U "" -N 10.10.10.10 -c "lsaquery"

# Política de contraseñas
rpcclient -U "" -N 10.10.10.10 -c "getdompwinfo"
```

## Conclusión

`rpcclient` es una herramienta sencilla pero muy útil para comprender cómo **MS-RPC expone información de Active Directory**. Aunque herramientas modernas como NetExec automatizan gran parte de estas tareas, conocer `rpcclient` permite entender qué información se está consultando realmente y cómo funcionan muchas de las técnicas de enumeración utilizadas durante un pentest de Windows.

El siguiente paso lógico después de `rpcclient` es estudiar **NetExec**, ya que permite combinar enumeración SMB/LDAP, autenticación y análisis de hosts de una forma mucho más automatizada.
