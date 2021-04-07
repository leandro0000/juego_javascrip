
let canvas =document.getElementById("canvas")

let cxt = canvas.getContext('2d');
//definir variables para fondo
//crear el ojecto de la nave
let fondo;
var teclado = {};

var disparos= [];
//agregar enemigos
var enemigos = [];
var dibujardisparos = [];

var juego = {
    estado:'iniciando',
}

var textorespuesta = {
    counter:-1,
    titulo:"",
    subtitulo:""
}

var nave = {
    x:100,
    y:canvas.height-100,
    width:50,
    height: 50,
    contador:0

}

function loadmedia(){
    fondo= new Image();
    fondo.src ="men.jpg"
    fondo.onload = function(){
        var intevalo = window.setInterval(fraloot,1000/55)
    }
}

function dibujoenemigos (){
 
     for(var i in enemigos){
        var enemigo = enemigos[i];
         cxt.save();
         if(enemigo.estado == 'vivo'){
           
            cxt.fillStyle = "#red";
         }

         if(enemigo.estado == 'muerto'){
           
            cxt.fillStyle = "#black";
         }
        
         cxt.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
     }

    

}

function img(){
    cxt.drawImage(fondo,0,0)
    
}

function dibujanave(){
    cxt.save();
    cxt.fillStyle= '#fff';
    cxt.fillRect(nave.x,nave.y,nave.width,nave.height);
    cxt.restore();    
}

function evento(){

      agregarevento(document,"keydown",function(e){
             
          teclado[e.keyCode]=true;        
      })

      agregarevento(document,"keyup",function(e){
             
        teclado[e.keyCode]=false;     
    
    })


     function agregarevento(elemento,nombre,funcion){
          
        if(elemento.addEventListener){
             
             elemento.addEventListener(nombre,funcion,false)
        }

            
     }

}

function movernave(){
    if(teclado[37]){
        //mover izquierda
        nave.x -=10;
        if(nave.x < 0){
            nave.x =0;
        }
    }

    if(teclado[39]){
        //mover derecha

         var limite = canvas.width-nave.width;
        nave.x +=10;
        if(nave.x > limite){
            nave.x =limite;
        }
    }

     if(teclado[32]){
          
        if(!teclado.fire){
            fire()
            teclado.fire=true;
        }

      
     }else {
        if(!teclado[32]){
            teclado.fire =false;
        }
     }

     if(nave.estado == "hit"){
         nave.contador++;
         if(nave.contador >=20 ){

            contador=0;
            nave.estado = "muerto"; 
            juego.estado ="perdido";
            textorespuesta.titulo ="Gamer over";
            textorespuesta.subtitulo ="preciona la tecla R para iniciar";
            textorespuesta.counter =0;

         }

     }
}

function dibujardisparosenemigos(){
    for(var i in  dibujardisparos) {

        var disparo = dibujardisparos[i];
        cxt.save();
        cxt.fillStyle= 'red';
        cxt.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
        cxt.restore()
      
    }
}

 function moverdispaenemigo(){

    for(var i in   dibujardisparos){
        var disparo =  dibujardisparos[i];
        disparo.y += 3;      
    }

    dibujardisparos =  dibujardisparos.filter(function(disparo){
        return disparo.y < canvas.height;
    })

 }

function disparost(){
    
     for(i in disparos){

        var disparo = disparos[i];
        disparo.y -=2;

     }

     disparos = disparos.filter(function(disparo){
         return disparo.y > 0;
     })
}


function fire (){

    disparos.push({
        x:nave.x + 20,
        y:nave.y - 10,
        width:10,
        height:30
        
    })

}

function actulizaeemigos(){

    function agregardisparosenemigos(enemigo){
         
        return {
            x:enemigo.x,
            y:enemigo.y,
            width:10,
            height:33,
            contador:0
        }
    }
    
    if(juego.estado == "iniciando"){

       for(var i =0;i< 10; i++){

           enemigos.push({
               x: 10 + (i*50),
               y: 10 ,
               width:40,
               height:40,
               estado:'vivo',
               contador:0
           })

       }

        juego.estado = "jugando";                                           
    }

    for (var i in enemigos){
        var enemigo = enemigos[i];         
        if(!enemigo){
            continue;
        }
        if(enemigo && enemigo.estado == 'vivo'){              
             enemigo.contador++;
             enemigo.x += Math.sin(enemigo.contador * Math.PI /90)*5;
        }
          
        if(aletoria(0,enemigos.length * 10 ) == 4) {
            dibujardisparos.push(agregardisparosenemigos(enemigo));

        } 

        if(enemigo && enemigo.estado == "hit"){
            enemigo.contador++;

            if(enemigo.contador >= 20){
                enemigo.estado ="muerto";
                enemigo.contador = 0;
            }
        }

    }

    enemigos = enemigos.filter(function(enemigo){
        if(enemigo && enemigo.estado != "muerto"){
            return true;
        }
    })
}



