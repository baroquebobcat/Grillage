/*
n.

A network or frame of timber or steel serving as a foundation, usually on ground that is wet or soft.

Synonyms - platform

Grillage.

A Javascript platformer/lib
*/
Grillage = 
(function() {
    
  var mainLoop = function(){
    move_dude();
    Grillage.draw();
    setTimeout("Grillage.mainLoop()", 10);
  };



var delta = 5;
var screen_size = {x:300,y:300}

function move_dude(){
    //left right
    if (dude.movement.left && dude.coords.x-delta + dude.width >= 0) dude.coords.x-=delta;
    if (dude.movement.right && dude.coords.x+delta - dude.width < map.width) dude.coords.x+=delta;
    //adjust screen position
    if (dude.coords.x > map.screen_coords.x + screen_size.x - dude.width) map.screen_coords.x +=delta;
    if (dude.coords.x < map.screen_coords.x + dude.width) map.screen_coords.x -=delta;

}

var dude = {
  coords: {
    x:100,
    y:100 
  },
  width:55,
  movement: {
    left:false,
    right:false,
    up:false,
    jumping:false,
    down:false,
    other:false
  }
}


var jump = function(t){
//  alert('jump')
  if(t == null) t = 0;
  var period = 10;//ms
  var rate = 0.07;//per period
  var gravity = 10;
  if(dude.coords.y >100) {dude.coords.y =100; return;}
//  if(dude.coords.y <=0) {dude.coords.y =0; return;}
  dude.coords.y = dude.coords.y - delta + gravity*t^2;
  setTimeout("Grillage.jump("+(t+rate)+")",period);
}


  function clear(ctx){
    ctx.clearRect(0,0,screen_size.x,screen_size.y);
  }
  function draw_bg(ctx) {
   for(var i=1;i<10;i++)
   {
   ctx.fillStyle = "rgb(200,0,0)";
   ctx.fillRect (100*i-map.screen_coords.x, 10, 55, 50);
   }
    ctx.fillStyle = "rgb(0,200,0)";
    ctx.fillRect (0, map.height/2 +10, map.width,map.height/2 );
  }

  function draw_dude(ctx){
   ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
   ctx.fillRect (dude.coords.x-map.screen_coords.x, dude.coords.y, 55, 50);
  }

  var screen = null;
  function set_screen(){
    screen = {
      context: (function (){
       var canvas = document.getElementById("canvas");
       return canvas.getContext("2d");
      })(),
      draw: function (){
        clear(this.context);
        draw_bg(this.context)
        draw_dude(this.context)
      },
      dude:dude
    };
  }


  function set_listeners(){
  Event.KEY_SPACE = 32;
Event.observe(window,"keyup",function(e){
  var dir = null;
  switch(e.keyCode != 0 ? e.keyCode : String.fromCharCode(e.which)){
  case Event.KEY_SPACE:
  case Event.KEY_UP:
    dir = "up"
    break;
  case Event.KEY_DOWN:
    dir = 'down';
    break;
  case Event.KEY_LEFT:
    dir = 'left'
    break;
  case Event.KEY_RIGHT:
    dir = 'right';
    break;
  default:
    dir = 'other';
    break;
  }
  dude.movement[dir]=false
  $('key_press_'+dir).removeClassName("pressed");
})


Event.observe(window,"keydown",function(e){
  var dir = null;
  switch(e.keyCode != 0 ? e.keyCode : e.which){
  case Event.KEY_SPACE:
  case Event.KEY_UP:
    dir = "up"
    if(!dude.movement.jumping) jump();
    break;
  case Event.KEY_DOWN:
    dir = "down"
    break;
  case Event.KEY_LEFT:
    dir="left"
    break;
  case Event.KEY_RIGHT:
    dir = "right"
    break;
  default:
      dir = "other";
      $('key_press_other').update(e.keyCode != 0 ?String.fromCharCode(e.keyCode) : String.fromCharCode(e.which))
      break;
  }
  dude.movement[dir]=true;
  
  $('key_press_'+dir).addClassName("pressed");
  $('screen_coords').update("x: "+map.screen_coords.x+"y: "+map.screen_coords.y);
})
  }
  
  
  set_debug = function(){
    $("canvas").observe('click',function(event){
      $('mouse_coords').update('x: '+event.pointerX()+',  y:'+event.pointerY())
    })
  }

  return {
  start: function(options){
    set_debug()
    set_listeners()
    set_screen()
    this.draw();
    mainLoop();
  },
  draw: function(){
    screen.draw()
  },
  mainLoop:mainLoop,
  jump:jump
  }
})();
