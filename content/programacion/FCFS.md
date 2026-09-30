 [El algoritmo de asignación de tareas en disco](https://www.geeksforgeeks.org/operating-systems/disk-scheduling-algorithms/) **(First Come First Serve, FCFS)**  
es el más sencillo . Como su nombre indica, este algoritmo atiende las solicitudes en el orden en que llegan a la cola del disco. El algoritmo parece muy justo y no hay inanición (todas las solicitudes se atienden secuencialmente), pero, por lo general, no ofrece el servicio más rápido.[](https://www.geeksforgeeks.org/operating-systems/disk-scheduling-algorithms/)

**Algoritmo:** 

1. El array Request representa un array que almacena los índices de las pistas solicitadas en orden ascendente según su hora de llegada. 'head' es la posición del cabezal del disco.
2. Vamos a tomar una por una las pistas en el orden predeterminado y calcular la distancia absoluta de la pista desde la cabeza.
3. Incrementa el contador total de búsquedas con esta distancia.
4. Actualmente, la posición de la vía que recibe servicio se convierte en la nueva posición de la cabeza.
5. Vaya al paso 2 hasta que no se hayan atendido todas las pistas en la matriz de solicitud.

**Ejemplo:**  

```
Ejemplo:  

Entrada:  
Secuencia de solicitud = {176, 79, 34, 60, 92, 11, 41, 114} 
Posición inicial del cabezal = 50 Salida: 
Número total de operaciones de búsqueda = 510 
La secuencia de búsqueda es 
176 
79 
34 
60 
92 
11 
41 
114
```
![[Pasted image 20260915082321.png]]

```
= (176-50)+(176-79)+(79-34)+(60-34)+(92-60)+(92-11)+(41-11)+(114-41) 
= 510
```

### Ejemplo en codigo (java)
```java
// Java program to demonstrate
// FCFS Disk Scheduling algorithm
class GFG
{
static int size = 8;

static void FCFS(int arr[], int head)
{
    int seek_count = 0;
    int distance, cur_track;

    for (int i = 0; i < size; i++) 
    {
        cur_track = arr[i];

        // calculate absolute distance
        distance = Math.abs(cur_track - head);

        // increase the total count
        seek_count += distance;

        // accessed track is now new head
        head = cur_track;
    }

    System.out.println("Total number of " + 
                       "seek operations = " + 
                        seek_count);

    // Seek sequence would be the same
    // as request array sequence
    System.out.println("Seek Sequence is");

    for (int i = 0; i < size; i++)
    {
        System.out.println(arr[i]);
    }
}

// Driver code
public static void main(String[] args) 
{
    // request array
    int arr[] = { 176, 79, 34, 60, 
                  92, 11, 41, 114 };
    int head = 50;

    FCFS(arr, head);
}
}

// This code is contributed by 29AjayKumar
```

[LINK](https://www.geeksforgeeks.org/dsa/fcfs-disk-scheduling-algorithms/)
