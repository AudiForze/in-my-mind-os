La planificación Round Robin es un método que utilizan los sistemas operativos para gestionar el tiempo de ejecución de múltiples procesos que compiten por la atención de la CPU. Se denomina "round robin" porque el sistema rota entre todos los procesos, asignando a cada uno un intervalo de tiempo fijo o "cuanto", independientemente de su prioridad.

El objetivo principal de este método de planificación es garantizar que todos los procesos tengan la misma oportunidad de ejecutarse, promoviendo así la equidad entre las tareas.

Llegada de procesos: Los procesos ingresan al sistema y se colocan en una cola.
Asignación de tiempo: A cada proceso se le asigna una cantidad determinada de tiempo de CPU, denominada cuanto.
Ejecución: El proceso utiliza la CPU durante el tiempo asignado.
Rotación: Si el proceso se completa dentro del tiempo establecido, sale del sistema. De lo contrario, regresa al final de la cola.
Repetir: La CPU continúa recorriendo la cola hasta que todos los procesos se hayan completado.

![[Pasted image 20260915085315.png]]

```
- Create an array ****rem_bt[]**** to keep track of remaining burst time of processes. This array is initially a copy of bt[] (burst times array)
- Create another array ****wt[]**** to store waiting times of processes. Initialize this array as 0.
- Initialize time : t = 0
- Keep traversing all the processes while they are not done. Do following for ****i'th**** process if it is not done yet.
    - If rem_bt[i] > quantum
        - t = t + quantum
        - rem_bt[i] -= quantum;
    - Else // Last cycle for this process
        - t = t + rem_bt[i];
        - wt[i] = t - bt[i]
        - rem_bt[i] = 0; // This process is over
          
```
### Codigo en JAVA
```java 
// Java program for implementation of RR scheduling

public class GFG {
    // Method to find the waiting time for all
    // processes
    static void findWaitingTime(int processes[], int n,
                                int bt[], int wt[],
                                int quantum)
    {
        // Make a copy of burst times bt[] to store
        // remaining burst times.
        int rem_bt[] = new int[n];
        for (int i = 0; i < n; i++)
            rem_bt[i] = bt[i];

        int t = 0; // Current time

        // Keep traversing processes in round robin manner
        // until all of them are not done.
        while (true) {
            boolean done = true;

            // Traverse all processes one by one repeatedly
            for (int i = 0; i < n; i++) {
                // If burst time of a process is greater
                // than 0 then only need to process further
                if (rem_bt[i] > 0) {
                    done = false; // There is a pending
                                  // process

                    if (rem_bt[i] > quantum) {
                        // Increase the value of t i.e.
                        // shows how much time a process has
                        // been processed
                        t += quantum;

                        // Decrease the burst_time of
                        // current process by quantum
                        rem_bt[i] -= quantum;
                    }

                    // If burst time is smaller than or
                    // equal to quantum. Last cycle for this
                    // process
                    else {
                        // Increase the value of t i.e.
                        // shows how much time a process has
                        // been processed
                        t = t + rem_bt[i];

                        // Waiting time is current time
                        // minus time used by this process
                        wt[i] = t - bt[i];

                        // As the process gets fully
                        // executed make its remaining burst
                        // time = 0
                        rem_bt[i] = 0;
                    }
                }
            }

            // If all processes are done
            if (done == true)
                break;
        }
    }

    // Method to calculate turn around time
    static void findTurnAroundTime(int processes[], int n,
                                   int bt[], int wt[],
                                   int tat[])
    {
        // calculating turnaround time by adding
        // bt[i] + wt[i]
        for (int i = 0; i < n; i++)
            tat[i] = bt[i] + wt[i];
    }

    // Method to calculate average time
    static void findavgTime(int processes[], int n,
                            int bt[], int quantum)
    {
        int wt[] = new int[n], tat[] = new int[n];
        int total_wt = 0, total_tat = 0;

        // Function to find waiting time of all processes
        findWaitingTime(processes, n, bt, wt, quantum);

        // Function to find turn around time for all
        // processes
        findTurnAroundTime(processes, n, bt, wt, tat);

        // Display processes along with all details
        System.out.println("PN "
                           + " B "
                           + " WT "
                           + " TAT");

        // Calculate total waiting time and total turn
        // around time
        for (int i = 0; i < n; i++) {
            total_wt = total_wt + wt[i];
            total_tat = total_tat + tat[i];
            System.out.println(" " + (i + 1) + "\t\t"
                               + bt[i] + "\t " + wt[i]
                               + "\t\t " + tat[i]);
        }

        System.out.println("Average waiting time = "
                           + (float)total_wt / (float)n);
        System.out.println("Average turn around time = "
                           + (float)total_tat / (float)n);
    }

    // Driver Method
    public static void main(String[] args)
    {
        // process id's
        int processes[] = { 1, 2, 3 };
        int n = processes.length;

        // Burst time of all processes
        int burst_time[] = { 10, 5, 8 };

        // Time quantum
        int quantum = 2;
        findavgTime(processes, n, burst_time, quantum);
    }
}
```

[LINK](https://www.geeksforgeeks.org/operating-systems/program-for-round-robin-scheduling-for-the-same-arrival-time/)