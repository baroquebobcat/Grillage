//app





Event.observe(window,"load",function(){
  Grillage.start()
})

  //starting from https://developer.mozilla.org/en/drawing_graphics_with_canvas



var map = {
  //where the dude first appears
  start_coords:{
    x:100,
    y:200
  },
  width: 1000,
  height:500,
  ground:200,
  tiles: [
    {
      type:'hard',
      coords: {x:125,y:150},
      width: 100,
      height:50
    },
    {
      type:'hard',
      coords: {x:225,y:100},
      width: 100,
      height:50
    },
    {
      type:'hard',
      coords: {x:325,y:50},
      width: 100,
      height:50
    }
  ]
}


  

