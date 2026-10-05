# LDAP en Active Directory

**LDAP (Lightweight Directory Access Protocol)** es uno de los protocolos fundamentales utilizados por **Active Directory (AD)** para almacenar y consultar información sobre usuarios, grupos, computadoras, unidades organizativas y otros objetos del dominio.

Durante una auditoría de seguridad, LDAP puede proporcionar una gran cantidad de información sobre la estructura de un dominio. Una configuración incorrecta puede permitir que usuarios no privilegiados o incluso sesiones anónimas obtengan información que debería estar restringida.

En este artículo veremos cómo funciona LDAP dentro de Active Directory y cómo podemos **enumerarlo y analizarlo en un laboratorio controlado**.

> **Aviso:** Los ejemplos deben ejecutarse únicamente contra laboratorios, máquinas propias o sistemas para los que tengas autorización.

---

# 1. ¿Qué es LDAP?

LDAP es un protocolo diseñado para acceder a servicios de directorio.

En Active Directory, LDAP permite consultar objetos almacenados dentro del directorio.

Por ejemplo:

```text
Active Directory
│
├── Users
│   ├── Administrator
│   ├── Alice
│   └── Bob
│
├── Groups
│   ├── Domain Admins
│   └── Domain Users
│
├── Computers
│   ├── DC01
│   └── PC01
│
└── Organizational Units
    ├── IT
    ├── HR
    └── Management
```

Estos objetos contienen atributos que LDAP puede consultar.

Por ejemplo, un usuario puede tener:

```text
cn
sAMAccountName
userPrincipalName
mail
memberOf
objectGUID
distinguishedName
```

---

# 2. LDAP y Active Directory

En un entorno Windows, normalmente tenemos:

```text
             Active Directory
                    │
                    ▼
            Domain Controller
                    │
          ┌─────────┴─────────┐
          │                   │
        LDAP                Kerberos
          │                   │
          ▼                   ▼
    Directorio AD        Autenticación
```

LDAP se utiliza principalmente para **consultar y modificar objetos del directorio**, mientras que Kerberos se utiliza principalmente para la autenticación dentro del dominio.

No debemos confundir ambos protocolos.

---

# 3. Puertos utilizados por LDAP

Los puertos más importantes son:

| Puerto     | Servicio                     |
| ---------- | ---------------------------- |
| `389/TCP`  | LDAP                         |
| `636/TCP`  | LDAPS                        |
| `3268/TCP` | Global Catalog               |
| `3269/TCP` | Global Catalog sobre SSL/TLS |

El puerto estándar de LDAP es:

```text
389
```

Mientras que LDAP protegido mediante TLS normalmente utiliza:

```text
636
```

---

# 4. Identificar LDAP

En un laboratorio podemos comenzar utilizando Nmap:

```bash
nmap -p 389,636,3268,3269 10.10.10.10
```

Un resultado podría ser:

```text
PORT     STATE SERVICE
389/tcp  open  ldap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
```

Esto indica que el servidor está exponiendo servicios LDAP.

También podemos obtener información adicional:

```bash
nmap -sV -p 389,636 10.10.10.10
```

---

# 5. ¿Qué es un Distinguished Name?

Uno de los conceptos más importantes de LDAP es el **DN (Distinguished Name)**.

El DN identifica de manera única un objeto dentro del directorio.

Por ejemplo:

```text
CN=Alice,OU=IT,DC=corp,DC=local
```

Podemos interpretarlo como:

```text
CN=Alice
    │
    └── Nombre del objeto

OU=IT
    │
    └── Unidad organizativa

DC=corp
DC=local
    │
    └── Dominio
```

Otro ejemplo:

```text
CN=Administrator,CN=Users,DC=corp,DC=local
```

---

# 6. Base DN

El **Base DN** indica desde qué punto del árbol LDAP comenzaremos una búsqueda.

Para un dominio:

```text
corp.local
```

normalmente tendríamos:

