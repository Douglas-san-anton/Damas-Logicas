// VARIABLES GLOBALES

var turno = 1
var fichasBlancas = document.getElementsByClassName('damasBlancas')
var fichasRojas = document.getElementsByClassName('damasRojas')
var jugador1 = document.getElementById('jugador1')
var jugador2 = document.getElementById('jugador2')
var nombreJugador1 = document.getElementById('nombreJugador1')
var nombreJugador2 = document.getElementById('nombreJugador2')
var parrafoPuntosJugador1 = document.getElementById('puntos-jugador1')
var parrafoPuntosJugador2 = document.getElementById('puntos-jugador2')
var eventosALasDamas = true

var damaSelec = {
  idFila: null,
  idColumna: null,
  esRey: false,
  movIzq: false,
  movDer: false,
  movComerIzq: false,
  movComerDer: false,
  movPintarIzq: null,
  movPintarDer: null,
  movComerDerPintado: null,
  movComerIzqPintado: null,
  movFilaPintar: null,
  movFilaComerPintado: null,
}

var MovimientosPermitidos = {
  SeguirMovDer: true,
  SeguirMovIzq: true,
  SeguirMovComerIzqArriba: true,
  SeguirMovComerIzqAbajo: true,
  SeguirMovComerDerArriba: true,
  SeguirMovComerDerAbajo: true,
  SeguirEnTurno: false,
  TurnoAnteriorComio: false,
}

// TABLERO

//original
var tableroArray = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ]

function crearTablero() {
  var tablero = document.getElementById('tablero')

  var contador = 0

  for (let i = 0; i < 8; i++) { //creacion de filas
    var newDivFila = document.createElement('div')
    newDivFila.className = 'fila fila-' + i
    tablero.appendChild(newDivFila)

    contador = i % 2

    for (let j = 0; j < 10; j++) { //creacion de columnas
      var newDivCell = document.createElement('div')

      if (contador === 0) {
        newDivCell.className = 'casillasBlancas'
        contador++
      } else {
        newDivCell.className = 'casillasNegras'
        contador--
      }

      newDivCell.id = 'fila-' + i + '-col-' + j
      newDivFila.appendChild(newDivCell)
    }
  }
  crearDamas()
}
crearTablero()

///////////////////////////////////////////////////////////

function crearDamas() {
  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 12; k++) { // andan las damas
      var DivCelda = document.getElementById('fila-' + i + '-col-' + k)

      if (tableroArray[i][k] === 1) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasBlancas'
        DivCelda.appendChild(NewDama)
      }
      if (tableroArray[i][k] === 2) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasRojas'
        DivCelda.appendChild(NewDama)
      }
      if (tableroArray[i][k] === 11) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasBlancas rey'
        DivCelda.appendChild(NewDama)
      }
      if (tableroArray[i][k] === 22) {
        var NewDama = document.createElement('div')
        NewDama.className = 'damasRojas rey'
        DivCelda.appendChild(NewDama)
      }
    }
  }
}

///////////////////////////////////////////////////////////

function agregarEvento() {  //Agrega los eventos clicks a las damas del turno activo
  if (eventosALasDamas === true) {
    if (turno === 1) {
      for (var i = 0; i < fichasBlancas.length; i++) {
        fichasBlancas[i].addEventListener('click', obtenerFichaSeleccionada)
      }
    } else {
      for (var i = 0; i < fichasRojas.length; i++) {
        fichasRojas[i].addEventListener('click', obtenerFichaSeleccionada)
      }
  }
  }
}

////////////////////////////////////////////////////////////

function obtenerFichaSeleccionada(ev) {
  resetearTablero()
  damaSelec.idFila = parseInt(ev.path[1].id.substring(5, 6))
  damaSelec.idColumna =  parseInt(ev.path[1].id.substring(11, 12))

  if (ev.target.classList.contains('rey')) {
    damaSelec.esRey = true;
  }
  else{
    damaSelec.esRey = false;
  }
  aggMovAFichaSeleccionada()
}

////////////////////////////////////////////////////////////

