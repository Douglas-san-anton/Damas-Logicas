
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

## Entrega

* El tiempo de resolución del challenge son 7 días contando desde el momento que se envió el mismo.
* Se debe enviar la desarrollado vía git.
* El código debe poder ejecutarse y ver la solución funcionando.
* Enviar las instrucciones que sean necesarias para ejecutar la solución, y en caso de que sea oportuno comentarios o consideraciones realizadas sobre la problemática o la forma en la que fue resuelta.

#### Antes de empezar
El ejercicio viene con un proyecto base en React. Puede ser usado este mismo o bien hacer dicho ejercicio en un proyecto base diferente.

Ver el archivo [README-REACT.md](https://github.com/42i-co/challenge-01/blob/master/README-REACT.md) para mas información


### Reglas del Juego

El tablero se coloca entre los dos jugadores de manera que cada uno de ellos tenga una casilla blanca en la parte inferior derecha. Las fichas negras se alinean sobre las casillas negras de las tres primeras filas, y las blancas, en las tres primeras del contrincante; quedan vacías, por tanto, dos hileras centrales. El jugador que juega con blancas comienza la partida moviendo una de sus fichas. Una ficha solo puede desplazarse una casilla a la vez y en diagonal; no puede moverse hacia atrás, ni a derecha o a izquierda.

Las capturas
El peón captura en diagonal, saltando por encima de la ficha contraria que va a ser capturada, cayendo sobre la casilla inmediatamente detrás de ésta (en el sentido de la captura), y siempre que el que captura esté en una casilla adyacente al capturado, y que la casilla inmediatamente detrás de éste esté libre para que acabe el movimiento.

La captura con dama es igual que con peón, aunque puede capturar tanto hacia adelante como hacia atrás. La captura en todos los casos es obligatoria, es decir, si al llegar el turno de un jugador, una o más de sus peóns estuviera en situación de realizar capturas, será obligatorio mover ésta o una de estas peóns y realizar tal captura, no pudiendo optar por mover una peón que no esté en situación de realizar captura. Tanto con dama como con peón, si tras una captura, la peón en cuestión estuviera en situación de realizar una nueva captura, esta se llevará a cabo de forma encadenada, y así sucesivamente mientras se diera tal circunstancia de poder seguir capturando. Su movimiento y su turno terminan cuando ya no hay más peóns para capturar.

#### Final

Una partida termina:

- **En victoria**: cuando un jugador ha capturado todas las fichas del oponente o cuando el otro jugador no puede realizar ningún movimiento.

- **En tablas**: si ningún jugador puede ganar. Algunas veces sucede que ambos contrincantes tienen pocas fichas y son incapaces de atacar con éxito. Es el momento de acabar la partida en tablas. Las tablas son muy frecuentes en el juego de alto nivel.
