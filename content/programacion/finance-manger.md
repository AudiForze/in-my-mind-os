
## Descripción general

**Finance Manager** es una aplicación web para administrar las finanzas personales y empresariales desde una única interfaz. El proyecto está pensado como una herramienta local-first: los datos se almacenan en una base de datos PostgreSQL controlada por el usuario y la aplicación ofrece una interfaz para consultar saldos, registrar movimientos, controlar inversiones y planificar compras.

La aplicación unifica cuatro áreas:

- **Cuentas:** cuentas personales, empresariales o de movimiento, con moneda, saldo inicial y movimientos asociados.
- **Inversiones:** portfolios de inversión o trading con posiciones, cantidad de activos y valoración actual.
- **Objetivos:** listas de compras que permiten comparar el coste de productos con el dinero disponible.
- **Sincronización Qik:** importación de notificaciones de gastos recibidas por Gmail mediante IMAP.

El dashboard principal resume el patrimonio en DOP, el patrimonio en USD, el valor actual de las inversiones, el número de cuentas y los movimientos recientes.

## Objetivos del proyecto

El proyecto resuelve un problema práctico: mantener una visión consolidada de dinero que normalmente está distribuido entre cuentas bancarias, efectivo, servicios de pago e inversiones. Sus objetivos principales son:

1. Registrar manualmente ingresos, gastos, transferencias y ajustes.
2. Calcular el balance de cada cuenta a partir de un saldo inicial y sus transacciones.
3. Separar el dinero disponible de la valoración de activos de inversión.
4. Evitar que una notificación bancaria importada dos veces duplique un movimiento.
5. Facilitar la planificación de compras mediante listas de objetivos.
6. Mantener una base técnica sencilla de ejecutar y operar en un equipo personal.

## Stack tecnológico

| Capa | Tecnología | Uso |
| --- | --- | --- |
| Framework | Next.js 15.5 | App Router, páginas y endpoints del servidor |
| Lenguaje | TypeScript | Componentes, páginas y lógica de aplicación |
| UI | React 19.1 | Interfaz interactiva y componentes cliente |
| Estilos | Tailwind CSS 4 + CSS global | Layout, responsive design y tema visual |
| Iconos | lucide-react | Iconografía de navegación y acciones |
| Gráficas | Recharts | Visualización disponible para dashboards de datos |
| Persistencia | PostgreSQL | Almacenamiento relacional |
| ORM | Prisma 6.19 | Schema, cliente tipado y migraciones |
| Automatización | Python estándar + IMAP | Lectura e importación de correos de Qik |

La aplicación no utiliza un servicio de autenticación propio. Está orientada a un entorno personal o controlado, donde el servidor y la base de datos pertenecen al usuario.

## Arquitectura de la aplicación

### App Router y renderizado

Las rutas se organizan dentro de `app/` siguiendo el App Router de Next.js. Las páginas principales son componentes de servidor: consultan Prisma directamente, convierten los valores `Decimal` a números serializables y pasan los datos iniciales a componentes cliente.

Este patrón divide las responsabilidades de forma clara:

- El servidor carga la información inicial y ejecuta consultas a PostgreSQL.
- Los componentes cliente controlan formularios, estados locales, filtros y confirmaciones.
- Las mutaciones se realizan mediante `fetch` contra endpoints internos bajo `/api`.
- `lib/db.ts` mantiene una única instancia de `PrismaClient` durante el desarrollo para evitar crear conexiones innecesarias durante el hot reload.

El layout global monta el `Sidebar`, define el idioma HTML como español y deja el contenido principal con espacio para la navegación lateral. En pantallas pequeñas, la barra lateral se transforma en un menú desplegable.

### Estructura funcional

```text
app/
  page.tsx                    Dashboard general
  accounts/                   Listado y detalle de cuentas
  investments/               Portfolios y posiciones
  goals/                     Objetivos y listas de compras
  settings/                  Configuración
  api/                       Endpoints de mutación y sincronización
components/                  UI cliente y dashboards
lib/db.ts                    Cliente Prisma compartido
prisma/schema.prisma         Modelo de datos
scripts/qik_sync.py          Importador IMAP de Qik
```

## Modelo de datos

El schema usa identificadores `cuid()` y fechas automáticas. Los importes monetarios se almacenan con tipos `Decimal` en PostgreSQL para evitar errores de precisión propios de los números de coma flotante.

