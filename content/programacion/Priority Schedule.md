La planificación por prioridad es uno de los algoritmos de planificación más comunes que utiliza el sistema operativo para programar procesos según su prioridad. A cada proceso se le asigna un valor de prioridad en función de criterios como los requisitos de memoria, los requisitos de tiempo, las necesidades de otros recursos o la relación entre el tiempo promedio de E/S y el tiempo promedio de ráfaga de CPU.

El proceso con mayor prioridad se selecciona para su ejecución en primer lugar. Si hay varios procesos con la misma prioridad, se programan en el orden en que llegan, siguiendo el principio de primero en llegar, primero en ser atendido. El proceso seleccionado se ejecuta hasta su finalización o hasta que sea interrumpido, según si la programación es con o sin interrupción.

La planificación por prioridades se puede implementar de dos maneras:

- Planificación de prioridades no preemptiva
- Planificación de prioridad preventiva

### Implementacion

1- Primero ingrese los procesos con su tiempo de ráfaga
   y prioridad.
2- Clasificar los procesos, el tiempo de ejecución y la prioridad.
   según la prioridad.
3- Ahora simplemente aplique el algoritmo [[FCFS]]

![[Pasted image 20260915084947.png]]

### Codigo en JAVA
```java 
// Java program for implementation of FCFS
// scheduling
import java.util.*;

class Process {
    int pid; // Process ID
    int bt; // CPU Burst time required
    int priority; // Priority of this process
    Process(int pid, int bt, int priority)
    {
        this.pid = pid;
        this.bt = bt;
        this.priority = priority;
    }
    public int prior() { return priority; }
}

public class GFG {

    // Function to find the waiting time for all
    // processes
    public void findWaitingTime(Process proc[], int n,
                                int wt[])
    {

        // waiting time for first process is 0
        wt[0] = 0;

        // calculating waiting time
        for (int i = 1; i < n; i++)
            wt[i] = proc[i - 1].bt + wt[i - 1];
    }

    // Function to calculate turn around time
    public void findTurnAroundTime(Process proc[], int n,
                                   int wt[], int tat[])
    {
        // calculating turnaround time by adding
        // bt[i] + wt[i]
        for (int i = 0; i < n; i++)
            tat[i] = proc[i].bt + wt[i];
    }

    // Function to calculate average time
    public void findavgTime(Process proc[], int n)
    {
        int wt[] = new int[n], tat[] = new int[n],
            total_wt = 0, total_tat = 0;

        // Function to find waiting time of all processes
        findWaitingTime(proc, n, wt);

        // Function to find turn around time for all
        // processes
        findTurnAroundTime(proc, n, wt, tat);

        // Display processes along with all details
        System.out.print(
            "\nProcesses   Burst time   Waiting time   Turn around time\n");

        // Calculate total waiting time and total turn
        // around time
        for (int i = 0; i < n; i++) {
            total_wt = total_wt + wt[i];
            total_tat = total_tat + tat[i];
            System.out.print(" " + proc[i].pid + "\t\t"
                             + proc[i].bt + "\t " + wt[i]
                             + "\t\t " + tat[i] + "\n");
        }

        System.out.print("\nAverage waiting time = "
                         + (float)total_wt / (float)n);
        System.out.print("\nAverage turn around time = "
                         + (float)total_tat / (float)n);
    }

    public void priorityScheduling(Process proc[], int n)
    {

        // Sort processes by priority
        Arrays.sort(proc, new Comparator<Process>() {
            @Override
            public int compare(Process a, Process b)
            {
                return b.prior() - a.prior();
            }
        });
        System.out.print(
            "Order in which processes gets executed \n");
        for (int i = 0; i < n; i++)
            System.out.print(proc[i].pid + " ");

        findavgTime(proc, n);
    }

    // Driver code
    public static void main(String[] args)
    {
        GFG ob = new GFG();
        int n = 3;
        Process proc[] = new Process[n];
        proc[0] = new Process(1, 10, 2);
        proc[1] = new Process(2, 5, 0);
        proc[2] = new Process(3, 8, 1);
        ob.priorityScheduling(proc, n);
    }
}

// This code is contributed by rahulpatil07109.
```

Orden en que se ejecutan los procesos
1 3 2
Procesos Tiempo de ráfaga Tiempo de espera Tiempo de respuesta
 1 10 0 10
 3 8 10 18
 2 5 18 23
Tiempo de espera promedio = 9,33333
Tiempo de respuesta promedio = 17

[LINK](https://www.geeksforgeeks.org/operating-systems/program-for-priority-cpu-scheduling-set-1/)