function aggMovAFichaSeleccionada(){
  if (damaSelec.esRey === false) {
    resetearObjMovPermitidos(1) //funcion que resetea el objeto que utilizamos para saber si se puede seguir con el movimiento, o ya hay una obstruccion
    buscarEspaciosDisponibles(damaSelec.idFila, damaSelec.idColumna, 1, 1)
  }
  else{ //Si la dama seleccionada es rey
    resetearObjMovPermitidos(1)
    for (let a = 1; a < 10; a++) { //Utilizamos el "for" para recorrer el tablero en forma diagonal a la dama seleccionada
      buscarEspaciosDisponibles(damaSelec.idFila, damaSelec.idColumna, a, -a) //Se utiliza el "-a" para las filas inversas al sentido de las damas comunes
    }
    resetearObjeto();
    resetearObjMovPermitidos(-1)
    for (let a = 1; a < 10; a++) {
      buscarEspaciosDisponibles(damaSelec.idFila, damaSelec.idColumna, a, a) //En este for se utiliza las a para seguir diagonalmente el sentido de las dama comun
    }
  }

  if (MovimientosPermitidos.TurnoAnteriorComio === true && MovimientosPermitidos.SeguirMovComerDerArriba === true && MovimientosPermitidos.SeguirMovComerDerAbajo === true && MovimientosPermitidos.SeguirMovComerIzqArriba === true && MovimientosPermitidos.SeguirMovComerIzqAbajo === true) {
   //Si comio, y no encuentra ninguna dama para volver a comer, se cambia de turno
    cambiarTurno()
    resetearTablero()
  }
}

////////////////////////////////////////////////////////////

function buscarEspaciosDisponibles(fila, columna, aMoverColumna, aMoverFila) {
  damaSelec.movPintarIzq = columna - aMoverColumna
  damaSelec.movPintarDer = columna + aMoverColumna

  if (turno === 1) {
    damaSelec.movFilaPintar = fila + aMoverFila
  } else {
    damaSelec.movFilaPintar = fila - aMoverFila
  }
  if (MovimientosPermitidos.TurnoAnteriorComio === false) {
    if (MovimientosPermitidos.SeguirMovDer === true) { //Si la dama no se encontro con ninguna obstruccion anteriormente
      if (damaSelec.movPintarDer <= 9 && damaSelec.movFilaPintar <= 9 && damaSelec.movFilaPintar >= 0) { //Validamos que los movimientos no excedan el tablero
        if (tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarDer] === null) { //Verificamos que el espacio de la derecha a mover sea nulo

            damaSelec.movDer = true

            var divPintar = document.getElementById('fila-' +damaSelec.movFilaPintar +'-col-' +damaSelec.movPintarDer)
            divPintar.style.backgroundColor = '#79D0F2'

        }
        else{
          MovimientosPermitidos.SeguirMovDer = false //Si se encuentra con una dama, esta dejara de verificar movimientos
          damaSelec.movDer = false //Si se encuentra con una obstruccion, no se le asignara el evento a la derecha en AgregarClicksPosibles()
        }
      } else{
        damaSelec.movDer = false //Si se excede del tablero, no se le asignara el evento a la derecha en AgregarClicksPosibles()
      }
    }
    if (MovimientosPermitidos.SeguirMovIzq === true) { //Si la dama no se encontro con ninguna obstruccion anteriormente
      if (damaSelec.movPintarIzq >= 0 && damaSelec.movFilaPintar >= 0  && damaSelec.movFilaPintar <= 9) { //Validamos que los movimientos no excedan el tablero
        if (tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarIzq] === null) { //Verificamos que el espacio de la derecha a mover sea nulo

            damaSelec.movIzq = true

            var divPintar = document.getElementById('fila-' + damaSelec.movFilaPintar +'-col-' + damaSelec.movPintarIzq)
            divPintar.style.backgroundColor = '#79D0F2'
        }
        else{
          MovimientosPermitidos.SeguirMovIzq = false //Si se encuentra con una dama, esta dejara
          damaSelec.movIzq = false //Si se encuentra con una obstruccion, no se le asignara el evento a la derecha en AgregarClicksPosibles()
        }
      } else{
        damaSelec.movIzq = false //Si se excede del tablero, no se le asignara el evento a la derecha en AgregarClicksPosibles()
      }
    }
  }

  if (turno === 1) {
    if (aMoverFila > 0 || damaSelec.esRey === false) {
      damaSelec.movFilaComerPintado = damaSelec.idFila + aMoverFila + 1  //Si el movimiento de fila sigue el sentido de la dama comun o no es rey
    }
    else{
      damaSelec.movFilaComerPintado = damaSelec.idFila + aMoverFila - 1  //Si el movimiento de fila sigue el sentido inverso de la dama comun y es rey
    }
  }else {
      if (aMoverFila > 0 || damaSelec.esRey === false) {
        damaSelec.movFilaComerPintado = damaSelec.idFila - aMoverFila - 1 //Si el movimiento de fila sigue el sentido de la dama comun o no es rey
      }
      else{
        damaSelec.movFilaComerPintado = damaSelec.idFila + (-(aMoverFila)) + 1 //Si el movimiento de fila sigue el sentido inverso de la dama comun y es rey
      }
  }
  comprobarComer(aMoverFila, aMoverColumna) //Comprueba comer en sentido comun

  if (tableroArray[damaSelec.idFila][damaSelec.idColumna] === 11 || tableroArray[damaSelec.idFila][damaSelec.idColumna] === 22) {
    damaSelec.esRey = true
  }
  if (damaSelec.esRey === false) {
    resetearObjeto(); //se resetean los valores de comer izquierda o derecha
    if (turno === 1) {
      damaSelec.movFilaComerPintado = damaSelec.idFila - aMoverFila - 1
      damaSelec.movFilaPintar = damaSelec.idFila - aMoverFila
    } else{
      damaSelec.movFilaComerPintado = damaSelec.idFila + aMoverFila + 1
      damaSelec.movFilaPintar = damaSelec.idFila + aMoverFila
    }
    // comprobarComer(aMoverFila, aMoverColumna) //Comprueba comer en sentido contrario al turno, siendo una ficha comun
  }
}

