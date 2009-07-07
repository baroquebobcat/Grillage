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
    var dir = null


    Grillage.draw();
    setTimeout("Grillage.mainLoop()", 10);
  };



var delta = 5;
var screen_size = {x:300,y:300}

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
      dude.velocity.y = -1;
      dude.jumping = true;
    }
    dude.velocity.y += 0.03;
    
    if(dude.coords.y > map.ground) {
      dude.coords.y = map.ground;
      dude.velocity.y = 0;
    }
    
    new_coords.y = dude.coords.y + dude.velocity.y*delta;
    dude.coords = collision_adjustment(dude,new_coords) 

  //scroll screen position -- leave a half a dude of space
    if (dude.coords.x > map.screen_coords.x + screen_size.x - 1.5 * dude.width) map.screen_coords.x +=delta;
    if (dude.coords.x < map.screen_coords.x + 0.5 * dude.width) map.screen_coords.x -=delta;

   
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
    var bottom = new_coords.y + dude.height;
    
    var coords = Object.clone(new_coords)
    
    map.tiles.each(function(tile){
      var tile_bottom = tile.coords.y + tile.height
   
   
   
   //for x
     // if old y is between y1,y2 check and deal
     if (dude.coords.y + dude.height > tile.coords.y && dude.coords.y < tile_bottom) {
       if (new_coords.x + dude.width > tile.coords.x &&
          new_coords.x < tile.coords.x + tile.width){
          
          dude.velocity.x=0
          
          coords.x = dude.coords.x;//lazy
          $('blocked_hori').addClassName('pressed')
       }
     }
   //for y
     // if old x is between x1,x2 check and deal
   
     if (dude.coords.x  + dude.width> tile.coords.x && dude.coords.x < tile.coords.x + tile.width) {
       if (new_coords.y + dude.height > tile.coords.y && new_coords.y < tile_bottom){
          
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
    
    if (new_coords.y+dude.height > map.height || new_coords.y < 0) {
      coords.y = dude.coords.y;
      dude.velocity.y=0;
    }
    return coords;
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
   ctx.fillRect (dude.coords.x-map.screen_coords.x, dude.coords.y, dude.width, dude.height);
  }

  function draw_tiles(ctx){
    map.tiles.each(function(tile){
      ctx.fillStyle = 'rgb(200,40,240);'
      ctx.fillRect(tile.coords.x-map.screen_coords.x,tile.coords.y,tile.width,tile.height)
    })
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
  mainLoop:mainLoop
 // jump:jump
  }
})();
