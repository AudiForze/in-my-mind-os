El artículo aborda los algoritmos de búsqueda heurística en Inteligencia Artificial, centrándose específicamente en las variantes del algoritmo $A^{*}$ conocidas como **$A^{*}$ ponderado** (weighted $A^{*}$), las cuales relajan la búsqueda exacta para ganar velocidad a cambio de una suboptimalidad acotada. Sus aportes principales son:

- **Una visión unificada:** Presenta los resultados anteriores de diversos autores sobre el $A^{*}$ ponderado bajo un marco formal común.
    
- **Nueva cota de suboptimalidad:** Deriva una cota general para la suboptimalidad de los resultados cuando se evita reabrir estados ya expandidos.
    
- **Minimización de Diagramas de Decisión Binaria (BDD):** Introduce este problema (proveniente del diseño de hardware VLSI) como un nuevo campo de aplicación para las búsquedas heurísticas, comparándolo con métodos tradicionales como _Simulated Annealing_ y algoritmos genéticos.
    
- **Pruebas en planificación:** Evalúa el rendimiento de estas técnicas en problemas de planificación clásica bajo el estándar STRIPS.

El documento fue escrito por Rüdiger Ebendt y Rolf Drechsler
![[1-s2.0-S000437020900068X-main.pdf]]