////////////////////////////////////////////////////////////

function comprobarComer(aMoverFila, aMoverColumna) {
  var damaEnemiga = 0
  var damaEnemigaRey = 0

  damaSelec.movComerDerPintado = damaSelec.idColumna + aMoverColumna +  1
  damaSelec.movComerIzqPintado = damaSelec.idColumna - aMoverColumna -  1

  if (damaSelec.movFilaPintar >= 0 && damaSelec.movFilaPintar <= 9) { //Validamos que el posible movimiento no se exceda del tablero
    if (turno === 1) {
      damaEnemiga = 2
      damaEnemigaRey = 22
    }else {
      damaEnemiga = 1
      damaEnemigaRey = 11
    }

    if (MovimientosPermitidos.SeguirMovComerDerArriba === true || MovimientosPermitidos.SeguirMovComerDerAbajo === true) { //Validamos que si encuentra una ficha para comer, termine en la posicion actual la validacion
      if (damaSelec.movComerDerPintado <= 9 && damaSelec.movFilaComerPintado <= 9 && damaSelec.movFilaComerPintado >= 0) {   //Validamos que el posible movimiento no se exceda del tablero

        if ((tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarDer] === damaEnemiga || tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarDer] === damaEnemigaRey) && tableroArray[damaSelec.movFilaComerPintado][damaSelec.movComerDerPintado] === null) {
          //Verificamos que la dama a la derecha tenga una dama enemiga (comun o rey) y el espacio siguiente sea nulo
          damaSelec.movComerDer = true
          MovimientosPermitidos.SeguirMovDer = false //Si esta permitido comer, ya no se seguira movimiento a la derecha
          var divPintar = document.getElementById('fila-' + damaSelec.movFilaComerPintado +'-col-' +damaSelec.movComerDerPintado)
          divPintar.style.backgroundColor = '#79D0F2'

          if (aMoverFila > 0) { // si la fila a mover es mayor a 0
            if (turno === 1) { //si es turno 1, el amoverFila se le suma al id por lo que el comerDer es sentido normal(para abajo)
              MovimientosPermitidos.SeguirMovComerDerAbajo = false // se utiliza para terminar la verificacion del comprobar comer hacia la derecha
            } else{
              MovimientosPermitidos.SeguirMovComerDerArriba = false
            }
          } else{
            if (turno === 1) {
              MovimientosPermitidos.SeguirMovComerDerArriba = false
            } else{
                MovimientosPermitidos.SeguirMovComerDerAbajo = false
            }
          }
        } else{
          damaSelec.movComerDer = false //si se encuentra una dama enemiga en el espacio de la derecha pero existe otra dama atras de esta que la impide comer
        }
      } else{
          damaSelec.movComerDer = false // si se excede del limite del tablero, no se puede comer, osea cuando la ficha esta cerca de una punta
      }
    } else {
      damaSelec.movComerDer = false // cuando encotro para comer para abajo y para arriba
    }

    if (MovimientosPermitidos.SeguirMovComerIzqArriba === true || MovimientosPermitidos.SeguirMovComerIzqAbajo === true) { //Validamos que si encuentra una ficha para comer, termine en la posicion actual la validacion
      if (damaSelec.movComerIzqPintado >= 0 && damaSelec.movFilaComerPintado <= 9 && damaSelec.movFilaComerPintado >= 0) { //Validamos que el posible movimiento no se exceda del tablero
        if ((tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarIzq] === damaEnemiga || tableroArray[damaSelec.movFilaPintar][damaSelec.movPintarIzq] === damaEnemigaRey) && tableroArray[damaSelec.movFilaComerPintado][damaSelec.movComerIzqPintado] === null) {
          //Verificamos que la dama a la derecha tenga una dama enemiga (comun o rey) y el espacio siguiente sea nulo
          damaSelec.movComerIzq = true
          MovimientosPermitidos.SeguirMovIzq = false //Si esta permitido comer, ya no se seguira movimiento a la izquierda

          var divPintar = document.getElementById('fila-' +  damaSelec.movFilaComerPintado +'-col-' +damaSelec.movComerIzqPintado)
          divPintar.style.backgroundColor = '#79D0F2'

          if (aMoverFila > 0) {
            if (turno === 1) {
            MovimientosPermitidos.SeguirMovComerIzqAbajo = false
            } else{
              MovimientosPermitidos.SeguirMovComerIzqArriba = false
            }
          } else{
            if (turno === 1) {
              MovimientosPermitidos.SeguirMovComerIzqArriba = false
            } else{
                MovimientosPermitidos.SeguirMovComerIzqAbajo = false
            }
          }
        } else{
          damaSelec.movComerIzq = false //si se encuentra una dama enemiga en el espacio de la izquierda pero existe otra dama atras de esta que la impide comer
        }
      }
      else{
        damaSelec.movComerIzq = false //Si no se encuentra dama enemiga en el espacio a la izquierda o se encuentra pero el proximo no es nulo, no se permitira comer
      }
    } else {
      damaSelec.movComerIzq = false // cuando encotro para comer para abajo y para arriba
    }
  }

  agregarClickPosiblesMov(aMoverFila, aMoverColumna);
}

