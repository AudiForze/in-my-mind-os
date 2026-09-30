La versión preventiva del algoritmo de planificación "Primero el trabajo más corto" (SJF, por sus siglas en inglés) se denomina "Primero el tiempo restante más corto" (SRTF, por sus siglas en inglés). En SRTF, se selecciona el proceso con el menor tiempo restante para su finalización. El proceso en ejecución continúa hasta que finaliza o llega un nuevo proceso con un tiempo restante menor, lo que garantiza que el proceso que finaliza más rápido siempre tenga prioridad.
****Ejemplo:**** Considere la siguiente tabla de tiempo de llegada y tiempo de ráfaga para tres procesos ****P1, P2 y P3**** .

| ****Proceso**** | ****Tiempo de ráfaga**** | ****Hora de llegada**** |
| --------------- | ------------------------ | ----------------------- |
| P1              | 6 ms                     | 0 ms                    |
| P2              | 8 ms                     | 0 ms                    |
| P3              | 5 ms                     | 0 ms                    |

****Ejecución paso a paso:****

1. **Tiempo 0-5 (P3)*** : P3 se ejecuta durante 5 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante.
2. ***Tiempo 5-11 (P1)****: P1 se ejecuta durante 6 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante.
3. ***Tiempo 11-19 (P2)** : P2 se ejecuta durante 8 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante.
Como sabemos,

> - ****Tiempo de respuesta**** = Tiempo de finalización - Tiempo de llegada
> - ****Tiempo de espera**** = Tiempo de respuesta - Tiempo de procesamiento

|Proceso|Hora de llegada<br><br>(EN)|Tiempo de ráfaga<br><br>(BT)|Tiempo de finalización (CT)|Tiempo de respuesta (TAT)|Tiempo de espera (TS)|
|---|---|---|---|---|---|
|P1|0|6|11|11-0 = 11|11-6 = 5|
|P2|0|8|19|19-0 = 19|19-8 = 11|
|P3|0|5|5|5-0 = 5|5-5 = 0|

Ahora, 

> - ****Tiempo de respuesta promedio**** = (11 + 19 + 5)/3 = 11,6 ms
> - ****Tiempo de espera promedio**** = (5 + 0 + 11) / 3 = 16 / 3 = 5,33 ms

### Escenario 2: Procesos con diferentes tiempos de llegada

Considere la siguiente tabla de tiempo de llegada y tiempo de ráfaga para tres procesos P1, P2 y P3.

|****Proceso****|****Tiempo de ráfaga****|****Hora de llegada****|
|---|---|---|
|P1|6 ms|0 ms|
|P2|3 ms|1 ms|
|P3|7 ms|2 ms|

****Ejecución paso a paso:****

1. ****Tiempo 0-1 (P1)**** : P1 se ejecuta durante 1 ms (tiempo total restante: 5 ms) ya que tiene el menor tiempo restante.
2. ****Tiempo 1-4 (P2)**** : P2 se ejecuta durante 3 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante entre P1 y P2.
3. ****Tiempo 4-9 (P1)**** : P1 corre durante 5 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante entre P1 y P3.
4. ****Tiempo 9-16 (P3)**** : P3 se ejecuta durante 7 ms (tiempo total restante: 0 ms) ya que tiene el menor tiempo restante.
## **Implementación del algoritmo SRTF**

***Paso 1:** Introduzca el número de procesos con su tiempo de llegada y tiempo de ráfaga.  
**Paso 2:** Inicialice los tiempos restantes (tiempos de ráfaga), el tiempo actual = 0 y los contadores.  
**Paso 3:*** En cada unidad de tiempo, añada los procesos que hayan llegado a la cola de listos.  
***Paso 4:** Seleccione el proceso con el menor tiempo restante (interrumpa si llega uno más corto).  
**Paso 5:** Ejecute el proceso seleccionado durante 1 unidad, reduzca su tiempo restante e incremente el tiempo actual.  
**Paso 6:*** Si un proceso finaliza:

- Tiempo de respuesta = Tiempo de finalización − Tiempo de llegada
- Tiempo de espera = Tiempo de respuesta − Tiempo de ráfaga

***Paso 7:** Repita los pasos 3 a 6 hasta que todos los procesos se completen.  
***Paso 8:** Calcule el tiempo de espera promedio y el tiempo de respuesta. 
***Paso 9:** Muestre los tiempos de finalización, espera y respuesta para cada proceso, junto con los promedios.
``` java
import java.util.*;

class Process {
    int id, arrivalTime, burstTime, remainingTime, waitingTime, turnaroundTime, completionTime;

    public Process(int id, int arrivalTime, int burstTime) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
    }
}

public class SRTF {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        if (n <= 0) {
            System.out.println("Invalid number of processes.");
            return;
        }

        Process[] processes = new Process[n];

        for (int i = 0; i < n; i++) {
            int arrivalTime = sc.nextInt();
            int burstTime = sc.nextInt();

            if (arrivalTime < 0 || burstTime <= 0) {
                System.out.println("Invalid arrival or burst time for process " + (i + 1));
                return;
            }

            processes[i] = new Process(i + 1, arrivalTime, burstTime);
        }

        Arrays.sort(processes, Comparator.comparingInt(p -> p.arrivalTime));

        int currentTime = 0, completed = 0;

        while (completed < n) {
            int idx = -1;

            for (int i = 0; i < n; i++) {
                if (processes[i].arrivalTime <= currentTime &&
                    processes[i].remainingTime > 0 &&
                    (idx == -1 || processes[i].remainingTime < processes[idx].remainingTime)) {
                    idx = i;
                }
            }

            if (idx != -1) {
                processes[idx].remainingTime--;
                currentTime++;

                if (processes[idx].remainingTime == 0) {
                    processes[idx].completionTime = currentTime;
                    processes[idx].turnaroundTime = currentTime - processes[idx].arrivalTime;
                    processes[idx].waitingTime =
                            processes[idx].turnaroundTime - processes[idx].burstTime;
                    completed++;
                }
            } else {
                currentTime++;
            }
        }

        double totalWT = 0, totalTAT = 0;
        for (Process p : processes) {
            totalWT += p.waitingTime;
            totalTAT += p.turnaroundTime;
            System.out.println("P" + p.id +
                    " CT: " + p.completionTime +
                    " WT: " + p.waitingTime +
                    " TAT: " + p.turnaroundTime);
        }

        System.out.println("Avg WT: " + (totalWT / n));
        System.out.println("Avg TAT: " + (totalTAT / n));
    }
}
```

[LINK](https://www.geeksforgeeks.org/dsa/shortest-remaining-time-first-preemptive-sjf-scheduling-algorithm/)