```text
DC=corp,DC=local
```

Por ejemplo:

```text
DC=corp,DC=local
```

Una consulta LDAP puede utilizar esta base para buscar todos los objetos debajo de ella.

---

# 7. Instalar herramientas LDAP

En Debian/Ubuntu:

```bash
sudo apt update
sudo apt install ldap-utils
```

En Arch Linux:

```bash
sudo pacman -S openldap
```

Podemos comprobar que `ldapsearch` está disponible:

```bash
ldapsearch --help
```

La herramienta principal que utilizaremos será:

```text
ldapsearch
```

---

# 8. Primera consulta LDAP

Podemos realizar una consulta básica:

```bash
ldapsearch -x -H ldap://10.10.10.10 -b "DC=corp,DC=local"
```

Los parámetros significan:

```text
-x
    Utilizar autenticación simple.

-H
    Especificar el servidor LDAP.

-b
    Especificar el Base DN.
```

El resultado puede contener una gran cantidad de información.

---

# 9. Buscar usuarios

Podemos utilizar un filtro LDAP para buscar objetos que sean usuarios:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)"
```

Una consulta más específica:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(sAMAccountName=alice)"
```

Podemos solicitar únicamente determinados atributos:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(sAMAccountName=alice)" \
sAMAccountName mail memberOf
```

Esto hace que la salida sea mucho más manejable.

---

# 10. Buscar grupos

Podemos buscar objetos de tipo grupo:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=group)"
```

También podemos buscar un grupo específico:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(cn=Domain Admins)"
```

---

# 11. Buscar computadoras

Active Directory también almacena información sobre los equipos unidos al dominio.

Podemos buscarlos utilizando:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=computer)"
```

Podríamos obtener:

```text
dn: CN=DC01,OU=Domain Controllers,DC=corp,DC=local
sAMAccountName: DC01$
objectClass: computer

dn: CN=PC01,OU=Computers,DC=corp,DC=local
sAMAccountName: PC01$
objectClass: computer
```

Esto permite identificar la infraestructura del dominio.

---

# 12. Enumeración de usuarios

Una de las tareas más interesantes durante un pentest es determinar qué información sobre usuarios está expuesta.

Podemos solicitar:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)" \
sAMAccountName
```

Una salida simplificada podría ser:

```text
sAMAccountName: Administrator
sAMAccountName: alice
sAMAccountName: bob
sAMAccountName: svc_backup
```

Esta información puede ser relevante durante una auditoría porque permite conocer las cuentas existentes en el dominio.

---

# 13. Buscar cuentas de servicio

Las cuentas de servicio son especialmente interesantes en Active Directory porque algunas pueden tener configuraciones específicas relacionadas con servicios y Kerberos.

Podemos buscar nombres que contengan patrones comunes:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(|(sAMAccountName=*svc*)(cn=*service*))" \
sAMAccountName
```

Ejemplo:

```text
sAMAccountName: svc_backup
sAMAccountName: svc_sql
sAMAccountName: svc_web
```

Esto **no significa que estas cuentas sean vulnerables**. Simplemente son cuentas que merecen ser revisadas durante una auditoría.

---

# 14. Consultar grupos de un usuario

Podemos consultar el atributo `memberOf`:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(sAMAccountName=alice)" \
memberOf
```

Podríamos encontrar:

```text
memberOf: CN=Domain Users,CN=Users,DC=corp,DC=local
memberOf: CN=IT,OU=Groups,DC=corp,DC=local
```

Esto nos permite conocer la pertenencia del usuario a grupos.

---

# 15. Buscar miembros de un grupo

También podemos consultar directamente el atributo `member`.

Por ejemplo:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(cn=Domain Admins)" \
member
```

La salida podría contener:

```text
member: CN=Administrator,CN=Users,DC=corp,DC=local
member: CN=Alice,OU=IT,DC=corp,DC=local
```

Esto permite estudiar la estructura de privilegios del dominio.

