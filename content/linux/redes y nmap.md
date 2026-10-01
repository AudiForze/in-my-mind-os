# Escaneo de redes en Linux con Nmap

El escaneo de redes es una de las técnicas fundamentales en **ciberseguridad y pentesting**. Permite identificar equipos activos, puertos abiertos, servicios, versiones de software y posibles puntos de entrada dentro de una red.

En Linux existen muchas herramientas para realizar reconocimiento de redes, pero una de las más utilizadas es **Nmap (Network Mapper)**.

> **Importante:** realiza escaneos únicamente sobre sistemas y redes que tengas autorización para analizar.

---

## ¿Qué es Nmap?

**Nmap** es una herramienta de código abierto utilizada para el descubrimiento de redes y auditorías de seguridad.

Con Nmap podemos obtener información como:

* Equipos activos.
* Puertos abiertos.
* Servicios disponibles.
* Versiones de servicios.
* Sistema operativo, mediante técnicas específicas.
* Información útil para identificar posibles vulnerabilidades.

Una instalación típica en Arch Linux puede realizarse con:

```bash
sudo pacman -S nmap
```

Comprobamos la instalación:

```bash
nmap --version
```

Resultado de ejemplo:

```text
Nmap version 7.95
Platform: x86_64-pc-linux-gnu
```

---

# Descubrimiento de equipos

Antes de analizar servicios, podemos intentar descubrir qué equipos están activos.

Por ejemplo:

```bash
nmap -sn 192.168.1.0/24
```

`-sn` realiza un **host discovery** sin realizar un escaneo de puertos completo.

Podríamos obtener:

```text
Nmap scan report for 192.168.1.1
Host is up.

Nmap scan report for 192.168.1.10
Host is up.

Nmap scan report for 192.168.1.25
Host is up.
```

Esto permite crear una primera representación de los dispositivos presentes en una red.

---

# Escaneo de puertos

Los puertos permiten identificar qué servicios están disponibles en un equipo.

Un escaneo básico:

```bash
nmap 192.168.1.10
```

Ejemplo:

```text
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
```

En este caso encontramos:

* `22` → SSH
* `80` → HTTP
* `443` → HTTPS

---

# Escaneo de todos los puertos

Por defecto, Nmap no necesariamente analiza los 65,535 puertos TCP.

Para analizar todos:

```bash
nmap -p- 192.168.1.10
```

`-p-` significa:

```text
1-65535
```

Esto puede ser útil durante una auditoría porque un servicio interesante podría estar ejecutándose en un puerto que normalmente no se analiza.

---

# Detección de servicios y versiones

Encontrar un puerto abierto no siempre es suficiente. También queremos saber qué software está ejecutándose.

Para ello podemos utilizar:

```bash
nmap -sV 192.168.1.10
```

Ejemplo:

```text
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.9
80/tcp open  http    Apache httpd 2.4.62
```

`-sV` intenta determinar la **versión del servicio**.

Esta información es importante durante una auditoría porque permite posteriormente investigar si la versión identificada presenta vulnerabilidades conocidas.

---

# Scripts de Nmap

Nmap incluye el **Nmap Scripting Engine (NSE)**, que permite realizar comprobaciones adicionales mediante scripts.

La opción:

```bash
-sC
```

ejecuta los scripts considerados **default** por Nmap.

Por ejemplo:

```bash
nmap -sC 192.168.1.10
```

Los scripts pueden obtener información adicional sobre servicios, configuraciones y otros aspectos del objetivo.

---

# Un escaneo completo

Un comando bastante utilizado durante una enumeración de un objetivo autorizado es:

```bash
nmap -p- -sS -sC -sV --open --min-rate 5000 -vvv -n -Pn 192.168.1.10 -oN resultado.txt
```

Veamos cada parámetro:

| Parámetro           | Función                                                         |
| ------------------- | --------------------------------------------------------------- |
| `-p-`               | Escanea los puertos TCP del 1 al 65535                          |
| `-sS`               | SYN scan                                                        |
| `-sC`               | Ejecuta los scripts NSE por defecto                             |
| `-sV`               | Detecta versiones de servicios                                  |
| `--open`            | Muestra principalmente puertos abiertos                         |
| `--min-rate 5000`   | Intenta enviar al menos 5000 paquetes/segundo                   |
| `-vvv`              | Aumenta considerablemente el nivel de detalle                   |
| `-n`                | No realiza resolución DNS                                       |
| `-Pn`               | Trata el objetivo como activo y omite el descubrimiento inicial |
| `-oN resultado.txt` | Guarda el resultado en formato normal                           |

