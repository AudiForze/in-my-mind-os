related[[Object Oriented Programming in Python]] #programacion #python 
La POO es un paradigma de programación que utiliza "objetos" para diseñar aplicaciones y programas. Los objetos son entidades que combinan datos y comportamiento. Este paradigma se basa en varios conceptos clave:

1. **Clases y Objetos**:
    
    - **Clases**: Una clase es una plantilla o un plano para crear objetos. Define un conjunto de atributos y métodos que los objetos creados a partir de la clase tendrán.
        
    - **Objetos**: Un objeto es una instancia de una clase. Es una entidad concreta que tiene un estado y un comportamiento definidos por la clase.
        
2. **Encapsulación**:
    
    - La encapsulación es el concepto de agrupar datos (atributos) y métodos que operan sobre esos datos en una sola unidad, o clase. También implica restringir el acceso a algunos de los componentes del objeto para proteger el estado interno del mismo.
        
3. **Herencia**:
    
    - La herencia permite crear nuevas clases basadas en clases existentes. La nueva clase hereda atributos y métodos de la clase base, lo que facilita la reutilización del código y la creación de jerarquías de clases.
        
4. **Polimorfismo**:
    
    - El polimorfismo permite que una interfaz única sea utilizada para diferentes tipos de objetos. Esto significa que el mismo método puede comportarse de manera diferente en distintas clases.
        
5. **Abstracción**:
    
    - La abstracción es el proceso de ocultar los detalles complejos de la implementación y mostrar solo la funcionalidad esencial del objeto.

![[Pasted image 20250215213700.png]]

______________________________________________________________________________

```
class Person:
    def set_details(self, name, age):
        self.name = name
        self.age = age

    def display(self):
        print('I am', self.name)

    def greet(self):
        if self.age < 80:
            print('Hello, how are you doing?')
        else:
            print('Hello, how do you do')

p1 = Person()
p2 = Person()

p1.set_details('Bob', 20)
p2.set_details('Ted', 90)

p1.display()
p1.greet()

p2.display()
p2.greet()

```

Este es el Código que vemos en la primera clase sobre introducción a la programación orientada a objetos de python. En este caso tenemos una clase que es **person** y nosotros estamos estableciendo nuevos **objects**. Y utilizamos la siguiente forma para poder estructurar el código y desarrollarlo paso a paso, bajo el contexto de OOP.

- **Definición de la Clase**:

	```
	 class Person:
	```
	Esto define una clase llamada `Person`
	
- **Método** `set_details`:

    ```
    def set_details(self, name, age):
        self.name = name
        self.age = age
    ```
    
    Este método establece los atributos `name` y `age` para una instancia de la clase `Person`.
    
- **Método** `display`:
    
    ```
    def display(self):
        print('I am', self.name)
    ```
    
    Este método imprime el nombre de la persona.
    
- **Método** `greet`:
    
    ```
    def greet(self):
        if self.age < 80:
            print('Hello, how are you doing?')
        else:
            print('Hello, how do you do')
    ```
    
    Este método imprime un saludo basado en la edad de la persona.
    
- **Creación de Instancias y Llamadas a Métodos**:
    
    ```
    p1 = Person()
    p2 = Person()
    
    p1.set_details('Bob', 20)
    p2.set_details('Ted', 90)
    
    p1.display()
    p1.greet()
    
    p2.display()
    p2.greet()
    ```
    
    Se crean dos instancias de la clase `Person` (`p1` y `p2`), se establecen sus detalles y luego se  llaman a los métodos `display` y `greet` para cada instancia.
_______________________________________________________________________________
### First Exam
![[Pasted image 20250215221503.png]]
_______________________________________________________________________________
## **_ Init__ method**
El método `__init__` en Python es un método especial que se ejecuta cuando se crea una nueva instancia de una clase. Se le conoce como el método constructor de la clase.

```
class Perro:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def ladrar(self):
        print(f"{self.nombre} dice: ¡Guau!")

mi_perro = Perro("Max", 5)
mi_perro.ladrar()
```

En este ejemplo, el método `__init__` se utiliza para inicializar los atributos `nombre` y `edad` del objeto `mi_perro` cuando se crea una instancia de la clase `Perro`. Cuando ejecutas `mi_perro.ladrar()`, verás que el perro Max ladra. 🐶

![[Pasted image 20250216121536.png]]
- El trabajo de inicialización se realiza automáticamente por Python si defines el método `__init__`.
    
- En este método puedes crear e inicializar todas tus variables de instancia.
    
- También puedes realizar otras tareas de inicialización.
    
- El primer parámetro de `__init__` es siempre `self`.

_______________________________________________________________________________
