![[hackthebox.png]]

La máquina Greenhorn de Hack The Box es una máquina Linux clasificada como "fácil". En el proceso de enumeración, se descubren los puertos HTTP (80), SSH (22), y otro servicio en el puerto 3000. Al acceder al sitio web, te encuentras con una página de inicio de sesión que utiliza la versión 4.7.18 de Pluck, un CMS vulnerable.

El exploit principal utilizado para obtener acceso inicial es a través de la vulnerabilidad CVE-2023-50564 en Pluck 4.7.18. Esta vulnerabilidad permite la ejecución de código remoto. Para explotar esta falla, se usa una prueba de concepto disponible en GitHub


Yo he creado una guía paso a paso sobre cómo resolver esta máquina, desde que activamos la máquina, el proceso de enumeración de puertos y la resolución de la misma.

Ahora vamos a ver una tabla con la información general de la máquina, como los puertos, servicios, y lenguajes de programación.

![[hackthebox2.png]]

Tabla Informativa
Puerto	Servicio	Descripción	Lenguaje de Programación
22	SSH	Acceso remoto seguro	---
80	HTTP	Sitio web principal	PHP (Pluck CMS)
3000	Aplicación Web	Puerto de la aplicación personalizada	JavaScript (posiblemente Node.js)

# Tabla Informativa

| Puerto | Servicio       | Descripción                           | Lenguaje de Programación          |
| ------ | -------------- | ------------------------------------- | --------------------------------- |
| 22     | SSH            | Acceso remoto seguro                  | ---                               |
| 80     | HTTP           | Sitio web principal                   | PHP (Pluck CMS)                   |
| 3000   | Aplicación Web | Puerto de la aplicación personalizada | JavaScript (posiblemente Node.js) |

Este documento está hecho con fines educativos y en entornos controlados, y está dirigido a personas con conocimientos sólidos de hacking, redes y programación. Se recomienda no hacer esta máquina solo con lo que yo enseño, ya que si simplemente copias el proceso, tu aprendizaje sería nulo.

Este es el link para entrar al [Diagrama](https://excalidraw.com/#json=PeZmGfbIr1Wa4ZJXeLc8i,2GUEquoQGtjXxEPtxXVD_w)

Este es el link para entrar al [Documento](https://github.com/AudiForze/GreenHorn/tree/main)

![[hackthebox.excalidraw]]