### Account

Representa una cuenta de dinero disponible.

- `initialBalance`: saldo de partida.
- `currency`: moneda de la cuenta, por defecto USD.
- `type`: `PERSONAL`, `BUSINESS` o `MOVEMENT`.
- `automation`: `NONE` o `QIK_EMAIL`.
- `transactions`: movimientos originados en la cuenta.
- `transfersIn`: movimientos que llegan desde otra cuenta.

La relación de entrada de transferencias está separada de la relación de movimientos de origen. Esto permite modelar una transferencia sin confundirla con un gasto ordinario.

### Transaction

Representa un ingreso, gasto, transferencia o ajuste.

- `type`: `INCOME`, `EXPENSE`, `TRANSFER` o `ADJUSTMENT`.
- `amount`: importe con precisión de dos decimales.
- `description`, `locality` y `category`: información descriptiva y de clasificación.
- `date`: fecha efectiva del movimiento.
- `source`: `MANUAL`, `QIK_EMAIL`, `IMPORT` o `API`.
- `externalId`: identificador externo único, usado para idempotencia.
- `reportedBalance`: saldo comunicado por una fuente externa, principalmente Qik.
- `destinationId`: cuenta de destino opcional para transferencias.

Los movimientos se eliminan en cascada cuando se elimina su cuenta. La eliminación de una cuenta usada como destino deja la referencia de destino en `NULL`.

### InvestmentAccount y Position

`InvestmentAccount` modela un portfolio de inversión o trading. Puede guardar el broker, la moneda y un balance inicial.

`Position` representa un activo dentro del portfolio:

- `asset`: símbolo o nombre del activo.
- `shares`: cantidad, con hasta ocho decimales.
- `purchasePrice` y `currentPrice`: precios con hasta cuatro decimales.
- `purchaseDate`: fecha de adquisición.

El valor actual mostrado se calcula como:

```text
valor de posición = shares * currentPrice
valor del portfolio = suma del valor de sus posiciones
```

El esquema también incluye `InvestmentTransaction` para depósitos, retiros, compras, ventas, dividendos, comisiones y ajustes. Esto deja preparada la persistencia para una contabilidad de inversiones más completa, aunque la vista principal se centra actualmente en las posiciones.

### PurchaseGoal y PurchaseItem

Un `PurchaseGoal` es una lista de compras en una moneda determinada. Cada `PurchaseItem` guarda nombre, URL opcional y precio.

El total de un objetivo es la suma de sus productos. La pantalla lo compara con el dinero disponible de la misma moneda. Para USD, el cálculo incluye también el valor actual de las posiciones de inversión; esta decisión permite saber si el patrimonio total cubriría el objetivo, aunque no representa necesariamente dinero líquido.

### Setting

El modelo `Setting` permite almacenar pares clave-valor globales. Es una base para configuraciones persistentes, aunque muchas credenciales de integración se mantienen actualmente mediante variables de entorno.

## Reglas de cálculo financiero

Para una cuenta normal, el balance se obtiene así:

```text
balance = initialBalance
        + ingresos
        - gastos
        + ajustes
```

Las transacciones de tipo `TRANSFER` no se suman como ingreso o gasto en este cálculo para evitar contabilizar dos veces el mismo dinero. La representación completa de una transferencia depende de su cuenta de origen y de destino.

Las cuentas Qik tienen un comportamiento diferente. Si existe una transacción `QIK_EMAIL` con `reportedBalance`, se toma el reporte más reciente como saldo actual. De esta forma, la aplicación puede reconciliarse con el saldo que Qik comunica, incluso si faltan movimientos históricos o hay diferencias entre el balance local y el externo.

En el dashboard:

- Las cuentas DOP se agregan como patrimonio en pesos.
- Las cuentas USD se agregan como efectivo en dólares.
- Las posiciones se valoran con `shares * currentPrice` y se suman al patrimonio USD.
- Los movimientos recientes se consultan ordenados por fecha descendente, limitados a los últimos veinte.

Los valores monetarios se convierten a `number` solamente al preparar los datos para React. La persistencia conserva `Decimal` para las operaciones y consultas de Prisma.

## Funcionalidades principales

### Dashboard