////////////////////////////////////////////////////////////

function agregarClickPosiblesMov(aMoverFila, aMoverColumna) {
  //Utilizamos esta funcion para asignarle eventos a los posibles movimientos corroborados en las funciones anteriores
  if (damaSelec.movIzq) {
    var divMover = document.getElementById('fila-' +damaSelec.movFilaPintar +'-col-' + damaSelec.movPintarIzq)
    divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaPintar + ',' + damaSelec.movPintarIzq +', "",' + aMoverFila + ',' + aMoverColumna + ')')
  }
  if (damaSelec.movDer) {
    var divMover = document.getElementById('fila-' + damaSelec.movFilaPintar +'-col-' + damaSelec.movPintarDer)
    divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaPintar + ',' + damaSelec.movPintarDer + ', "",' + aMoverFila + ',' + aMoverColumna +')')
  }

  if (damaSelec.movComerDer) {
    var divMover = document.getElementById('fila-' + damaSelec.movFilaComerPintado +'-col-' + damaSelec.movComerDerPintado)
    if (damaSelec.idFila > damaSelec.movFilaComerPintado) { //verificamos para que lado va el movimiento. Y  le damos el atributo derecha arriba o abajo, dependiendo de este
      if (damaSelec.esRey === true && turno === 1) {
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerDerPintado + ', "derechaArriba",' + aMoverFila + ',' + aMoverColumna +')')
      } else{
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerDerPintado + ', "derechaArriba",' + (-aMoverFila) + ',' + aMoverColumna +')')
      }
    } else{
      if (damaSelec.esRey === true && turno === 2) {
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerDerPintado + ', "derechaAbajo",' + (-aMoverFila) + ',' + aMoverColumna +')')
      } else{
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerDerPintado + ', "derechaAbajo",' + aMoverFila + ',' + aMoverColumna +')')
      }
    }
  }
  if (damaSelec.movComerIzq) { //verificamos para que lado va el movimiento. Y le damos el atributo derecha arriba o abajo, dependiendo de este
    var divMover = document.getElementById('fila-' + damaSelec.movFilaComerPintado +'-col-' + damaSelec.movComerIzqPintado)
    if (damaSelec.idFila > damaSelec.movFilaComerPintado) {
      if (damaSelec.esRey === true && turno === 1) {
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerIzqPintado +', "izquierdaArriba",' + aMoverFila + ',' + aMoverColumna +')')
      } else{
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerIzqPintado +', "izquierdaArriba",' + (-aMoverFila) + ',' + aMoverColumna +')')
      }
    } else{
      if (damaSelec.esRey === true && turno === 2) {
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerIzqPintado +', "izquierdaAbajo",' + (-aMoverFila) + ',' + aMoverColumna +')') 
      } else{
        divMover.setAttribute('onClick', 'moverFicha(' + damaSelec.movFilaComerPintado + ',' + damaSelec.movComerIzqPintado +', "izquierdaAbajo",' + aMoverFila + ',' + aMoverColumna +')') 
      }
    }
  }
}

