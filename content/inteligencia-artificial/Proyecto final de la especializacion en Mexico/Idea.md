La idea se basa en optimizar el algoritmo de búsqueda informada (A*) para resolver el cubo Rubik en el menor tiempo posible sin tomar en consideración el costo o la ruta mas rápida. En este algoritmo vamos a darle un peso a la heurística para hacer que tengamos una búsqueda de rutas mas agresivas.

Eel algoritmo **Weighted A*** (WA*) es una de las variantes más utilizadas del $A^*$ tradicional porque permite un control directo sobre el equilibrio entre la velocidad de computo y la calidad de la ruta (que tan corta es).
### La Diferencia Fundamental

En un algoritmo $A^*$ estándar, la función para elegir el siguiente nodo es:

$$f(n) = g(n) + h(n)$$

Donde $g(n)$ es el costo real recorrido y $h(n)$ es la estimación (heurística) al objetivo.

En **Weighted A***, añadimos un peso ($w$) mayor a 1 a la heurística:

$$f(n) = g(n) + w \cdot h(n)$$

Al multiplicar la heurística, le estamos diciendo al algoritmo: _"Confía más en la dirección hacia la meta que en el costo que llevamos acumulado"_.

----
#### 2. ¿Por qué es más rápido?

El $A^*$ estándar es "admisible", lo que significa que garantiza encontrar la ruta más corta posible. Sin embargo, para lograr esa perfección, debe explorar muchos nodos laterales (lo que consume tiempo y memoria).
Al aumentar el peso ($w$):

- **Comportamiento "Greedy"**: ==El algoritmo se vuelve mas agresivo.== En lugar de explorar todas las opciones posibles, se lanza hacia la meta.
- **Reducción del Espacio de Búsqueda**: Se expanden muchísimos menos nodos, lo que acelera el tiempo de respuesta drásticamente, especialmente en mapas grandes o espacios de estados complejos (como el Cubo de Rubik).
### 3. El Intercambio (Trade-off)

No todo es gratis. Al usar WA*, sacrificas la **optimalidad**:

- **Costo de la solución**: La ruta que encuentres será, como máximo, $w$ veces más larga que la ruta óptima.
    
- **Ejemplo**: Si usas un peso de $w = 2$, el algoritmo podría darte una ruta de 20 metros cuando la mejor era de 11 metros, pero la encontrará en una fracción del tiempo.
- ---

Este algoritmo es perfecto para nuestro objetivo de conseguir la forma mas rápida de resolver un problema del cubo Rubik ya que siempre encuentra la ruta mas rápido aunque estamos sacrificando las bases de la optimización.

# Planteamiento y Resolución del problema

El Weighted A* fue propuesto por Pohl en 1970 como una variante de A* que prioriza la velocidad de exploración frente a la optimalidad estricta. En lugar de la función estándar f(n) = g(n) + h(n), Weighted A* utiliza f(n) = g(n) + w·h(n), donde w ≥ 1 es el factor de ponderación.

Al multiplicar la heurística por w > 1, el algoritmo da mayor peso a la información heurística, incentivando la exploración de nodos que parecen más prometedores según la heurística. Esto produce un algoritmo más greedy que expande menos nodos y encuentra soluciones más rápidamente, pero que puede encontrar soluciones subóptimas. La garantía teórica clave del Weighted A* es que la solución encontrada tiene un costo a lo mucho w veces el costo óptimo: C(solución) ≤ w · C*(óptima). Esta propiedad convierte al Weighted A* en un algoritmo de búsqueda heurística con garantía de aproximación acotada (Likhachev et al., 2003).

En la práctica, estudios empíricos muestran que el Weighted A* con valores moderados de w (entre 1.5 y 3.0) frecuentemente encuentra soluciones apenas marginalmente más largas que el óptimo, pero en una fracción del tiempo computacional. Este comportamiento lo convierte en especialmente valioso para aplicaciones en tiempo real o con restricciones de cómputo

---

## Heurísticas para el Cubo Rubik

El diseño de heurísticas admisibles y bien informadas es crucial para el rendimiento de A* en el Cubo Rubik. Las principales heurísticas estudiadas en la literatura son: (1) Número de stickers fuera de posición dividido entre el máximo que puede corregir un movimiento; (2) Número de piezas (cubitos) mal ubicadas; (3) Pattern Databases (PD), que precomputan distancias exactas para subconjuntos del cubo (Culberson & Schaeffer, 1998); y (4) Heurísticas de aprendizaje automático basadas en redes neuronales profundas (McAleer et al., 2018).

En este proyecto se utiliza la heurística combinada de stickers mal ubicados y cubitos mal ubicados, que es admisible, fácil de calcular en tiempo constante, y proporciona una orientación razonable para la búsqueda sin requerir precomputación extensiva.


