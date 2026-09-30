MultiManage es una aplicación de monitoreo y gestión centralizada que opera bajo un modelo de arquitectura cliente-servidor. Su propósito principal es conectar múltiples equipos (los clientes) a un único punto de control (el servidor) para obtener información en tiempo real, ejecutar comandos remotos, monitorear el tráfico de red y aplicar políticas de seguridad, como el bloqueo de URL.

Piensa en él como un centro de mando digital que te permite supervisar y administrar de forma simultánea todos los ordenadores de una red desde una sola interfaz con gráficas interactivas.

> [!danger] Nota
> Piensa en él como un centro de mando digital que te permite supervisar y administrar de forma simultánea todos los ordenadores de una red desde una sola interfaz con gráficas interactivas.

## 1. El Servidor (Backend FastAPI)
El servidor actúa como el cerebro de la aplicación. Desarrollado con FastAPI y Uvicorn, gestiona la base de datos SQLite (metrics.db) y sirve el dashboard.

Creación de Tablas (SQLite)
Al iniciar, el sistema asegura que existan las tablas para almacenar métricas de CPU, RAM y Disco.

```python
cursor.execute("""
    CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT,
        cpu REAL,
        ram REAL,
        disk REAL,
        timestamp TEXT
    )
""")
```
Recepción de Datos (Endpoint)
El servidor expone endpoints REST para recibir la información enviada por los agentes.

```python
@app.post("/upload_metrics")
async def upload_metrics(request: Request):
    # Lógica para recibir JSON y guardar en BD
    data = await request.json()
    # Insertar en metrics.db...
    return {"status": "success"}
```
## 2. El Cliente (Agente Python)
Un script ligero y persistente que se ejecuta en los equipos monitoreados. Utiliza psutil para métricas y subprocess para comandos.

Configuración y Conexión
Cada cliente tiene un ID único y se conecta dinámicamente a la IP del servidor.

```python
ip = get_local_ip() # Función auxiliar
CLIENT_ID = "PC_Windows_Physco"
SERVER_URL = f"http://{ip}:8000/upload_metrics"
```
### Envío de Métricas
Recolección de estado del hardware cada 10 segundos.

```python
def send_metrics():
    try:
        cpu = psutil.cpu_percent(interval=1)
        ram = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        
        data = {
            "client_id": CLIENT_ID, 
            "cpu": cpu, 
            "ram": ram, 
            "disk": disk, 
            "timestamp": str(datetime.now())
        }
        requests.post(SERVER_URL, json=data, timeout=5)
    except Exception as e:
        print(f"Error enviando métricas: {e}")
```
## Seguridad y Bloqueo de URLs
El cliente detecta tráfico con netstat y modifica el archivo hosts para bloquear sitios prohibidos.
![[urlbloqueadas.png]]

```python
def block_with_hosts(url):
    hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
    entry = f"127.0.0.1 {url}"
    
    # Lógica de escritura en archivo
    with open(hosts_path, 'a') as file:
        file.write(f"\n{entry}")
    
    flush_dns() # Limpia caché para efecto inmediato
```

## Funciones Principales
### Dashboard
Multimanage cuenta con un panel de control (dashboard) interactivo que te permite ver la cantidad total de equipos, así como cuáles están conectados y cuáles están desconectados. También puedes ver los recursos, como el consumo de CPU, RAM y disco, y la última actualización de datos de cada uno de los equipos.

![[dashboard.png]]

Esta información nos permite monitorizar el estado de nuestras máquinas en todo momento, así como poder detectar anomalías si alguna de ellas consume más recursos de lo normal.

### Trafico

Desde el mismo programa podemos monitorizar todo el tráfico en tiempo real, ver qué computadoras están enviando tráfico y hacia dónde lo están haciendo. Esto nos permite controlar nuestra conexión a través del sistema de bloqueo, donde podemos bloquear el acceso a un determinado dominio. Además, también podemos prohibir la conexión a una determinada IP que hayamos detectado como maliciosa o que esté afectando la productividad laboral.