////////////////////////////////////////////////////////////

function moverFicha(filaMover, columnaMover, tipoMovimiento, aMoverFila, aMoverColumna) {
  if (!((MovimientosPermitidos.SeguirMovComerDerArriba === false || MovimientosPermitidos.SeguirMovComerDerAbajo=== false
      || MovimientosPermitidos.SeguirMovComerIzqArriba === false || MovimientosPermitidos.SeguirMovComerIzqAbajo === false )
      && tipoMovimiento === "")) {
    //"if" verificando si la ficha tiene posibles movimientos de comer hacia la derecha o izquierda, pero hace un movimiento comun

    var divPadre = document.getElementById('fila-' + filaMover +'-col-' + columnaMover) //Guardo la casilla donde iria la dama despues de comer
    var newDama = document.createElement('div') //creo la dama nueva

    if (turno === 1) {
      newDama.className = 'damasBlancas'
      if (tableroArray[damaSelec.idFila][damaSelec.idColumna] === 11) { //Si la dama es rey, va a tener 11 el tablero
        tableroArray[filaMover][columnaMover] = 11;
      }else{
        tableroArray[filaMover][columnaMover] = 1; //Si la dama es comun tiene un 1
      }
    } else {
      newDama.className = 'damasRojas'
      if (tableroArray[damaSelec.idFila][damaSelec.idColumna] === 22) { //Si la dama es rey, va a tener 22 en el tablero
        tableroArray[filaMover][columnaMover] = 22;
      }else{
        tableroArray[filaMover][columnaMover] = 2; //Si la dama es comun tiene un 1
      }
    }

    if ((filaMover === 0 && turno === 2) || (filaMover === 7 && turno === 1)) { //Si la dama llega al final del tablero se tiene que convertir en rey
      if (damaSelec.esRey === false) {
        newDama.classList.add('rey') //Una vez que llego a cualquiera de las dos filas (0 o 9) se le asigna la clase rey
        if (turno === 1) {
          tableroArray[filaMover][columnaMover] = 11; //Una vez que se convierte en rey deja de tener 1 y pasa a tener 11
        }
        else{
          tableroArray[filaMover][columnaMover] = 22; //Una vez que se convierte en rey deja de tener 2 y pasa a tener 22
        }
      }
    }
    divPadre.appendChild(newDama) //Asigno la dama a la casilla correspondiente

    var divViejo = document.getElementById('fila-' + damaSelec.idFila +'-col-' +  damaSelec.idColumna) //Obtengo la casilla de la dama seleccionada antes del movimiento
    divViejo.innerHTML = '' //Elimino la dama de la casilla antigua
    tableroArray[damaSelec.idFila][damaSelec.idColumna] = null;  //Elimino la dama antigua del tablero

    //ELIMINACION DE LA FICHA DEL USUARIO CONTRARIO SI LO COME
    var fila = 0
    fila = damaSelec.idFila + aMoverFila //Guardo la fila del enemigo si es abajo

    if (tipoMovimiento == 'izquierdaArriba' || tipoMovimiento == 'izquierdaAbajo') { //Verifico si el movimiento a comer es hacia la izquierda 
      var divEnemigo = document.getElementById('fila-' + (fila)  +'-col-' +  (damaSelec.idColumna - aMoverColumna)) //obtengo el div de la casilla en la cual esta la dama enemiga
      divEnemigo.innerHTML = '' //Elimino la dama enemiga
      tableroArray[fila][damaSelec.idColumna - aMoverColumna] = null //Eliminacion logica de la dama enemiga
      MovimientosPermitidos.SeguirEnTurno = true;
    }
    if (tipoMovimiento == 'derechaArriba' || tipoMovimiento == 'derechaAbajo') { //Verifico si el movimiento a comer es hacia la derecha
      var divEnemigo = document.getElementById('fila-' + (fila)  +'-col-' +  (damaSelec.idColumna + aMoverColumna)) //obtengo el div de la casilla en la cual esta la dama enemiga
      divEnemigo.innerHTML = '' //Elimino la dama enemiga
      tableroArray[fila][damaSelec.idColumna + aMoverColumna] = null //Eliminacion logica de la dama enemiga
      MovimientosPermitidos.SeguirEnTurno = true;
    }
  }

  //VERIFICACION SI EL TURNO QUE SIGUE PUEDE SEGUIR MOVIENDO O NO
  if (MovimientosPermitidos.SeguirEnTurno === true && (tipoMovimiento == 'derechaArriba' || tipoMovimiento == 'derechaAbajo' || tipoMovimiento == 'izquierdaArriba' || tipoMovimiento == 'izquierdaAbajo')) {
    MovimientosPermitidos.TurnoAnteriorComio = true
  } else{
    MovimientosPermitidos.TurnoAnteriorComio = false
  }

  cambiarTurno()
  actualizarPuntos()
  resetearTablero(filaMover, columnaMover)
}

