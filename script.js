const celeste = document.getElementById("celeste");
const violeta = document.getElementById("violeta");
const naranja = document.getElementById("naranja");
const verde = document.getElementById("verde");
const btnEmpezar = document.getElementById("btnEmpezar");
const ULTIMO_NIVEL = 10;

class Juego {     // Tiene toda la logica del Juego
  constructor() {
    this.inicializar = this.inicializar.bind(this);
    this.inicializar();        //Funcion inicializar
    this.generarSecuencia();
    setTimeout(this.siguienteNivel, 500); 
  }

  inicializar() {  //
    this.siguienteNivel = this.siguienteNivel.bind(this); // bind para atar al juego
    this.elegirColor = this.elegirColor.bind(this); // bind para enlazar-atar
    this.toggleBtnEmpezar();    //Ocultar el boton de inicializar
    this.nivel = 1;       //Importante para poder avanzar de nivel
    this.colores = {      //guardar los colores como botones, es un objeto con colores
      celeste,
      violeta,
      naranja,
      verde,
    };
  }

  toggleBtnEmpezar() {
    if (btnEmpezar.classList.contains("hide")) {
      btnEmpezar.classList.remove("hide");
    } else {
      btnEmpezar.classList.add("hide");
    }
  }

  generarSecuencia() {
    this.secuencia = new Array(ULTIMO_NIVEL)  //Generar un array con la palabra new. ULTIMO_NIVEL indica la cantidad de elementos del array 
      .fill(0)   // Llamar a la funcion fill, para definir el array con un valor, en este caso cero, 10 posiciones en 0
      .map((n) => Math.floor(Math.random() * 4));  //math floor redondea hacia abajo, map recorre cada valor del arreglo
  }

  siguienteNivel() {   //Va a llamar a iluminar secuencia
    this.subnivel = 0; //Para cada cambio de nivel, es para agregar atributos
    this.nombreAtributo = "valor"; 
    this.iluminarSecuencia();
    this.agregarEventosClick();
  }

  transformarNumeroAColor(numero) {
    switch (numero) {
      case 0:
        return "celeste";
      case 1:
        return "violeta";
      case 2:
        return "naranja";
      case 3:
        return "verde";
    }
  }

  transformarColorANumero(color) {
    switch (color) {
      case "celeste":
        return 0;
      case "violeta":
        return 1;
      case "naranja":
        return 2;
      case "verde":
        return 3;
    }
  }

  iluminarSecuencia() {   //Recorre el array de la secuencia hasta el nivel en el que este el usuario 
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformarNumeroAColor(this.secuencia[i]); // obtener el color
      setTimeout(() => this.iluminarColor(color), 1000 * i); // Para que no se ejecute muy rapido la funcion de iluminar color, ya que por el for lo haria muy rapido.
      //*i importante para iluminar el color al primer sg, al segundo sg, al tercer sg, etc
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add("light");  // Se agrega una clase de css para que se ilumine, clase ligth
    setTimeout(() => this.apagarColor(color), 350);  //Se agrega un tiempo 
  }

  apagarColor(color) {
    this.colores[color].classList.remove("light"); // Remover la clase light
  }

  agregarEventosClick() { //Funcion que se ejecuta asincronamente
    // se usa el metodo bind ya que this nos devolvera el target del boton tocado, y no del juego en si como deberia ser
    this.colores.celeste.addEventListener("click", this.elegirColor);
    this.colores.verde.addEventListener("click", this.elegirColor);
    this.colores.violeta.addEventListener("click", this.elegirColor);
    this.colores.naranja.addEventListener("click", this.elegirColor);
  }

  eliminarEventosClick() {
    this.colores.celeste.removeEventListener("click", this.elegirColor);
    this.colores.verde.removeEventListener("click", this.elegirColor);
    this.colores.violeta.removeEventListener("click", this.elegirColor);
    this.colores.naranja.removeEventListener("click", this.elegirColor);
  }

  elegirColor(ev) {   //cuando se utilizan los escuchadores de evento, los metodos se llaman con un parametro que se suele llamar ev 
    const nombreColor = ev.target.dataset.color;  //atributo target que nos da el boton que fue pulsado, en dataset esta el color que toco el usuario. Se guarda en una variable.
    const numeroColor = this.transformarColorANumero(nombreColor);
    this.iluminarColor(nombreColor);
    if (numeroColor === this.secuencia[this.subnivel]) {   //this.subnivel es la posicion en la que se encuentra  
      this.subnivel++;
      if (this.subnivel === this.nivel) {
        this.nivel++;
        this.eliminarEventosClick();
        if (this.nivel === ULTIMO_NIVEL + 1) {
          this.ganoElJuego();
        } else {
          setTimeout(this.siguienteNivel, 1000);
        }
      }
    } else {
      this.perdioElJuego();
    }
  }
  ganoElJuego() {   // el swal devuelve una promesa
    swal("Felicitaciones", "Ganaste el juego!", "success").then( 
      this.inicializar
    );
  }
  perdioElJuego() {
    swal("Perdiste", "Lo siento, vuelve a intentarlo", "error").then(() => {
      this.eliminarEventosClick();
      this.inicializar();
    });
  }
}

function empezarJuego() {      //Funcion para iniciar juego
  window.juego = new Juego();  //Llama a la clase juego
}
