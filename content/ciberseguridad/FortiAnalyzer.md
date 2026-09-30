Fortinet es una empresa de seguridad cibernética que proporciona soluciones de firewall, protección contra amenazas, y otros servicios relacionados con la seguridad en redes. Su producto más conocido es **FortiGate**, que es un firewall de próxima generación.

### ¿Que es **FortiAnalyzer?**

**FortiAnalyzer** es una plataforma de análisis y gestión de registros (logs) que se utiliza en conjunto con los dispositivos de Fortinet, como los firewalls `FortiGate`. Este sistema recopila, analiza y presenta los registros generados por dispositivos Fortinet para ayudar a las organizaciones a monitorear y responder a incidentes de seguridad.

`Docs` https://docs.fortinet.com/product/fortianalyzer/7.6

### ¿Que es **FortiGate?**

Los *Firewall Fortinet* (también conocidos como *firewalls* de próxima generación *NGFW* o simplemente *FortiGate)* son dispositivos de seguridad que permiten la creación de redes seguras y proporcionan una protección amplia, integrada y `automatizada` contra amenazas emergentes y sofisticadas.

- **Control de aplicaciones:** Permite crear políticas rápidamente para permitir, denegar o restringir el acceso a aplicaciones o categorías completas de aplicaciones.
- **Prevención de intrusiones:** Protege contra intrusiones en la red mediante la `detección` y el bloqueo de amenazas antes de que lleguen a los dispositivos de red.
- **Antivirus:** Efectivo contra virus, software espía y otras amenazas a nivel de contenido.
- **Filtrado de URL:** `Bloquea` el acceso a sitios web maliciosos, pirateados o inapropiados.
- **Sandboxing:** Es una solución avanzada de detección de amenazas para protegernos identificando *malware* previamente desconocido.
- **Inspección SSL:** Obtén visibilidad del `tráfico cifrado` y previene el *malware.*

### Dentro de FortiAnalyzer

![[fortianalyzer1.png]]

Dentro del fortianalyzer vamos a encontrar 5 opciones, dentro de las cuales vamos a ver (Fortiview, vista de log, Vista de Fabric, FortiSoC, Reportes)

- **FortiView**: Monitoreo en tiempo real de tráfico y eventos de seguridad.
- **Vista de Logs**: Análisis detallado de los logs de los dispositivos FortiGate.
- **Vista de Fabric**: Monitoreo de todos los dispositivos dentro del `Fortinet Security Fabric.`
- **FortiSoC**: Gestión de alertas y operaciones de seguridad tipo SOC.
- **Reportes**: Generación de informes personalizados sobre la actividad y eventos de seguridad.

## FortiView

Claro, te explico de forma detallada para qué sirve cada una de las cinco opciones principales dentro de **FortiAnalyzer**:

---

---

### 1. **FortiView**

![[fortianalyzer2.png]]

FortiView es una interfaz gráfica que proporciona una visión en tiempo real del tráfico de red y eventos de seguridad. Es una de las `herramientas` clave para monitorear la actividad de la red y detectar amenazas o comportamientos anómalos. FortiView `organiza y visualiza` la información de manera intuitiva, y tiene varias subopciones para ver el tráfico y eventos de seguridad bajo diferentes perspectivas:

- **Tráfico de red**: Analiza el tráfico que pasa a través de los dispositivos FortiGate, incluyendo detalles como el tráfico de aplicaciones, el consumo de ancho de banda y la distribución de IPs.

![[fortianalyzer3.png]]

- **Eventos de seguridad**: Muestra eventos en tiempo real relacionados con amenazas, como ataques, intrusiones o `intentos de acceso` no autorizado.

![[fortianalyzer4.png]]

- **Visibilidad de aplicaciones**: Permite identificar qué aplicaciones están siendo utilizadas dentro de la red y cómo impactan el `rendimiento` y la seguridad.

![[fortianalyzer5.png]]