////////////////////////////////////////////////////////////

function resetearTablero(filaMover, columnaMover) {
  var tablero = document.getElementById('tablero')

  tablero.innerHTML = ''

  crearTablero() //Creacion de tablero

  if (eventosALasDamas === true) {
    if (MovimientosPermitidos.SeguirEnTurno === true) { //Si el turno no sigue, sigue el curso normal
      damaSelec.idFila = filaMover
      damaSelec.idColumna = columnaMover
      aggMovAFichaSeleccionada()
    } else{
      resetearObjeto() //Reseteo del objeto que comprende todos los movimientos de la dama seleccionada
    }
    agregarEvento()
  }
}

////////////////////////////////////////////////////////////

function actualizarPuntos() {
  parrafoPuntosJugador1.innerHTML = 16 - fichasRojas.length
  parrafoPuntosJugador2.innerHTML = 16 - fichasBlancas.length

  if (fichasRojas.length === 1) {
    setTimeout(()=>{
      swal('¡Felicitaciones ' + nombreJugador1.innerHTML + ' ganaste la partida!')
    },100)
    eventosALasDamas = false
    guardarHistorial()
  }
  if (fichasBlancas.length === 1) {
    setTimeout(()=>{
      swal('¡Felicitaciones ' + nombreJugador2.innerHTML + ' ganaste la partida!')
    },100)
    eventosALasDamas = false
    guardarHistorial()
  }
}

////////////////////////////////////////////////////////////

function cambiarTurno(){
  if (MovimientosPermitidos.SeguirEnTurno === false) {
    if (turno === 1) {
      turno++
      jugador1.style.boxShadow = 'none'
      jugador2.style.boxShadow = '0 0 10px red'

    } else{
      turno--
      jugador1.style.boxShadow = '0 0 10px red'
      jugador2.style.boxShadow = 'none'
    }
    resetearObjeto()
    MovimientosPermitidos.TurnoAnteriorComio = false
    esEmpate()
  }
}

////////////////////////////////////////////////////////////

function resetearObjeto() {
  if (MovimientosPermitidos.SeguirEnTurno === true) {
    damaSelec.esRey = false
  }

  damaSelec.movComerDerPintado = null
  damaSelec.movComerIzqPintado = null
  damaSelec.movFilaPintar = null
  damaSelec.movFilaComerPintado = null

  damaSelec.movIzq = false
  damaSelec.movDer = false
  damaSelec.movComerIzq = false
  damaSelec.movComerDer = false
}

