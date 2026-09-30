Las **bases de datos vectoriales** (o vectorizadas) son bases de datos diseñadas para **guardar información como vectores numéricos y buscar información por similitud de significado**, en lugar de buscar únicamente coincidencias exactas de palabras.

### Una forma sencilla de verlo

Una base de datos tradicional puede guardar:

```text
ID | Nombre   | Ciudad
1  | Geremy   | Santo Domingo
2  | Carlos   | Santiago
```

Y buscar:

> "Busca personas de Santo Domingo"

La base de datos busca coincidencias con `"Santo Domingo"`.

Una base de datos vectorial funciona de otra manera.

Supongamos que tienes:

> "El perro está jugando en el parque."

Un modelo de **embeddings** convierte ese texto en números:

```text
[0.21, -0.73, 0.44, 0.18, ..., 0.91]
```

Ese conjunto de números es un **vector**.

Otro texto:

> "Un cachorro corre por el parque."

podría producir un vector parecido:

```text
[0.24, -0.70, 0.47, 0.16, ..., 0.89]
```

Aunque los dos textos **no utilizan exactamente las mismas palabras**, sus vectores están cerca porque tienen un significado similar.

---

### ¿Qué guarda entonces una base vectorial?

Normalmente almacena algo parecido a:

```text
┌───────────────┬─────────────────────┬───────────────────────┐
│ ID            │ Texto               │ Embedding             │
├───────────────┼─────────────────────┼───────────────────────┤
│ chunk_001     │ El perro juega...   │ [0.21,-0.73,...]      │
│ chunk_002     │ El cachorro corre...│ [0.24,-0.70,...]      │
│ chunk_003     │ El automóvil...    │ [-0.51,0.12,...]       │
└───────────────┴─────────────────────┴───────────────────────┘
```

La base puede calcular qué vectores están **más cerca** del vector de una pregunta.

---

### ¿Por qué son importantes para RAG?

Aquí es donde se vuelven muy útiles.

Imagina que subes un PDF de 200 páginas.

El sistema hace:

```text
PDF
 ↓
Extraer texto
 ↓
Dividir en chunks
 ↓
Crear embeddings
 ↓
Guardar embeddings
 ↓
Base de datos vectorial
```

Después preguntas:

> "¿Cuál es la política de vacaciones de la empresa?"

La pregunta también se convierte en un vector:

```text
Pregunta
   ↓
Embedding
   ↓
[0.18, -0.72, 0.46, ...]
```

La base vectorial busca los fragmentos que tienen vectores más similares:

```text
                 Pregunta
                    ↓
              [0.18,-0.72,...]
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
     Chunk 37             Chunk 104
    similitud 0.94        similitud 0.91
          │                   │
          └─────────┬─────────┘
                    ↓
                   LLM
                    ↓
                Respuesta
```

Eso es la parte de **Retrieval** de RAG.

### En una frase

> **Una base de datos vectorial permite almacenar representaciones numéricas del significado de la información y posteriormente encontrar información semánticamente similar.**

Algunos sistemas conocidos son **Pinecone**, **Qdrant**, **Weaviate** y PostgreSQL utilizando **pgvector**.

Y lo importante: **la base vectorial no es la IA**. Es el sistema que le permite a la IA **encontrar rápidamente el conocimiento relevante** que necesita para responder.
