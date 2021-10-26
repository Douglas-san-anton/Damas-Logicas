
### #01 Damas Lógicas

El challenge consiste en armar un juego de [https://es.wikipedia.org/wiki/Damas](Damas) interactivo entre 2 personas (no bots).
Hay que desarrollar la lógica del juego para que entienda las reglas de las Damas y solamente permita hacer movimientos permitidos.

![](https://i.imgur.com/DNgBf6Y.png)

* Armar un tablero tipo grilla de 10x8
* Posicionar las peóns del juego de Damas como corresponda (con un espacio entre cada una en el mismo eje x, sin contacto directo con la siguiente fila), hasta tres filas por lado
* Sistema de turnos (humanos). Primero juegan las blancas y dps las negras
* Hacer las peóns interactivas. Al clickear una te permite moverla hacia los lugares posibles
* Saltar sobre una peón, come la ficha y suma un punto
* Mostrar los puntos en pantalla

## +1
Los siguientes puntos no son necesarios en la entrega, pero sí suman:
* Luego de comer una peón, si tiene la opción de hacer una jugada más de comer peón, poder permitírselo
* Que el tamaño del tablero sea seteable dinámico de `n*8`, definiendo el valor de `n` a través de una variable.
* Botón que resalta la jugada posible que puede comer peón
* Cuando una peón de un equipo llega al otro extremo, que se comporte como una dama (que se pueda mover para cualquier lado)
> La coronación
Si un peón consigue llegar hasta su última línea (primera fila del rival), se convierte automáticamente en Dama. Para distinguirlas del resto de peóns se suele colocar otra peón sobre esta. La dama puede moverse en diagonal hacia delante y hacia atrás todas las casillas que desee en un solo movimiento, siempre y cuando no salte por encima de ninguna de sus propias fichas. Si al finalizar una captura, un peón se convierte en dama esta no puede seguir capturando peóns, y deberá esperar otro turno para hacerlo.

Para iniciar el proyecto basta con clonarlo en tu computador y arrastrar el archivo `Index.html` hacia tu navegador y difrutar de una partida.