![[trafico.png]]

### Terminales
Si queremos establecer conexión con cualquier equipo, solo basta con dirigirnos a /nav-bar/terminales, donde podemos ver todos los equipos con sus respectivas estadísticas en tiempo real. Podemos hacer conexión con un solo botón a cualquiera de ellas, de forma completamente silenciosa, y solicitar información así como ejecutar comandos.

![[terminales.png]]
> [!danger] Nota
>Si se desea ejecutar un comando de forma general, no es necesario acceder a cada una de forma individual, debido a que tenemos un botón que nos permite ejecutar un comando en todos los equipos que estén conectados a nuestros sistemas.

## El Sistema de Login de MultiManage: Seguridad por Diseño
El sistema de login se encuentra completamente en el código del Servidor `(server.py)` y utiliza una combinación de técnicas modernas para asegurar tanto las credenciales de los usuarios como la persistencia de las sesiones.

![[login.png]]

### 1. Cifrado de Contraseñas (Hashing con BCrypt)
El aspecto más importante de la seguridad es cómo se almacenan las contraseñas. MultiManage NO almacena las contraseñas de los usuarios como texto plano. En su lugar, utiliza un proceso llamado Hashing con el algoritmo BCrypt.

¿Qué es BCrypt? Es un algoritmo de hashing de contraseñas muy seguro, diseñado para ser intencionalmente lento. Esta lentitud es una defensa clave contra los ataques de "fuerza bruta" (intentos masivos de adivinar contraseñas), ya que hace que cada intento de descifrado tome mucho más tiempo.

**Implementación en Python (passlib):**
```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```
Al registrarse o inicializar el usuario admin, la contraseña se convierte en una cadena de texto larga y no reversible usando la función `pwd_context.hash()` antes de almacenarse en la base de datos.

### 2. Flujo de Autenticación (OAuth2 y Tokens)
El sistema sigue el estándar de autenticación OAuth2 Password Bearer para gestionar el inicio de sesión.

**A. Solicitud de Acceso (Endpoint /token)**
El usuario envía su nombre de usuario y contraseña al endpoint /token. La función authenticate_user verifica si el usuario existe y si la contraseña es correcta mediante el proceso de hashing (BCrypt). Si la autenticación es exitosa, el servidor procede a crear un Token de Acceso.

**B. Creación del Token (JWT)**
El servidor utiliza JSON Web Tokens (JWT) para crear un token único que representa la sesión activa del usuario.

Algoritmo de Firma El token se firma digitalmente usando el algoritmo HS256 **(HMAC-SHA256)** y una **SECRET_KEY**. Esto garantiza que solo el servidor pueda generar tokens válidos y que si un atacante intenta modificar el token, la firma fallará.
Contenido (Payload): El token incluye información esencial, como el nombre de usuario (sub) y la fecha de caducidad (exp).
Caducidad: El token tiene una vida útil limitada, definida por `ACCESS_TOKEN_EXPIRE_MINUTES`, que se establece en 60 minutos. Esto minimiza el riesgo de que un token robado pueda usarse indefinidamente.

![[ijwt.png]]

### 3. Uso del Token y Control de Acceso
Una vez que el usuario recibe su Token Bearer, todas las solicitudes posteriores a las APIs protegidas (como obtener métricas, enviar comandos o gestionar URLs bloqueadas) deben incluir este token en la cabecera **Authorization**.

**Dependencia get_current_user:** Todos los endpoints sensibles, como `/api/clients_summary`, `/api/send_command`, o `/api/block_url`, utilizan una función de dependencia de **FastAPI** llamada `get_current_user`.

**Verificación en Cada Solicitud:** Esta función decodifica el JWT para verificar que la firma HS256 sea válida y que el token no haya caducado, además de buscar el usuario en la base de datos.
Acceso Denegado: Si el token es inválido o ha expirado, el servidor responde con un error HTTP 401 Unauthorized ("No autorizado").
