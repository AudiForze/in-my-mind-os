`tcpdump` es una poderosa herramienta de línea de comandos que permite a los usuarios capturar y analizar el tráfico de red en sistemas basados en Unix. 

---------------------------
### Capturar todo el tráfico en una interfaz de red:
Para capturar el tráfico que ocurre en una interfaz de red, ejecutamos el siguiente comando:
```bash
tcpdump -i eth0
```
![[Pasted image 20231224230723.png]]
### Filtrar el tráfico por protocolo:
Indicamos que capture sólo el tráfico de un determinado protocolo de la siguiente forma:
```bash
tcpdump -i eth0 icmp
```
Nos hacemos un ping a nosotros mismos desde otro equipo y habremos capturado el tráfico del protocolo ICMP:
![[Pasted image 20231224231141.png]]

### Guardar la salida en un archivo:
Guardamos el tráfico registrado de la siguiente forma:
```bash
tcpdump -i eth0 -w trafico.pcap
```
![[Pasted image 20231224231317.png]]
### Leer un archivo de captura:
Para leer el contenido de un archivo pcap lo hacemos de la siguiente forma:
```bash
tcpdump -r trafico.pcap
```
![[Pasted image 20231224231410.png]]
