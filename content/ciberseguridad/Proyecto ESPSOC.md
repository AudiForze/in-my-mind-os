![[espsoc.png]]
espsoc es una herramienta educativa desarrollada en Python que simula las capacidades fundamentales de un Centro de Operaciones de Seguridad (SOC). Su propósito es servir como un "puesto de comando" para analistas de seguridad, permitiéndoles gestionar usuarios, realizar inteligencia de amenazas en tiempo real sobre dominios e IPs, y reportar incidentes de manera automatizada.

A diferencia de las herramientas de línea de comandos tradicionales, este proyecto apuesta por una Interfaz Gráfica de Usuario (GUI) moderna construida con customtkinter. Esto no solo hace que la herramienta sea más accesible visualmente, sino que demuestra cómo Python puede utilizarse para crear aplicaciones de escritorio robustas que integran múltiples servicios y APIs en un solo panel de control.

### 2. Seguridad desde la Base

Una de las primeras lecciones que ofrece este proyecto es el manejo responsable de credenciales. En lugar de almacenar las contraseñas de los usuarios en texto plano (un error grave de seguridad), el sistema implementa hashing utilizando el algoritmo SHA-256.

Autenticación y Criptografía
En el archivo pyqt.py, podemos ver cómo, al inicializar la base de datos, se crean los usuarios por defecto (admin y root). Observa cómo la contraseña se convierte en un hash antes de guardarse.

Este proceso asegura que, incluso si un atacante accede al archivo usuarios.db, no podrá leer las contraseñas originales directamente.

``` python
def inicializar_base_datos():
    # ... conexión a la base de datos ...
    cursor.execute("SELECT * FROM usuarios WHERE nombre='admin'")
    if not cursor.fetchone():
        # Aquí ocurre la magia: se hashea la contraseña
        password_hash = sha256('admin123'.encode()).hexdigest()
        cursor.execute("INSERT INTO usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)", 
                      ('admin', password_hash, 'administrador'))
```
### 3. Inteligencia de Amenazas
El núcleo del SOC reside en su capacidad para determinar si un dominio es seguro o malicioso utilizando múltiples fuentes de verdad.

Consulta a VirusTotal API
El módulo validar.py actúa como un cliente HTTP que se comunica con la API v3 de VirusTotal. El código construye una petición GET autenticada mediante un encabezado y procesa la respuesta JSON para extraer las estadísticas de reputación.

```python 
def verificar_dominio(dominio):
    API_KEY = "66d00a63db..."  
    url = f"https://www.virustotal.com/api/v3/domains/{dominio}"
    headers = {"x-apikey": API_KEY}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Se extraen métricas específicas
            stats = data["data"]["attributes"]["last_analysis_stats"]
            if stats["malicious"] > 0 or stats["suspicious"] > 0:
                return f"[⚠️] {dominio} - Malicioso", "malicious"
            else:
                return f"[✅] {dominio} es seguro", "safe"
```

### Detección DNS con Spamhaus
El proyecto demuestra un conocimiento avanzado de redes al implementar consultas a listas negras basadas en DNS (DNSBL). Para consultar estas listas, el sistema debe invertir la dirección IP y añadirle el dominio de la lista negra (`zen.spamhaus.org`). Si el servidor DNS resuelve la consulta con éxito (usando `gethostbyname`), la IP está en la lista negra.

```python
def check_spamhaus(domain_or_ip):
    try:
        # Se invierte la IP (ej: 1.2.3.4 -> 4.3.2.1)
        reversed_ip = '.'.join(ip.split('.')[::-1])
        query = f"{reversed_ip}.zen.spamhaus.org"
        
        try:
            # Si gethostbyname resuelve, la IP está en la lista negra
            gethostbyname(query)
            return "⛔ En lista negra (Spamhaus)"
        except gaierror:
            # Si falla la resolución, la IP está limpia
            return "✅ No en listas negras"
```
### 4. Rendimiento y Automatización

**Multithreading para Concurrencia**
Un problema común en aplicaciones de interfaz gráfica es el bloqueo de la UI durante tareas de red largas. **espsoc** resuelve esto utilizando ThreadPoolExecutor, lo que le permite lanzar múltiples hilos simultáneos para el análisis masivo de dominios, manteniendo la ventana principal responsiva.

``` python 
def ejecutar_analisis():
    # Se crea un pool de 10 trabajadores
    with ThreadPoolExecutor(max_workers=10) as executor:  
        futures = {executor.submit(analizar, dom): dom for dom in dominios}
        for future in futures:
            # Procesa resultados asíncronamente y actualiza la UI
            res = future.result()
            self.after(0, update_ui, res)
```
**Notificación Asíncrona con Discord**
El proyecto implementa un bot de Discord que se ejecuta en un hilo separado. Esto permite que el SOC envíe alertas y los gráficos generados por matplotlib a un usuario específico mediante un Mensaje Directo (DM), cerrando el ciclo de notificación de incidentes.

```python 
class DiscordBot:
    def __init__(self):
        self.bot = commands.Bot(command_prefix='!', intents=discord.Intents.all())

    async def send_dm(self, content):
        user = await self.bot.fetch_user(self.user_id)
        if user:
            # Envío directo al usuario (DM)
            await user.send(content)

```