---

# 16. LDAP anónimo

Una de las primeras comprobaciones durante una auditoría consiste en determinar si el servidor permite consultas sin autenticación.

Podemos probar:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
-s base
```

Si el servidor permite consultas anónimas, puede devolver información sobre el directorio.

Por ejemplo:

```text
dn: DC=corp,DC=local
objectClass: top
objectClass: domain
dc: corp
```

En una configuración segura, el acceso anónimo debería estar restringido según las necesidades del entorno.

---

# 17. Autenticación LDAP

Si necesitamos autenticarnos, podemos proporcionar un DN:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-D "alice@corp.local" \
-W \
-b "DC=corp,DC=local"
```

`-W` hace que LDAP solicite la contraseña.

También podemos utilizar el DN completo:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-D "CN=Alice,OU=IT,DC=corp,DC=local" \
-W \
-b "DC=corp,DC=local"
```

---

# 18. LDAP sobre TLS

LDAP sin cifrado utiliza normalmente:

```text
ldap://
```

Mientras que LDAP protegido utiliza:

```text
ldaps://
```

Podemos probar una conexión LDAPS:

```bash
ldapsearch -x \
-H ldaps://10.10.10.10 \
-b "DC=corp,DC=local"
```

También existe StartTLS:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-Z \
-b "DC=corp,DC=local"
```

En entornos reales es importante verificar correctamente los certificados y evitar transmitir credenciales mediante canales sin protección.

---

# 19. Buscar configuraciones potencialmente interesantes

Durante una auditoría podemos buscar determinados atributos.

Por ejemplo:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)" \
sAMAccountName userAccountControl
```

`userAccountControl` contiene diferentes flags relacionados con la configuración de la cuenta.

También podemos consultar:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)" \
pwdLastSet accountExpires
```

Estos datos pueden ayudar a identificar cuentas antiguas, configuraciones particulares o cuentas que requieren revisión.

---

# 20. Enumeración con NetExec

Además de `ldapsearch`, herramientas especializadas en Active Directory pueden facilitar la enumeración.

Por ejemplo:

```bash
nxc ldap 10.10.10.10
```

Con credenciales:

```bash
nxc ldap 10.10.10.10 \
-u alice \
-p 'Password'
```

Podemos consultar información del dominio:

```bash
nxc ldap 10.10.10.10 \
-u alice \
-p 'Password' \
--users
```

La sintaxis disponible puede variar según la versión de NetExec, por lo que conviene consultar:

```bash
nxc ldap --help
```

---

# 21. LDAP y Kerberos

LDAP y Kerberos trabajan conjuntamente dentro de Active Directory.

Una situación simplificada sería:

```text
             Active Directory
                    │
          ┌─────────┴─────────┐
          │                   │
        LDAP                Kerberos
          │                   │
          ▼                   ▼
    Consultar AD        Autenticación
          │                   │
          └─────────┬─────────┘
                    ▼
             Domain Controller
```

LDAP puede permitirnos descubrir:

```text
Usuarios
Grupos
Computadoras
SPNs
OU
Información del dominio
```

Mientras que Kerberos se vuelve especialmente importante para comprender técnicas como:

```text
Kerberoasting
AS-REP Roasting
Pass-the-Ticket
Golden Ticket
Silver Ticket
```

Estos temas pueden tratarse en artículos separados.

---

# 22. LDAP en una auditoría de Active Directory

Un flujo básico podría ser:

```text
          Descubrimiento
                │
                ▼
        Puerto 389 / 636
                │
                ▼
       ¿LDAP accesible?
                │
                ▼
      ¿Permite anonymous?
             /     \
           Sí       No
           │         │
           ▼         ▼
      Enumerar    Autenticarse
           │         │
           └────┬────┘
                ▼
          Enumerar AD
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
    Usuarios  Grupos  Equipos
                │
                ▼
        Analizar permisos
                │
                ▼
       Identificar riesgos
```

