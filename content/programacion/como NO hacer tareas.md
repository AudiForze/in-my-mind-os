> Hace un tiempo programé un *skill* que tengo conectado a mi arnés de inteligencia artificial (Hermes), el cual funciona bajo todo un sistema que desarrollé, lo que hoy en día es **M.I.A.** En este caso, esta *skill* permite cargar las tareas de Canvas para poder conectarlas al agente y dotar a una IA de la habilidad de desarrollar mis tareas de manera autónoma.

---

# README.md — Análisis de la Herramienta `canvas.py` (M.I.A.)

## 📋 Descripción General
`canvas.py` es el módulo central de integración y automatización dentro del ecosistema de **M.I.A. (Asistente Tecnológico Personal)**. Actúa como un puente entre la plataforma educativa institucional **Canvas** y motores de IA locales o agentes externos (como **Hermes** y **Gemini**), permitiendo la monitorización, extracción y gestión automatizada de las asignaciones académicas pendientes[cite: 1].

---

## 🏗️ Arquitectura y Componentes Principales

### 1. Sistema de Autenticación y Conexión con Canvas
* **API REST Integration:** Utiliza la API oficial de Canvas mediante peticiones HTTP seguras (`requests`) validadas por tokens de autorización de tipo Bearer[cite: 1].
* **Filtros Inteligentes:** 
  * Consulta de cursos activos omitiendo asignaturas inactivo o finalizadas (`enrollment_state: active`)[cite: 1].
  * Validación de fechas límite (`due_at`) en formato UTC para descartar tareas ya vencidas[cite: 1].
  * Verificación del estado de entrega (`workflow_state` y `submitted_at`) para filtrar exclusiones automáticas de tareas ya entregadas o calificadas[cite: 1].

### 2. Procesamiento de Texto y Limpieza de Contenido (`HTML Strip`)
* Las descripciones de las tareas extraídas desde Canvas suelen contener etiquetas HTML y entidades especiales. El script implementa expresiones regulares avanzadas (`re`) para:
  * Eliminar etiquetas HTML (`<[^>]+>`)[cite: 1].
  * Sustituir entidades como espacios en blanco no rompibles (`&nbsp;`) y caracteres especiales por texto plano legible[cite: 1].
  * Normalizar espacios múltiples para optimizar el contexto que posteriormente consumirá la IA[cite: 1].

### 3. Automatización de Escrititorio y Automatización de Prompts (Gemini Integration)
Una de las características más potentes del script es su capacidad de interactuar directamente con el entorno gráfico de Linux (enfocado en entornos como **Hyprland** / Wayland):
* **Lanzador de Navegadores:** Abre de manera automatizada navegadores basados en Chromium enfocados en la interfaz web de Google Gemini[cite: 1].
* **Inyección de Portapapeles (`wl-copy`) y Simulación de Teclado (`wtype`):** 
  * Toma la descripción limpia de la tarea de Canvas[cite: 1].
  * Construye un prompt estructurado exigiendo normas APA de 7ma edición, bibliografía formal a partir de 2023 y un tono humanizado[cite: 1].
  * Copia el texto al portapapeles de Wayland de forma nativa y simula atajos de teclado (`Ctrl + V` y `Enter`) para enviar el prompt al modelo de forma completamente desatendida[cite: 1].

### 4. Capa de Servidor Web y Comunicación en Tiempo Real (`Flask` + `SocketIO`)
* **Endpoints API REST:** Expone rutas JSON ligeras (`/api/canvas/pending`, `/api/gemini`) para ser consumidas por la interfaz gráfica de usuario de M.I.A[cite: 1].
* **Hilos de Ejecución (*Threading*):** Las peticiones pesadas y los procesos de automatización de navegador corren en segundo plano mediante hilos independientes para evitar bloqueos en el bucle principal del servidor web[cite: 1].

---

## 🚀 Funcionalidades Clave

| Funcionalidad | Descripción Técnica |
| :--- | :--- |
| **Sincronización Académica** | Extrae, ordena por días restantes y lista todas las tareas pendientes de Canvas[cite: 1]. |
| **Integración con Hermes** | Permite enviar comandos en lenguaje natural y gestionar sesiones de chat persistentes con el agente[cite: 1]. |
| **Automatización con Gemini** | Automatiza la apertura del navegador y la inyección de prompts académicos basados en las tareas[cite: 1]. |
| **Control de Entorno (Linux)** | Gestiona de manera nativa audio (`wpctl`), redes (`nmcli`), lanzador de aplicaciones `.desktop` y control de ventanas (`hyprctl`)[cite: 1]. |

---

## ⚙️ Configuración y Requisitos

1. **Dependencias de Python:** `flask`, `flask_socketio`, `psutil`, `requests`.
2. **Utilidades del Sistema (Linux/Wayland):** `wl-copy`, `wtype`, `nmcli`, `wpctl`, `hyprctl`.
3. **Credenciales:** Configurar la variable `CANVAS_URL` con el dominio de la institución y el `CANVAS_TOKEN` generado desde el perfil de usuario de Canvas[cite: 1].