---

## ¿Qué significa `-sS`?

`-sS` realiza un **TCP SYN scan**.

Nmap utiliza paquetes SYN para determinar el estado de los puertos sin completar normalmente una conexión TCP completa.

De forma simplificada:

```text
Nmap → SYN → Servidor
Nmap ← SYN/ACK ← Servidor
```

Un `SYN/ACK` normalmente indica que el puerto está abierto.

---

# ¿Por qué utilizar `-Pn`?

Normalmente Nmap intenta determinar primero si el equipo está activo.

Sin embargo, algunos dispositivos o firewalls bloquean los paquetes utilizados para el descubrimiento.

Con:

```bash
-Pn
```

Nmap asume que el objetivo está activo y continúa con el escaneo.

Esto puede ser útil en determinados entornos, aunque puede hacer que el escaneo sea innecesariamente largo si realmente no existe un host en esa dirección.

---

# ¿Qué hace `--min-rate 5000`?

Esta opción establece una tasa mínima aproximada de envío de paquetes:

```bash
--min-rate 5000
```

El objetivo es acelerar el escaneo.

Sin embargo, **más rápido no siempre significa mejor**. Una tasa elevada puede:

* Generar mucho tráfico.
* Sobrecargar dispositivos o redes lentas.
* Activar sistemas IDS/IPS.
* Provocar resultados menos fiables en determinadas condiciones.

Por eso debe utilizarse de acuerdo con las características de la red y las reglas de la auditoría.

---

# Guardar los resultados

Una auditoría puede generar bastante información, por lo que es recomendable guardar los resultados.

Con:

```bash
-oN resultado.txt
```

Nmap guarda el resultado en un archivo de texto.

También podemos utilizar:

```bash
-oA auditoria
```

para generar diferentes formatos de salida:

```text
auditoria.nmap
auditoria.gnmap
auditoria.xml
```

Esto facilita posteriormente el análisis de los resultados.

---

# Nmap en ciberseguridad

En un proceso de auditoría, Nmap puede formar parte de una metodología como:

```text
Reconocimiento
      ↓
Descubrimiento de hosts
      ↓
Escaneo de puertos
      ↓
Identificación de servicios
      ↓
Identificación de versiones
      ↓
Análisis de vulnerabilidades
      ↓
Documentación
```

Por ejemplo, si encontramos:

```text
22/tcp   open   ssh   OpenSSH 8.x
80/tcp   open   http  Apache 2.4.x
3306/tcp open   mysql MySQL 5.x
```

Nmap nos proporciona información inicial que posteriormente puede utilizarse para investigar la configuración y las vulnerabilidades asociadas a esos servicios.

**Nmap no sustituye un análisis completo de vulnerabilidades.** Es principalmente una herramienta de reconocimiento y enumeración, aunque sus scripts NSE permiten realizar determinadas comprobaciones de seguridad.

---

# Escaneo responsable

El reconocimiento de redes es una habilidad fundamental en ciberseguridad, pero debe realizarse dentro de un entorno autorizado.

Algunos entornos adecuados para practicar son:

* Laboratorios propios.
* Máquinas virtuales.
* Redes de prueba.
* CTFs.
* Plataformas educativas.
* Sistemas para los que tengamos autorización explícita.

Una buena práctica es comenzar con un escaneo sencillo:

```bash
nmap 192.168.1.10
```

y progresivamente aumentar la profundidad:

```bash
nmap -p- 192.168.1.10
```

```bash
nmap -p- -sS -sV 192.168.1.10
```

hasta llegar a una enumeración más completa:

```bash
nmap -p- -sS -sC -sV --open --min-rate 5000 -vvv -n -Pn 192.168.1.10 -oN resultado.txt
```

De esta manera podemos entender qué información aporta cada técnica en lugar de ejecutar comandos complejos sin comprender su funcionamiento.

---

# Conclusión

Nmap es una de las herramientas fundamentales para el **reconocimiento de redes en Linux**. Permite pasar de una pregunta básica:

> ¿Qué equipos existen?

a preguntas mucho más específicas:

> ¿Qué puertos están abiertos?

> ¿Qué servicios están ejecutándose?

> ¿Qué versiones utilizan?

> ¿Qué información adicional podemos obtener?

En ciberseguridad, esta información constituye una de las primeras etapas de una auditoría: **conocer la superficie de ataque antes de analizarla**.
