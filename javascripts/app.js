//app
Event.observe(window,"load",function(){

draw();
mainLoop();
})

  //starting from https://developer.mozilla.org/en/drawing_graphics_with_canvas
var dude = {
  coords: {
    x:100,
    y:100 
  },
  width:55
}

var delta = 5;
var screen_size = {x:300,y:300}

var map = {
  screen_coords: {
  x:0,
  y:0
  },
  width: 1000,
  height:300
}


function context(){
 var canvas = document.getElementById("canvas");
 return canvas.getContext("2d");

}

function clear(ctx){
  var ctx = context();
  ctx.clearRect(0,0,screen_size.x,screen_size.y);
}

function draw(){
  var ctx = context();
  clear(ctx);
  draw_bg(ctx)
  draw_dude(ctx)
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

function move_dude(){
    //left right
    if (movement.left && dude.coords.x-delta + dude.width >= 0) dude.coords.x-=delta;
    if (movement.right && dude.coords.x+delta - dude.width < map.width) dude.coords.x+=delta;
    //adjust screen position
    if (dude.coords.x > map.screen_coords.x + screen_size.x - dude.width) map.screen_coords.x +=delta;
    if (dude.coords.x < map.screen_coords.x + dude.width) map.screen_coords.x -=delta;

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
  setTimeout("jump("+(t+rate)+")",period);
}

var mainLoop = function(){
  move_dude();
  draw();
  setTimeout("mainLoop()", 10);
};

var movement = {
  left:false,
  right:false,
  up:false,
  jumping:false,
  down:false,
  other:false
  }
  
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
  movement[dir]=false
  $('key_press_'+dir).removeClassName("pressed");
})


Event.observe(window,"keydown",function(e){
  var dir = null;
  switch(e.keyCode != 0 ? e.keyCode : e.which){
  case Event.KEY_SPACE:
  case Event.KEY_UP:
    dir = "up"
    if(!movement.jumping) jump();
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
  movement[dir]=true;
  
  $('key_press_'+dir).addClassName("pressed");
  $('screen_coords').update("x: "+map.screen_coords.x+"y: "+map.screen_coords.y);
})
