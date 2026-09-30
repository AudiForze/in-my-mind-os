Este es un metodo usado por los sistemas operativos para decidir que tarea realizar primero. Cuando la computadora tiene multiples programas abiertos o comando esperando para ser procesados, esta politica de horario elije el proceso de espero con menor tiempo de ejecucion.
![[Pasted image 20260915082709.png]]

SJN es ventajoso por su simplicidad y porque minimiza el tiempo promedio que cada proceso debe esperar hasta que se complete su ejecución. Sin embargo, puede provocar inanición de procesos para aquellos que requieren mucho tiempo para completarse si se agregan continuamente procesos cortos
Otra desventaja de usar SJN es que ==el tiempo total de ejecución de un trabajo debe conocerse antes de su ejecución==. Si bien es imposible predecir el tiempo de ejecución a la perfección, se pueden usar varios métodos para estimarlo, como un promedio ponderado de tiempos de ejecución anteriores. 
![[Pasted image 20260915082932.png]]
$$
Tn+1​=α⋅tn​+(1−α)⋅Tn​
$$
Donde:

- Tn+1​: Predice el tiempo de explosion del proximo proceso
- Tn: Predice el tiempo de explosion del proceso anterior.
- tn: Actual burst time of the previous process.
- α: Smoothing factor (0 ≤ α ≤ 1).

****Example:**** Consider the following table of arrival time and burst time for three processes ****P1, P2 and P3****.

|****Process****|****Burst Time****|****Arrival Time****|
|---|---|---|
|P1|6 ms|0 ms|
|P2|8 ms|2 ms|
|P3|3 ms|4 ms|

****Step-by-Step Execution:****

1. **Time 0-6 (P1)****: P1 runs for 6 ms (total time left: 0 ms)
2. ***Time 6-9 (P3)****: P3 runs for 3 ms (total time left: 0 ms)
3. **Time 9-17 (P2)**: P2 runs for 8 ms (total time left: 0 ms)
```java 
import java.io.*
import java.util.*;

public class Main {
    public static void main(String[] args)
    {
        Scanner input = new Scanner(System.in);
        int n;
        // Matrix for storing Process Id, Burst
        // Time, Average Waiting Time & Average
        // Turn Around Time.
        int[][] A = new int[100][4];
        int total = 0;
        float avg_wt, avg_tat;
        System.out.println("Enter number of process:");
        n = input.nextInt();
        System.out.println("Enter Burst Time:");
        for (int i = 0; i < n; i++) {
            // User Input Burst Time and alloting
            // Process Id.
            System.out.print("P" + (i + 1) + ": ");
            A[i][1] = input.nextInt();
            A[i][0] = i + 1;
        }
        for (int i = 0; i < n; i++) {
            // Sorting process according to their
            // Burst Time.
            int index = i;
            for (int j = i + 1; j < n; j++) {
                if (A[j][1] < A[index][1]) {
                    index = j;
                }
            }
            int temp = A[i][1];
            A[i][1] = A[index][1];
            A[index][1] = temp;
            temp = A[i][0];
            A[i][0] = A[index][0];
            A[index][0] = temp;
        }
        A[0][2] = 0;
        // Calculation of Waiting Times
        for (int i = 1; i < n; i++) {
            A[i][2] = 0;
            for (int j = 0; j < i; j++) {
                A[i][2] += A[j][1];
            }
            total += A[i][2];
        }
        avg_wt = (float)total / n;
        total = 0;
        // Calculation of Turn Around Time and printing the
        // data.
        System.out.println("P\tBT\tWT\tTAT");
        for (int i = 0; i < n; i++) {
            A[i][3] = A[i][1] + A[i][2];
            total += A[i][3];
            System.out.println("P" + A[i][0] + "\t"
                               + A[i][1] + "\t" + A[i][2]
                               + "\t" + A[i][3]);
        }
        avg_tat = (float)total / n;
        System.out.println("Average Waiting Time= "
                           + avg_wt);
        System.out.println("Average Turnaround Time= "
                           + avg_tat);
    }
}
```

[LINK](https://www.geeksforgeeks.org/dsa/program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive/)