La finalidad no es simplemente obtener una lista de usuarios, sino comprender cómo está estructurado el dominio y detectar configuraciones que puedan representar un riesgo.

---

# 23. Ejemplo de laboratorio

Supongamos que tenemos un Domain Controller:

```text
IP:     10.10.10.10
Domain: corp.local
Base:   DC=corp,DC=local
```

Primero comprobamos LDAP:

```bash
nmap -p 389,636 10.10.10.10
```

Después probamos una consulta básica:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
-s base
```

Buscamos usuarios:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)" \
sAMAccountName
```

Buscamos grupos:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=group)" \
cn
```

Buscamos computadoras:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=computer)" \
dNSHostName
```

Finalmente podemos utilizar las credenciales de un usuario autorizado:

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-D "alice@corp.local" \
-W \
-b "DC=corp,DC=local" \
"(objectClass=user)" \
sAMAccountName
```

---

# 24. ¿Qué información podemos obtener?

Dependiendo de los permisos y configuración del servidor:

```text
Usuarios
├── Nombre
├── Username
├── Email
├── Grupos
├── Estado de cuenta
└── Fechas relacionadas con la cuenta

Grupos
├── Nombre
├── Miembros
└── Relaciones

Computadoras
├── Hostname
├── Sistema
├── Dominio
└── Organización

Dominio
├── Base DN
├── OUs
├── Domain Controllers
└── Estructura del directorio
```

Esta información puede ser utilizada para construir un mapa del entorno de Active Directory.

---

# 25. Errores comunes

### Confundir LDAP con Active Directory

LDAP es un protocolo.

Active Directory es un servicio de directorio de Microsoft que utiliza LDAP, entre otros protocolos.

---

### Confundir LDAP con Kerberos

LDAP:

```text
Consultas y operaciones sobre el directorio
```

Kerberos:

```text
Autenticación basada en tickets
```

Ambos son importantes en Active Directory, pero cumplen funciones diferentes.

---

### Asumir que LDAP anónimo significa compromiso

Encontrar LDAP anónimo no significa automáticamente que el dominio esté comprometido.

Lo importante es determinar:

```text
¿Qué información está expuesta?
¿Quién puede acceder?
¿Qué operaciones están permitidas?
¿Puede modificarse información?
```

---

# 26. Cheat Sheet

### Detectar LDAP

```bash
nmap -p 389,636 10.10.10.10
```

### Consulta básica

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local"
```

### Buscar usuarios

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=user)"
```

### Buscar grupos

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=group)"
```

### Buscar computadoras

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(objectClass=computer)"
```

### Buscar usuario específico

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-b "DC=corp,DC=local" \
"(sAMAccountName=alice)"
```

### Autenticarse

```bash
ldapsearch -x \
-H ldap://10.10.10.10 \
-D "alice@corp.local" \
-W \
-b "DC=corp,DC=local"
```

### LDAPS

```bash
ldapsearch -x \
-H ldaps://10.10.10.10 \
-b "DC=corp,DC=local"
```

### NetExec

```bash
nxc ldap 10.10.10.10
```

---

# 27. Conclusión

LDAP es una pieza fundamental de Active Directory y, desde el punto de vista de un pentester, constituye una de las principales fuentes de información durante la fase de **reconocimiento y enumeración**.

Comprender conceptos como:

```text
LDAP
DN
Base DN
OU
CN
Attributes
Filters
LDAP queries
Anonymous Bind
Authenticated Bind
LDAPS
```

permite interpretar correctamente la estructura de un dominio.

Una vez dominada la enumeración LDAP, el siguiente paso natural es estudiar cómo esta información se relaciona con otros componentes de Active Directory, especialmente **Kerberos, SMB, ACLs y BloodHound**.

El objetivo de un pentest no es simplemente ejecutar comandos, sino entender cómo cada pieza de información puede revelar relaciones y configuraciones que aumentan o reducen la seguridad del dominio.