El dashboard presenta tarjetas de resumen para patrimonio DOP, patrimonio USD, efectivo, inversiones y cantidad de movimientos. También muestra tarjetas por cuenta y una lista de movimientos recientes con cuenta, categoría, descripción, fecha y tipo.

Incluye un componente `Balance` para centralizar el formateo de importes y una opción visual para ocultar o mostrar saldos, útil cuando la pantalla está visible para otras personas.

### Gestión de cuentas

Desde `/accounts` se pueden crear cuentas indicando nombre, balance inicial, tipo, moneda y automatización. Cada cuenta tiene una página de detalle donde se pueden administrar sus datos y movimientos.

Las operaciones disponibles incluyen:

- Crear, editar y eliminar cuentas.
- Registrar transacciones manuales.
- Buscar y filtrar movimientos por texto, tipo y categoría.
- Consultar el balance calculado.
- Ver información contextual como localidad, fecha y origen del movimiento.
- Sincronizar manualmente una cuenta configurada para Qik.

### Inversiones

El módulo de inversiones permite crear portfolios de tipo `INVESTMENT` o `TRADING`, indicar un broker y administrar posiciones. Cada portfolio muestra el número de activos y su valor calculado.

Una posición guarda cantidad comprada, precio de compra, precio actual y fecha. La diferencia entre el precio de compra y el actual permite construir análisis de rendimiento, aunque el modelo todavía no persiste un historial de precios ni calcula explícitamente ganancias realizadas y no realizadas.

### Objetivos de compra

Los objetivos permiten crear una lista con productos iniciales. Cada producto puede incluir un enlace y un precio. La aplicación calcula el monto total y muestra si los fondos disponibles en la moneda elegida son suficientes.

El detalle de un objetivo permite revisar y modificar sus productos. La eliminación de un objetivo elimina sus productos asociados mediante la relación en cascada de Prisma.

## Integración con Qik

La integración está separada en un script de extracción y un endpoint de recepción.

### Flujo de importación

1. `scripts/qik_sync.py` inicia sesión en Gmail mediante IMAP SSL.
2. Busca mensajes enviados por `notificaciones@qik.do`.
3. Extrae `Monto`, `Balance Disponible` y `Localidad` del cuerpo de texto o HTML.
4. Lee el `Message-ID` del correo y lo usa como `externalId`.
5. Envía los datos como JSON a `/api/qik/import`.
6. El endpoint localiza la cuenta marcada con automatización `QIK_EMAIL`.
7. Prisma ejecuta un `upsert`: un correo existente actualiza su balance reportado y uno nuevo crea la transacción.

El endpoint valida el remitente permitido, la existencia de la cuenta y los campos obligatorios `externalId`, `amount` y `reportedBalance`. Por eso una segunda ejecución del sincronizador no crea duplicados.

El parser acepta mensajes multipart, texto plano y HTML. También contempla formatos numéricos con punto o coma decimal y distintos separadores de miles.

### Configuración

La integración utiliza estas variables:

```env
QIK_EMAIL="tu_correo@gmail.com"
QIK_APP_PASSWORD="TU_CLAVE_DE_APLICACION"
QIK_IMAP_HOST="imap.gmail.com"
QIK_IMAP_PORT="993"
FINANCE_MANAGER_URL="http://localhost:3000/api/qik/import"
```

Debe utilizarse una contraseña de aplicación de Google, nunca la contraseña principal. El archivo `.env` no debe subirse al repositorio.

La sincronización puede ejecutarse manualmente desde la interfaz o mediante Python. Para automatizarla se puede usar cron o un timer de systemd.

## API interna

La aplicación organiza sus mutaciones en route handlers de Next.js:

```text
/api/accounts
/api/accounts/[id]
/api/transactions
/api/transactions/[id]
/api/investments
/api/investments/[id]
/api/investments/[id]/positions
/api/investments/[id]/positions/[positionId]
/api/goals
/api/goals/[id]
/api/goals/[id]/items/[itemId]
/api/qik/import
/api/qik/sync
```

Los componentes cliente envían JSON con `fetch` y actualizan su estado local cuando la respuesta es correcta. La persistencia y las relaciones quedan centralizadas en Prisma, evitando que los componentes construyan SQL directamente.

## Interfaz y experiencia de usuario

La interfaz utiliza un tema oscuro con paneles contrastados, bordes sutiles y una navegación lateral persistente. Las páginas emplean grids responsivos: formularios y listados se muestran en columnas en escritorio y se apilan en pantallas pequeñas.