Es ideal para administradores que necesitan una visión rápida y completa del estado de `seguridad` y el tráfico de la red.

---

---

### 2. Vista De Log

![[fortianalyzer6.png]]

La **Vista de Logs** es donde se visualizan todos los `registros` o logs generados por los dispositivos FortiGate y otros dispositivos de seguridad de Fortinet. Los logs pueden incluir información detallada sobre eventos de seguridad, `tráfico de red`, y la actividad general del sistema. Algunas de sus características principales son:

- **Filtrado y búsqueda avanzada**: Permite buscar logs específicos utilizando filtros (por ejemplo, por tipo de evento, dispositivo, IP de origen, etc.).
- **Análisis y correlación**: Puedes analizar el comportamiento y la causa raíz de eventos de seguridad o problemas de red.
- **Detección de incidentes**: Te ayuda a identificar eventos sospechosos o comportamientos inusuales, como intentos de acceso no autorizado o tráfico malicioso.

Es la herramienta principal para hacer un análisis detallado de los incidentes de `seguridad` pasados y tener una `auditoría` precisa.

![[fortianalyzer7.png]]

---

---

### 3. Vista de Fabric (Fabric View)

![[fortianalyzer8.png]]

La **Vista de Fabric** proporciona una vista integral de todos los dispositivos y servicios que forman parte de la **Fortinet Security Fabric**. El Security Fabric es una solución de `seguridad integrada` que conecta dispositivos de Fortinet para trabajar de manera conjunta y reforzar la protección en toda la infraestructura. En la `Vista de Fabric` podrás:

- **Ver dispositivos conectados**: Visualizar todos los dispositivos dentro de la red que están configurados en el Security Fabric (FortiGate, FortiAP, FortiSwitch, etc.).

![[fortianalyzer9.png]]

- **Monitorear el estado**: Observar el estado de salud de cada dispositivo y su conectividad.
- **Gestión de amenazas interconectadas**: Facilita la gestión de amenazas que afectan a múltiples dispositivos de `Fortinet` dentro de la red, permitiendo una respuesta coordinada y más efectiva ante incidentes de seguridad.

Es muy útil para mantener una visibilidad completa de toda la infraestructura de `seguridad` integrada.

---

---

### 4. FortiSoC (Security Operations Center)

![[fortianalyzer10.png]]

FortiSoC es una plataforma dentro de FortiAnalyzer que permite gestionar y monitorear las operaciones de seguridad en tiempo real, como si fuera un `Centro de Operaciones de Seguridad` (SOC). Ofrece herramientas para gestionar alertas, incidentes y eventos de seguridad:

- **Gestión de alertas y tickets**: Te permite recibir alertas y gestionarlas como tickets dentro del flujo de trabajo de un SOC.
- **Correlación de eventos**: Detecta patrones y correlaciona eventos de seguridad para identificar amenazas más complejas.
- **Integración con otras soluciones de seguridad**: FortiSoC se integra con otros productos de Fortinet y herramientas de terceros, facilitando la detección y respuesta ante incidentes.

Es fundamental para los equipos de seguridad que operan en `tiempo real`, monitoreando y respondiendo a incidentes de manera rápida.

---

---

### 5. Reportes (Reports)

La sección de **Reportes** permite generar informes detallados sobre la actividad de la red, los eventos de seguridad y el estado de los dispositivos. Los reportes son esenciales tanto para la gestión interna como para el cumplimiento de normativas o auditorías. Algunas funciones incluyen:

![[fortianalyzer11.png]]

- **Generación de informes personalizados**: Puedes crear informes adaptados a tus necesidades, como resúmenes de tráfico, eventos de seguridad, o actividad de los dispositivos.
- **Informes predefinidos**: FortiAnalyzer incluye plantillas de informes prediseñados que cubren aspectos como la actividad de red, amenazas detectadas, etc.
- **Programación de reportes**: Puedes configurar la generación automática de informes periódicos (por ejemplo, semanal o mensual) y su envío a los destinatarios relevantes.