////////////////////////////////////////////////////////////

function resetearObjMovPermitidos(BusquedaAnteriores){
  //La busquedaAnterior va a ser 1 si es una ficha comun o si ya paso el turno, y -1 si la dama clickeada es reina (para buscar los datos inversos sin eliminar los datos de las casillas inversa del sentido comun del turno)
  MovimientosPermitidos.SeguirMovDer = true
  MovimientosPermitidos.SeguirMovIzq = true
  if (BusquedaAnteriores === 1) {
    MovimientosPermitidos.SeguirMovComerIzqArriba = true
    MovimientosPermitidos.SeguirMovComerDerArriba = true
    MovimientosPermitidos.SeguirMovComerIzqAbajo = true
    MovimientosPermitidos.SeguirMovComerDerAbajo = true
    MovimientosPermitidos.SeguirEnTurno = false
  }
}

////////////////////////////////////////////////////////////

function esEmpate(){
  var arribaDer = false, arribaIzq = false, abajoIzq = false, abajoDer = false
  var ReyesBlancosLength = 0, ReyesRojasLenght = 0, damasBlancasLenght = 0, damasRojasLenght = 0
  var fichaEnemiga = 0, fichaEnemigaRey = 0, contadorTrues = 0
  var arrayEmpate = []

  if(turno === 1){
    fichaEnemiga = 2
    fichaEnemigaRey = 22
  } else{
    fichaEnemiga = 1
    fichaEnemigaRey = 11
  }

  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 8; k++) {
      arribaDer = false, arribaIzq = false, abajoDer = false, arribaIzq = false //Reseteamos las variables

      if (tableroArray[i][k] === 11) { //Contamos la cantidad de reyes que hay
        ReyesBlancosLength++
      }
      if (tableroArray[i][k] === 22) {
        ReyesRojasLenght++
      }
      if (tableroArray[i][k] === 1) { //Contamos la cantidad de damas comunes que hay
        damasBlancasLenght++
      }
      if (tableroArray[i][k] === 2) {
        damasRojasLenght++
      }

      if (tableroArray[i][k] === turno || tableroArray[i][k] === (turno*11)) { //Verificamos que en esa casilla haya una dama comun o rey del turno actual
        try {
          if(tableroArray[i-1][k-1] === fichaEnemiga || tableroArray[i-1][k-1] === (fichaEnemigaRey)){ //verificamos en su proxima casillas, 1 casilla arriba de la suya, si hay un enemigo
            if(tableroArray[i-2][k-2] === fichaEnemiga || tableroArray[i-2][k-2] === (fichaEnemigaRey) || tableroArray[i-2][k-2] === undefined){//varificamos en su segunda casilla, 2 casillas arriba de la suya, si hay un enemigo o se excede del tablero
              arribaIzq = true //si hay un enemigo en su casilla proxima de arriba y otro enemigo lo obstruye de comerlo
            } else{
              arribaIzq = false //si hay un enemigo en su casilla proxima de arriba y puede comer
            }
          } else{
            if(tableroArray[i-1][k-1] === turno || tableroArray[i-1][k-1] === undefined){ //verificamos en su proxima casilla si existe una dama de su proximo equipo o se excede del tablero
              arribaIzq = true
            } else{
              if ((turno === 2 && tableroArray[i][k] === 2) || tableroArray[i][k] === 11) { //verificamos que si es el turno del verde y no es reina, esta atrapada de arriba izq, ya que no se puede mover a ese lado
                arribaIzq = false
              } else{
                arribaIzq = true
              }
            }
          }
        } catch (error) {
          arribaIzq = true
        }

        try {
          if(tableroArray[i-1][k+1] === fichaEnemiga || tableroArray[i-1][k+1] === (fichaEnemigaRey)){
            if(tableroArray[i-2][k+2] === fichaEnemiga || tableroArray[i-2][k+2] === (fichaEnemigaRey) || tableroArray[i-2][k+2] === undefined){
              arribaDer = true
            } else{
              arribaDer = false
            }
          } else{
            if(tableroArray[i-1][k+1] === turno || tableroArray[i-1][k+1] === undefined){
              arribaDer = true
            } else{
              if ((turno === 2 && tableroArray[i][k] === 2) || tableroArray[i][k] === 11) {
                arribaDer = false
              } else{
                arribaDer = true
              }
            }
          }
        } catch (error) {
          arribaDer = true
        }

        try {
          if(tableroArray[i+1][k-1] === fichaEnemiga || tableroArray[i+1][k-1] === (fichaEnemigaRey)){
            if(tableroArray[i+2][k-2] === fichaEnemiga || tableroArray[i+2][k-2] === (fichaEnemigaRey) || tableroArray[i+2][k-2] === undefined){ 
              abajoIzq = true
            } else{
              abajoIzq = false
            }
          } else{
            if(tableroArray[i+1][k-1] === turno || tableroArray[i+1][k-1] === undefined){
              abajoIzq = true
            } else{
              if ((turno === 1 && tableroArray[i][k] === 1) || tableroArray[i][k] === 22) {
                abajoIzq = false
              } else{
                abajoIzq = true
              }
            }
          }
        } catch (error) {
          abajoIzq = true
        }

        try {
          if(tableroArray[i+1][k+1] === fichaEnemiga || tableroArray[i+1][k+1] === (fichaEnemigaRey)){
            if(tableroArray[i+2][k+2] === fichaEnemiga || tableroArray[i+2][k+2] === (fichaEnemigaRey) || tableroArray[i+2][k+2] === undefined){
              abajoDer = true
            } else{
              abajoDer = false
            }
          } else{
            if (tableroArray[i+1][k+1] === turno || tableroArray[i+1][k+1] === undefined) {
              abajoDer = true
            } else{
              if ((turno === 1 && tableroArray[i][k] === 1) || tableroArray[i][k] === 22) {
                abajoDer = false
              }  else{
                abajoDer = true
              }
            }
          }
        } catch (error) {
          abajoDer = true
        }

        if (arribaIzq === true && arribaDer === true && abajoIzq === true && abajoDer=== true) { //Si no se puede generar ningun movimiento en la dama parada, asignamos un true al array
          arrayEmpate.push(true)
        } else{
          arrayEmpate.push(false) //si existe un movimiento posible se le asigna un false
        }
        //Asignamos un booleano en el arrayEmpate por cada ficha del turno actual encontrada
      }
    }
  }
  for (let i = 0; i < arrayEmpate.length; i++) {
    if (arrayEmpate[i] === true) {
      contadorTrues++ //Contamos la cantidad de true, metidos en el array empate
    }
  }

  if ((contadorTrues > 0 && contadorTrues === arrayEmpate.length)) {
    //verificamos si el contador de true es mayor a 0 y que el contador de true sea igual a la longitud del array empate, es decir, que en todas sus fichas no se pueda generar ningun movimiento
    //Verificamos que jugador tiene mas fichas a la hora de quedarse sin movimientos, y este gana la partida
    //Si tienen la misma cantidad de fichas, se genera un empate
    if (damasBlancasLenght > damasRojasLenght) {
      setTimeout(() => {
        swal('¡Felicitaciones ' + nombreJugador1.innerHTML + ' ganaste la partida!')
        setTimeout(() => {
          swal('Por regla: "Si el jugador en turno no puede mover puesto que todas las piezas que le restan en juego están bloqueada, gana quien más piezas tenga"')
        }, 3000);
      }, 100);
    }
    if (damasRojasLenght > damasBlancasLenght) {
      setTimeout(() => {
        swal('¡Felicitaciones ' + nombreJugador2.innerHTML + ' ganaste la partida!')
        setTimeout(() => {
          swal('Por regla: "Si el jugador en turno no puede mover puesto que todas las piezas que le restan en juego están bloqueada, gana quien más piezas tenga"')
        }, 3000);
      }, 100);
    }
    if (damasRojasLenght === damasBlancasLenght) {
      setTimeout(() => {
        swal('¡Felicitaciones han logrado un Empate!')
      }, 100);
    }
    guardarHistorial()
    eventosALasDamas = false
    resetearTablero()
  }

  if((ReyesBlancosLength === 1 && ReyesRojasLenght === 1  && damasBlancasLenght === 0 && damasRojasLenght === 0)){ //Si hay dos reinas, unicamente, en juego. Se genera un empate
    setTimeout(() => {
      swal('¡Felicitaciones han logrado un Empate!')
    }, 100);
    guardarHistorial()
    eventosALasDamas = false
    resetearTablero()
  }
}

agregarEvento()