La navegación usa iconos de Lucide para dashboard, cuentas, inversiones, objetivos y configuración. Los formularios usan controles nativos de texto, número y selección, con cantidades monetarias configuradas para aceptar dos decimales.

El proyecto prioriza la lectura rápida de saldos y la edición directa de datos. Los componentes cliente mantienen el feedback inmediato en acciones como crear una cuenta, portfolio u objetivo, aunque una aplicación de producción debería añadir estados explícitos de carga, errores de red y revalidación del servidor después de cada mutación.

## Instalación y ejecución

### Dependencias

En Arch Linux se requieren Node.js, npm, PostgreSQL, Git y Python:

```bash
sudo pacman -S git nodejs npm postgresql python
sudo systemctl enable --now postgresql
```

Después se crea la base de datos y el usuario de PostgreSQL, se configura `.env` a partir de `.env.example` y se ejecuta:

```bash
npm install
npx prisma validate
npx prisma generate
npx prisma migrate dev
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

Para una ejecución de producción:

```bash
npm run build
npm start
```

## Fortalezas técnicas

- Modelo relacional explícito y fácil de extender.
- Uso de `Decimal` para importes y cantidades financieras.
- Separación entre cuentas, inversiones y objetivos.
- Idempotencia en la importación de correos mediante `externalId` único.
- Índices para búsquedas por cuenta, fecha, tipo, categoría, origen y activo.
- Renderizado inicial en servidor con interactividad localizada en componentes cliente.
- Integración Qik basada en librerías estándar de Python, sin dependencias externas para IMAP.
- Migraciones Prisma versionadas para reproducir la estructura de la base de datos.
- Diseño responsive y navegación adaptable a pantallas pequeñas.

## Limitaciones y mejoras futuras

El proyecto es funcional, pero todavía tiene varias áreas naturales de evolución:

1. **Autenticación y autorización:** actualmente no hay usuarios, sesiones ni aislamiento de datos por propietario. No debería exponerse públicamente sin añadir una capa de identidad y control de acceso.
2. **Validación de entrada:** convendría validar payloads con un esquema compartido, por ejemplo Zod, antes de enviarlos a Prisma.
3. **Transacciones atómicas:** las operaciones que afectan a dos cuentas deberían ejecutarse dentro de una transacción de Prisma para garantizar consistencia.
4. **Monedas:** el dashboard suma por moneda y no convierte divisas. Sería útil añadir tipos de cambio, fecha de valoración y una moneda base configurable.
5. **Inversiones:** falta historial de precios, dividendos aplicados al balance, comisiones integradas y cálculo formal de rendimiento.
6. **Sincronización:** el importador procesa correos encontrados desde Gmail, pero una versión más robusta podría registrar el último UID procesado, manejar reintentos y proteger el endpoint con autenticación.
7. **Observabilidad:** faltan logs estructurados, métricas y una pantalla de estado de la última sincronización.
8. **Calidad automática:** sería recomendable añadir pruebas unitarias para las reglas de balance, parser numérico y deduplicación, además de pruebas de integración para los route handlers.
9. **Actualización de datos:** tras una mutación, algunos componentes actualizan el estado local sin revalidar toda la página. `revalidatePath` o una estrategia de cache explícita harían más predecible la consistencia entre vistas.
10. **Precisión en frontend:** aunque la base de datos conserva `Decimal`, los componentes convierten importes a `number` para renderizarlos. Para cálculos financieros complejos convendría mantener una librería decimal también en el cliente.

## Valor del proyecto

Finance Manager es más que un CRUD de cuentas: define un pequeño dominio financiero con fuentes de datos distintas, reglas de conciliación y entidades relacionadas. La combinación de un balance calculado localmente con un saldo reportado por Qik muestra una decisión de diseño importante: la aplicación puede funcionar manualmente y, al mismo tiempo, incorporar automatización progresiva.

Su estructura también deja una base razonable para crecer. Las cuentas y transacciones permiten construir presupuestos y reportes; las inversiones pueden evolucionar hacia un seguimiento de rendimiento; y los objetivos conectan el patrimonio disponible con decisiones concretas de compra. El siguiente salto técnico debería centrarse en seguridad, validación y consistencia transaccional antes de añadir más módulos.