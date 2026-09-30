**¿De qué trata este proyecto y qué tiene de especial?**

Esto es physclab GrapesAI, un chatbot completamente local que puede ayudarte hacer trabajos completos y a estudiar

**Herramientas Principales**
- Gemini AI
Prompt procedure

- N8N
Do the workflow

- SupaBase
Databases and vectorization

GrapesAI es una app que prioriza tu privacidad y el acceso en todo momento (incluso sin conexión) a la IA. Somos una aplicación que te permite subir tus archivos para que una IA te ayude a hacer tus tareas. Te permitimos enseñar a tu propia IA para que te ayude a repasar para exámenes, hacer tareas, entender conceptos, desarrollar proyectos, crear recordatorios, apoyarte en tus actividades diarias y en todo lo que necesites.

## Nuestro recursos

**1. SupaBase**
Esta es una herramienta utilizada para administrar las bases de datos que almacenan los datos vectorizados.

**2. N8N**
Es la encargada de procesar los workflows que controlan el procesamiento de datos de GrapesAI. Desde esta plataforma cargamos los archivos e interactuamos con la IA

**3. VScode**
Puede cambiarse el editor de código por el de su preferencia o, en su defecto, utilizar Notepad. Este lo usaremos para programar la aplicación.

## Automatización Inteligente con n8n + Supabase + IA
En la era de la información, el acceso rápido a conocimiento distribuido en archivos PDF, documentos Word, TXT o imágenes se ha convertido en una necesidad. Pensando en ello nació M.I.A —un proyecto diseñado en n8n que transforma documentos en conocimiento consultable por IA, almacenado de manera segura y escalable en una base vectorial en Supabase.

Este sistema permite que cualquier archivo subido se procese automáticamente, se fragmente, se convierta en embeddings y posteriormente pueda ser consultado por un agente inteligente conectado a ChatGPT, Gemini u otro modelo local privado.

**¿Qué hace exactamente esta automatización?**

1. Recepción de archivos vía Webhook
El flujo cuenta con dos puntos de entrada:

* ✔ /upload-file

* ✔ /upload-file2

* ✔ /upload-file (ramificado para imágenes o documentos)

Estos endpoints permiten enviar directamente un archivo en Base64, el cual es decodificado gracias al nodo Decode Base64 File y Decode Base64 File1.

2. Almacenamiento automático en Google Drive
El archivo decodificado se guarda en Drive mediante los nodos:

* `Upload file / Upload file1 / Upload file2`

Dependiendo del tipo de archivo, se envía a carpetas distintas gracias a la condición IF para imágenes (.jpg, .jpeg, .png).

![[workflow1.png]]

3. Procesamiento y vectorización con Supabase
Una vez almacenado, el flujo:

* 📄 Descarga el archivo

* 🧩 Lo fragmenta con Recursive Character Text Splitter

* 💠 Lo convierte en vectores con Embeddings Google Gemini, Embeddings Google Gemini1, etc.

* 📥 Finalmente lo inserta en la tabla memory en Supabase (Supabase Vector Store & Supabase Vector Store1)

Esto convierte cualquier documento en una fuente de memoria consultable por IA en tiempo real.

**4. IA conversacional con memoria persistente**
El flujo también incorpora un chatbot inteligente con:

|Componente|Tecnología|
|---|---|
|LLM|**Google Gemini Chat Model** & **Gemini Pro**|
|Agente autónomo|**AI Agent** y **AI Agent1**|
|Memoria de contexto|**Postgres** (`Postgres Chat Memory`, etc.)|
|Recuperación por vector|`skils` y `skils1` conectando **Supabase** a LLM|

Esto permite conversaciones continuas, consultas por contenido de documentos y recuperación automática de datos vectorizados.

En términos simples: tu IA recuerda, aprende y consulta archivos sin necesidad humana.

## Modo de Operación

* Subes un archivo PDF/DOC/TXT/IMG

* El sistema lo almacena y lo vectoriza

* Puedes consultarlo por chat

* IA responde basándose en contenido real de tu archivo

Y lo mejor es su flexibilidad:


| Local y Privado<br>    <br>0 dependencia de servidores externos<br>Máxima privacidad<br>Ideal para empresas y datos sensibles | Via API Externa<br>Gemini / ChatGPT / OpenAI / Groq<br>Integración rápida y plug & play<br>Ideal para consumo público y aplicaciones SaaS |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |


![[workflow2.png]]

### Casos de uso reales

|Sector|Aplicación|
|---|---|
|**Legal**|Resumen automático de contratos, búsqueda por cláusulas|
|**Salud**|Consulta anónima de historiales clínicos sin exponer al paciente|
|**Empresas**|Base documental inteligente con manuales internos|
|**Educación**|Carga de libros → Chat interactivo basado en el contenido|
|**Software & Devs**|Knowledge-base para repositorios o documentación API|

Este proyecto representa un ecosistema autónomo de ingestión documental + vectorización + memoria + chat IA, totalmente ampliable y sin ataduras tecnológicas. Puedes usarlo como base privada, SaaS comercial, assistant corporativo o incluso como sistema personal de conocimiento aumentado.

### Tu información se convierte en conversación. Tu documentación se vuelve accesible. Tu IA ahora tiene memoria.

![[workflow3.png]]
