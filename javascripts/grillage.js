/*
n.

A network or frame of timber or steel serving as a foundation, usually on ground that is wet or soft.

Synonyms - platform

Grillage.

A Javascript platformer/lib

NOTES
  all rects postions come from lower left.
  +---+
  |   |
  0---+
  ^ here
  
  this includes the screen(viewport, whatever)
*/
Grillage = 
(function() {
    
  var mainLoop = function(){
    move_dude();
    move_screen();
    var dir = null
    Grillage.draw();
    setTimeout("Grillage.mainLoop()", tic);
  };

var screen_coords = function(coords){
  return {
    x: coords.x -screen.coords.x,
    y: screen.height - (coords.y -screen.coords.y)
  };
}
var epsilon = 1;
var delta = 5;
var tic = 20;
function move_dude(){
  //movement
  
    if(dude.movement.left) dude.velocity.x = -1
    if(dude.movement.right) dude.velocity.x = 1
    if(!dude.movement.left && !dude.movement.right) dude.velocity.x = 0;
    
    //left right
    var new_coords = {x:0,y:0}
    new_coords.x = dude.coords.x + dude.velocity.x*delta;
    new_coords.y = dude.coords.y;
    
    //this is a stupid check
    if (dude.velocity.y == 0) dude.jumping = false 
    
    if (dude.movement.up && !dude.jumping) {
      dude.velocity.y = 1;
      dude.jumping = true;
    }
    dude.velocity.y -= 0.03;
     
    new_coords.y = dude.coords.y + dude.velocity.y*delta;
    dude.coords = collision_adjustment(dude,new_coords)   
   
}

function move_screen(){
  //scroll screen position -- leave a half a dude of space
  var coords = screen_coords(dude.coords)
  if (coords.x > screen.width - 1.5 * dude.width)
   screen.coords.x +=  delta;
  if ( coords.x < 0.5 * dude.width)
  screen.coords.x -=  delta;

  if (coords.y > screen.height - 0.5 * dude.height)
   screen.coords.y -=  delta;
  if ( coords.y < 0)
    screen.coords.y +=  delta;
}

  var dude = {
    coords: {
      x:100,
      y:100 
    },
    velocity:{
      x:0,
      y:0
    },
    jumping:false,
    width:55,
    height:50,
    movement: {
      left:false,
      right:false,
      up:false,
      down:false,
      other:false
    }
  }

  function collision_adjustment(dude,new_coords){
    $('blocked_hori').removeClassName('pressed')
    $('blocked_vert').removeClassName('pressed')
    var top = new_coords.y + dude.height;
    
    var coords = Object.clone(new_coords)
    
    map.tiles.each(function(tile){
      var tile_top = tile.coords.y + tile.height
   //for x
     // if old y is between y1,y2 check and deal
     if (dude.coords.y + dude.height > tile.coords.y + epsilon && dude.coords.y < tile_top - epsilon) {
       if (new_coords.x + dude.width > tile.coords.x &&
          new_coords.x < tile.coords.x + tile.width){
          
          dude.velocity.x=0
          
          coords.x = dude.coords.x;//lazy
          $('blocked_hori').addClassName('pressed')
       }
     }
   //for y
     // if old x is between x1,x2 check and deal
   
     if (dude.coords.x  + dude.width > tile.coords.x + epsilon && dude.coords.x < tile.coords.x + tile.width - epsilon) {
       if (new_coords.y + dude.height > tile.coords.y + epsilon && new_coords.y < tile_top - epsilon){
          
          dude.velocity.y=0
          
          dude.jumping=false;
          
          coords.y = dude.coords.y;//lazy
          $('blocked_vert').addClassName('pressed')
       }
     }
    })
    if (new_coords.x+dude.width > map.width || new_coords.x < 0) {
      coords.x = dude.coords.x;
      dude.velocity.x=0;
    }
    
    if (new_coords.y+dude.height > map.height || new_coords.y < map.ground) {
      coords.y = dude.coords.y;
      dude.velocity.y=0;
    }
    return coords;
  }

  function clear(ctx){
    ctx.clearRect(0,0,screen.width,screen.height);
  }
  function draw_bg(ctx) {
   gnd = screen_coords({x:0,y:map.ground});
   for(var i=1;i<10;i++)
   {
     ctx.fillStyle = "rgb(200,0,0)";
     ctx.fillRect (100*i-screen.coords.x, gnd.y-190, 55, 50);
   }
   
    
    ctx.fillStyle = "rgb(0,200,0)";
    ctx.fillRect (0, gnd.y, map.width,gnd.y );
  }

  function draw_dude(ctx){
   ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
   coords = screen_coords(dude.coords)
   ctx.fillRect (coords.x, coords.y-dude.height, dude.width, dude.height);
  }

  function draw_tiles(ctx){
    map.tiles.each(function(tile){
      ctx.fillStyle = 'rgb(200,40,240);'
      coords = screen_coords(tile.coords)
      ctx.fillRect(coords.x,coords.y-tile.height,tile.width,tile.height)
    })
  }

  var screen = null;
  function set_screen(){
    screen = {
      height:300,
      width:300,
      coords:{ x:0,y:0},
      context: (function (){
       var canvas = document.getElementById("canvas");
       return canvas.getContext("2d");
      })(),
      draw: function (){
        clear(this.context);
        draw_bg(this.context)
        draw_tiles(this.context)
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
    //if(!dude.movement.jumping) jump();
    
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
  if(dir!="other")e.stop()
  $('key_press_'+dir).addClassName("pressed");
  $('screen_coords').update("x: "+screen.coords.x+"y: "+screen.coords.y);
})
  }
  
  var dude_debug = function(){
    $('dude_coords').update("x: "+dude.coords.x+"<br>y:"+dude.coords.y)
    if (dude.jumping) $('dude_jump').addClassName("pressed")
    else $('dude_jump').removeClassName("pressed")
    setTimeout("Grillage.dude_debug()", 200);
  };
  
  set_debug = function(){
    $("canvas").observe('click',function(event){
      $('mouse_coords').update('x: '+event.pointerX()+',  y:'+event.pointerY())
    })
    dude_debug()

  }

  return {
  start: function(options){
    set_debug()
    set_listeners()
    set_screen()
    
    dude.coords = Object.clone(map.start_coords)
    
    this.draw();
    mainLoop();
  },
  draw: function(){
    screen.draw()
  },
  mainLoop:mainLoop,
  dude_debug:dude_debug
  }
})();