function dibujodisparos(){

 cxt.save()
 cxt.fillStyle= '#fff';
 for(i in disparos){
     var disparo = disparos[i];
     cxt.fillRect(disparo.x,disparo.y,disparo.width,disparo.height)
 }
 cxt.restore();


}


            function dibujartexto(){
                if (textorespuesta.counter == -1){
                    return;
                    
                }

                var alpha = textorespuesta.counter/50.0;
                if(alpha > 1){
                    for(var i in enemigos){
                        delete enemigos[i];
                    }
                }
                cxt.save()
                cxt.globalAlpha=alpha;
                
                if(juego.estado == "perdido"){
                    cxt.fillStyle= 'black';
                    cxt.font ="Bold 60pt Arial";
                    cxt.fillText(textorespuesta.titulo,140,200);
                    cxt.font =" 20pt Arial";
                    cxt.fillText(textorespuesta.subtitulo,190,250);
                    
                }
                           
                   
                if(juego.estado == "vitoria"){
                    cxt.fillStyle= 'black';
                    cxt.font ="Bold 60pt Arial";
                    cxt.fillText(textorespuesta.titulo,140,200);
                    cxt.font =" 20pt Arial";
                    cxt.fillText(textorespuesta.subtitulo,190,250);
                    
                }


            }



            function actulizarestadojuego(){

                if(juego.estado == "jugando" && enemigos.length == 0){
                    
                juego.estado == "vitoria";
                textorespuesta.titulo ="ganaste";
                textorespuesta.subtitulo ="preciona la tecla R para en iniciar";
                textorespuesta.counter =0;
                }


                if(textorespuesta.counter >= 0){
                    textorespuesta.counter++;
                }

                if((juego.estado == "perdido" || juego.estado =="vitoria") && teclado[82]){
                    juego.estado ="iniciando";
                    nave.estado = "vivo";
                    textorespuesta.counter = -1;

                }
                
                
            }

function hit(a,b){
    var hit =false;
    if(b.x + b.width >= a.x && b.x < a.x + a.width){
         
      if(b.y + b.height >= a.y && b.y  < a.y + a.height )  {
          hit= true;
      }            
    }

    if(b.x <= a.x && b.x + b.width >= a.x + a.width){
          
         if(b.y <= a.y && b.y + b.height >= a.y + a.height){
             hit = true;
         }
    }

    if(a.x <= b.x && a.x + a.width >= b.x + b.width){
          
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
            hit = true;
        }
   }

   
    return hit;
}


           



function verificar(){
    for( var i in disparos){
        var disparo = disparos[i];

        for( j in enemigos ){
            var enemigo = enemigos[j];

            if(hit(disparo,enemigo)){
                enemigo.estado ='hit';
                enemigo.contador =0;
                console.log("ok si")
            }
        }
    }

    if (nave.estado == "hit" || nave.estado == "muerto"){
        return;
    }

    for(var i in dibujardisparos) {
        var disparo =  dibujardisparos[i];

        if(hit(disparo,nave)){
            nave.estado ="hit";
            console.log("ok si")
        }
    }
} 

function aletoria(inferior,superior){

      var posibilidades = superior - inferior;
      var a = Math.random() * posibilidades;
      a = Math.floor(a);
      return parseInt(inferior) +a;
     
}

function fraloot(){
    //todas las funciones del juego
    actulizarestadojuego()
    movernave()
    actulizaeemigos()
    disparost()
    moverdispaenemigo()
    verificar()
    img();
    dibujoenemigos()
    dibujardisparosenemigos()
    dibujodisparos()
    dibujartexto()
    dibujanave()
}

loadmedia(); 
evento();