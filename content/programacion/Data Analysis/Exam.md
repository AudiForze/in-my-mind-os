# Exam: análisis de datos con Python

## Descripción general

La carpeta `Exam` reúne varios ejercicios desarrollados durante la certificación **Data Analysis with Python** de freeCodeCamp. A diferencia de un proyecto aislado, aquí se concentran soluciones de distintos tipos de problemas estadísticos:

1. Cálculo de estadísticas descriptivas sobre una matriz de 3 x 3.
2. Análisis demográfico de un dataset de población adulta.
3. Análisis médico y visualización de factores relacionados con enfermedad cardiovascular.

El conjunto muestra una progresión interesante: empieza con operaciones vectorizadas sobre NumPy, continúa con filtrado y agrupación de datos tabulares y termina con transformación, correlación y visualización estadística.

Repositorio original: [AudiForze/freecodecamp/Exam](https://github.com/AudiForze/freecodecamp/tree/main/Exam).

## Estructura del examen

```text
Exam/
├── Mean-Variance-Standard_Deviation_Calculator.py
├── Demographic Data Analyzer/
│   ├── Demographic_Data_Analyzer.py
│   ├── adult.data.csv
│   └── test_module.py
└── medical examination/
    ├── medical_data_visualizer.py
    ├── medical_examination.csv
    └── test_module.py
```

El repositorio también contiene carpetas `__pycache__`, que son artefactos generados por Python y no forman parte de la lógica del examen.

## Tecnologías utilizadas

- **Python:** implementación de todos los ejercicios.
- **NumPy:** matrices, medias, varianzas, desviaciones, mínimos, máximos y sumas.
- **Pandas:** lectura de CSV, filtrado, agrupación y transformación de columnas.
- **Matplotlib:** figuras y elementos visuales.
- **Seaborn:** gráficos de barras categóricos y mapa de calor.
- **unittest:** validación automatizada de resultados numéricos y visualizaciones.

## 1. Mean-Variance-Standard Deviation Calculator

### Objetivo

El primer ejercicio recibe una lista de exactamente nueve números, la transforma en una matriz de 3 x 3 y calcula estadísticas por columnas, por filas y sobre el conjunto completo.

```python
def calculate(list_of_numbers):
    if len(list_of_numbers) != 9:
        raise ValueError("List must contain nine numbers.")
    arr = np.array(list_of_numbers).reshape(3, 3)
```

La validación inicial es importante porque una matriz de 3 x 3 requiere exactamente nueve elementos. Si la lista tiene otra longitud, el programa lanza un `ValueError` explícito.

### Estadísticas calculadas

El resultado es un diccionario con seis claves:

- `mean`
- `variance`
- `standard deviation`
- `max`
- `min`
- `sum`

Cada clave contiene tres resultados:

1. Una lista calculada por columnas.
2. Una lista calculada por filas.
3. Un valor global de toda la matriz.

Por ejemplo, la media se calcula así:

```python
'mean': [
    np.mean(arr, axis=0).tolist(),
    np.mean(arr, axis=1).tolist(),
    float(np.mean(arr)),
]
```

La misma estructura se repite con `np.var`, `np.std`, `np.max`, `np.min` y `np.sum`.

### Decisión técnica: ejes de NumPy

En NumPy:

- `axis=0` reduce verticalmente y devuelve un resultado por columna.
- `axis=1` reduce horizontalmente y devuelve un resultado por fila.
- Sin `axis`, la operación se aplica a todos los elementos.

Este ejercicio es pequeño, pero introduce una idea central del análisis de datos: una misma operación puede responder preguntas diferentes dependiendo del eje sobre el que se agreguen los datos.

### Fortalezas y mejoras

La solución es compacta y aprovecha operaciones vectorizadas de NumPy. Como mejora, se podría validar también que los elementos sean numéricos antes de construir el array y añadir anotaciones de tipo para documentar el contrato de la función.

Código original: [Mean-Variance-Standard_Deviation_Calculator.py](https://github.com/AudiForze/freecodecamp/blob/main/Exam/Mean-Variance-Standard_Deviation_Calculator.py).

## 2. Demographic Data Analyzer

### Objetivo

Este ejercicio analiza el dataset `adult.data.csv`, basado en información demográfica y laboral. La función `calculate_demographic_data()` calcula indicadores relacionados con raza, edad, educación, salario, horas de trabajo, país de origen y ocupación.

```python
def calculate_demographic_data(print_data=True):
    df = pd.read_csv("adult.data.csv")
```

El parámetro `print_data` separa el cálculo de la presentación: permite ejecutar la función mostrando resultados en consola o usarla desde las pruebas sin imprimir información innecesaria.

### Indicadores producidos

La función devuelve un diccionario con estos resultados:

| Clave | Significado |
| --- | --- |
| `race_count` | Conteo de personas por raza |
| `average_age_men` | Edad media de los hombres |
| `percentage_bachelors` | Porcentaje con título de Bachelor |
| `higher_education_rich` | Porcentaje con educación avanzada y salario mayor a 50K |
| `lower_education_rich` | Porcentaje sin educación avanzada y salario mayor a 50K |
| `min_work_hours` | Menor cantidad de horas trabajadas por semana |
| `rich_percentage` | Porcentaje con salario mayor a 50K entre quienes trabajan esas horas mínimas |
| `highest_earning_country` | País con mayor proporción de salarios mayores a 50K |
| `highest_earning_country_percentage` | Porcentaje correspondiente a ese país |
| `top_IN_occupation` | Ocupación más frecuente entre personas de India con salario mayor a 50K |

### Conteo por raza

Pandas resuelve el primer indicador con `value_counts()`:

```python
race_count = df['race'].value_counts()
```

El resultado conserva la frecuencia de cada categoría y se devuelve como una serie de Pandas, por lo que las pruebas pueden convertirla a lista y comparar sus valores.

### Edad y educación

La edad media de los hombres se obtiene filtrando por sexo:

```python
average_age_men = round(
    df[df['sex'] == 'Male']['age'].mean(),
    1,
)
```

El porcentaje de personas con Bachelor se calcula aprovechando que una comparación booleana puede promediarse como `True = 1` y `False = 0`:

```python
percentage_bachelors = round(
    (df['education'] == 'Bachelors').mean() * 100,
    1,
)
```

### Educación avanzada y salario

El análisis considera educación avanzada a las categorías `Bachelors`, `Masters` y `Doctorate`:

```python
advanced_education = df['education'].isin(
    ['Bachelors', 'Masters', 'Doctorate']
)

higher_education = df[advanced_education]
lower_education = df[~advanced_education]
```

Luego calcula la proporción de salarios superiores a 50K en cada grupo:

```python
higher_education_rich = round(
    (higher_education['salary'] == '>50K').mean() * 100,
    1,
)
```

La comparación es descriptiva y no demuestra causalidad. El resultado permite observar una asociación dentro de este dataset, pero no prueba que el nivel educativo sea por sí solo la causa del salario.

### Horas mínimas y país con mayores ingresos

El mínimo de horas semanales se obtiene directamente:

```python
min_work_hours = df['hours-per-week'].min()
min_workers = df[df['hours-per-week'] == min_work_hours]
```

Después se calcula qué porcentaje de ese grupo supera los 50K.

Para analizar países, el proyecto agrupa por `native-country` y aplica una función que calcula el porcentaje de salarios altos:

```python
country_salary = (
    df.groupby('native-country')['salary']
    .apply(lambda values: (values == '>50K').mean() * 100)
)

highest_earning_country = country_salary.idxmax()
highest_earning_country_percentage = round(country_salary.max(), 1)
```

Esta combinación de `groupby`, función personalizada, `idxmax` y `max` es el núcleo del análisis por país.

### Ocupación predominante en India

El último indicador encadena dos filtros y obtiene la moda:

```python
top_IN_occupation = (
    df[
        (df['native-country'] == 'India') &
        (df['salary'] == '>50K')
    ]['occupation'].mode()[0]
)
```

La solución supone que el subconjunto contiene al menos una ocupación. En una versión más robusta se podría comprobar si `mode()` está vacío antes de acceder a `[0]`.

### Pruebas del analizador demográfico

Las pruebas esperan, entre otros resultados:

- Conteos raciales concretos.
- Edad media masculina de `39.4`.
- `16.4%` con Bachelor.
- `46.5%` de salarios altos en el grupo de educación avanzada.
- `17.4%` en el grupo sin educación avanzada.
- Una hora semanal como mínimo.
- Irán como país con mayor porcentaje de salarios altos.
- `Prof-specialty` como ocupación más frecuente en India dentro del filtro solicitado.

Estas pruebas fijan tanto los resultados como el significado exacto de cada consulta.

## 3. Medical Data Visualizer

### Objetivo

El proyecto médico analiza factores relacionados con enfermedades cardiovasculares. Utiliza el archivo `medical_examination.csv` y genera dos visualizaciones:

- Un gráfico categórico que compara hábitos y características por estado cardiovascular.
- Un mapa de calor de correlaciones después de limpiar observaciones inconsistentes y extremos.

### Preparación de datos

El índice de masa corporal no se guarda directamente. Se crea una variable binaria `overweight` a partir de peso y altura:

```python
df['overweight'] = (
    df['weight'] / ((df['height'] / 100) ** 2) > 25
).astype(int)
```

La fórmula corresponde al BMI o IMC. La altura se convierte de centímetros a metros antes de elevarla al cuadrado.

También se recodifican colesterol y glucosa para que el valor `0` represente la categoría normal y `1` una categoría superior:

```python
df['cholesterol'] = df['cholesterol'].apply(
    lambda value: 0 if value == 1 else 1
)
df['gluc'] = df['gluc'].apply(
    lambda value: 0 if value == 1 else 1
)
```

Este paso convierte variables ordinales en indicadores binarios adecuados para comparar conteos.

### Gráfico categórico

`draw_cat_plot()` transforma las columnas de factores a formato largo usando `pd.melt()`:

```python
df_cat = pd.melt(
    df,
    id_vars=['cardio'],
    value_vars=[
        'cholesterol', 'gluc', 'smoke',
        'alco', 'active', 'overweight',
    ],
)
```

Después agrupa por enfermedad cardiovascular, variable y valor:

```python
df_cat = (
    df_cat
    .groupby(['cardio', 'variable', 'value'])
    .size()
    .reset_index(name='total')
)
```

Finalmente crea dos paneles, uno para cada valor de `cardio`:

```python
fig = sns.catplot(
    data=df_cat,
    kind='bar',
    x='variable',
    y='total',
    hue='value',
    col='cardio',
).fig
```

El gráfico permite comparar cuántas personas presentan cada condición en los grupos con y sin enfermedad cardiovascular. Es una visualización de conteos, no de causalidad ni de riesgo relativo.

### Mapa de calor

Antes de calcular correlaciones, se filtran tres tipos de problemas:

```python
df_heat = df[
    (df['ap_lo'] <= df['ap_hi']) &
    (df['height'] >= df['height'].quantile(0.025)) &
    (df['height'] <= df['height'].quantile(0.975)) &
    (df['weight'] >= df['weight'].quantile(0.025)) &
    (df['weight'] <= df['weight'].quantile(0.975))
]
```

La primera condición elimina registros con presión diastólica superior a la sistólica. Las otras condiciones quitan el 2,5% inferior y superior de altura y peso para reducir la influencia de valores extremos.

La matriz de correlación y la máscara triangular se construyen así:

```python
corr = df_heat.corr()
mask = np.triu(corr)
```

La máscara evita duplicar la mitad simétrica de la matriz:

```python
sns.heatmap(
    corr,
    mask=mask,
    annot=True,
    fmt='.1f',
    center=0,
    square=True,
    linewidths=0.5,
    cbar_kws={'shrink': 0.5},
)
```

El resultado muestra correlaciones en una escala centrada en cero. Una correlación no implica causalidad; solo describe la relación lineal entre variables dentro de los datos filtrados.

El código genera `catplot.png` y `heatmap.png` cuando se ejecutan ambas funciones. Esas imágenes no estaban almacenadas en la carpeta original del repositorio, por lo que este documento explica su generación a partir del código fuente en lugar de duplicar artefactos que no formaban parte del commit original.

### Pruebas del visualizador médico

Las pruebas del gráfico categórico verifican:

- Etiqueta X: `variable`.
- Etiqueta Y: `total`.
- Orden de las seis categorías.
- Cantidad esperada de rectángulos.

Las pruebas del mapa de calor verifican:

- Etiquetas de las catorce variables.
- Valores anotados de la matriz de correlación.
- Correspondencia entre el resultado y el dataset procesado.

Este tipo de test es especialmente valioso en visualización porque un gráfico puede renderizarse sin excepción y, aun así, estar mal agrupado o mostrar etiquetas equivocadas.

## Comparación de los tres ejercicios

| Ejercicio | Tipo de datos | Operaciones principales | Salida |
| --- | --- | --- | --- |
| Mean/Variance/Standard Deviation | Lista numérica | Operaciones por ejes | Diccionario estadístico |
| Demographic Data Analyzer | CSV demográfico | Filtros, porcentajes y agrupaciones | Diccionario de indicadores |
| Medical Data Visualizer | CSV médico | Transformación, limpieza y correlación | Gráfico categórico y heatmap |

La complejidad aumenta progresivamente:

1. El calculador trabaja con una estructura conocida y nueve números.
2. El analizador demográfico trabaja con categorías, filtros y agrupaciones.
3. El visualizador médico combina ingeniería de variables, limpieza de outliers, formato largo, correlaciones y gráficos multivariables.

## Flujo de ejecución recomendado

Cada subproyecto usa rutas relativas a sus propios archivos. Una ejecución organizada sería:

```bash
pip install numpy pandas matplotlib seaborn

python Mean-Variance-Standard_Deviation_Calculator.py

cd "Demographic Data Analyzer"
python -m unittest test_module.py
cd ..

cd "medical examination"
python -m unittest test_module.py
```

Para el visualizador médico se deben ejecutar las funciones de generación de gráficos desde un script o una consola Python:

```python
import medical_data_visualizer

medical_data_visualizer.draw_cat_plot()
medical_data_visualizer.draw_heat_map()
```

## Evaluación técnica

### Fortalezas

- Cada ejercicio tiene una función principal clara.
- Se utilizan operaciones vectorizadas de NumPy y Pandas.
- Las pruebas fijan resultados numéricos y características visuales.
- El análisis demográfico separa cálculo y presentación mediante `print_data`.
- El proyecto médico muestra un flujo completo de preparación, transformación y visualización.
- Las salidas de los gráficos se guardan como archivos reproducibles.
- Los nombres de las claves devueltas permiten consumir los resultados desde otras funciones.

### Mejoras posibles

1. Añadir `requirements.txt` o `pyproject.toml` para reproducir el entorno.
2. Excluir `__pycache__` de Git mediante `.gitignore`.
3. Reemplazar rutas relativas frágiles con `pathlib` y rutas basadas en la ubicación del módulo.
4. Añadir validación de columnas requeridas antes de ejecutar los análisis.
5. Manejar datasets vacíos antes de usar `mode()[0]` o `idxmax()`.
6. Separar la carga, transformación y visualización en funciones más pequeñas.
7. Cerrar figuras después de guardarlas en ejecuciones automatizadas.
8. Añadir leyendas, nombres de variables más descriptivos y unidades en los gráficos.
9. Documentar que porcentajes y correlaciones describen asociaciones, no relaciones causales.
10. Añadir pruebas de casos límite, como listas con tipos no numéricos o columnas faltantes.
11. Crear una configuración común para evitar repetir nombres de salida y rutas.
12. Incluir imágenes generadas en una carpeta de resultados si se desea documentar visualmente cada ejecución.

## Conclusión

`Exam` representa una colección de ejercicios que resume varias competencias esenciales del análisis de datos con Python. El calculador introduce el razonamiento por ejes de NumPy; el analizador demográfico enseña a convertir preguntas de negocio en filtros y agregaciones; y el visualizador médico muestra cómo preparar variables, eliminar observaciones problemáticas y comunicar relaciones mediante gráficos.

Lo más valioso del conjunto es la combinación entre cálculo y verificación. Cada solución no solo produce un resultado: sus pruebas comprueban que los datos, las etiquetas y la estructura de las figuras coinciden con el objetivo del ejercicio. Esto convierte el examen en una base sólida para pasar de scripts exploratorios a análisis reproducibles.

## Recursos

- [Carpeta Exam en GitHub](https://github.com/AudiForze/freecodecamp/tree/main/Exam)
- [Calculador estadístico](https://github.com/AudiForze/freecodecamp/blob/main/Exam/Mean-Variance-Standard_Deviation_Calculator.py)
- [Demographic Data Analyzer](https://github.com/AudiForze/freecodecamp/tree/main/Exam/Demographic%20Data%20Analyzer)
- [Medical Data Visualizer](https://github.com/AudiForze/freecodecamp/tree/main/Exam/medical%20examination)
- [Certificación Data Analysis with Python](https://www.freecodecamp.org/learn/data-analysis-with-python/)
