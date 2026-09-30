Una shell o terminal es un programa que interactua entre el sistema operativo y el usuario. Existen diferentes tipos de de shell que se puede verificar en linux con el comando `echo $shell` y podremos ver si es una bash o una zsh.

El diagrama se veria como lo siguiente:
```
Tú
 │
 │ escribes: ls -la
 ▼
Shell
 │
 │ interpreta el comando
 ▼
Sistema operativo
 │
 ▼
Programa/comando
 │
 ▼
Resultado
```

Una terminal es el programa donde se ejecutan estos comando, esto permite interactuar con la shell. Ejemplo:
```
Kitty
  │
  └── Zsh
       │
       ├── ls
       ├── cd
       ├── git
       └── python
```

### ¿Que son los ...rc?

`.bashrc` es un archivo de configuración oculto que se ejecuta de forma automática cada vez que abres una nueva terminal interactiva en sistemas Linux o Unix. Esto mismo pasa con las zsh pero con `zshrc`.

- Permite definir atajos para comandos largos o frecuentes (por ejemplo, `alias ll='ls -la'`).

- **Variables de entorno:** Sirve para configurar rutas como `$PATH` o definir valores personalizados para el sistema o tus herramientas.

- **Funciones de shell:** Permite programar pequeños bloques de código con lógica y argumentos para automatizar tareas en la consola.

- **Personalizar el prompt:** Modifica el aspecto visual, los colores y la información que muestra la línea de comandos. 

### ¿Dónde está y cómo se usa?

- **Ubicación:** Se encuentra en tu directorio de usuario bajo la ruta `~/.bashrc`. Al iniciar con un punto, es un archivo oculto.

- **Cómo editarlo:** Puedes abrirlo con un editor de texto desde la terminal usando un comando como `nano ~/.bashrc`.

### Ejemplo de algunos macros:
```bash
mkcd() {
    mkdir -p "$1"
    cd "$1"
}
```

Este script nos permite crear carpetas y entra dentro de ella al momento, de forma que ya no tendriamos que hacer el proceso de crear la carpeta:
```bash
mkdir -p proyecto
```
Y luego entrar a la carpeta para empezar a trabajar
```bash
cd proyecto
```

> Los $ son los argumentos con los que estamos tratando. 

Los argumentos funcionan así:

```
mi_comando argumento1 argumento2 argumento3
```

Dentro de la función:

```
$1
```

es:

```
argumento1
```

### Otro macro
Uno de mis macros favoritos son la ejecucion de los proyectos con los que trabajo todos los dias o que son de ejecucion locl y de uso continuo. Esto se hace con una simple macro como puede ser:
```
quant() {
    cd ~/Projects/quantlab_app || return
    source .venv/bin/activate
    python app.py
}
```

En este caso, estos comandos me permiten a mi poder ejecutar un programa de forma rapida. Este en especifico primero entra al directorio donde se encuentra mi proyecto con el comando `cd ~/Projects/quantlab_app || return` y luego activamos el env donde trabajaremos `source .venv/bin/activate` y por ultimo ejecuta el archivo principal con el comando `python app.py` .
