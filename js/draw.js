// this doesn't work, gets error ''
// "Uncaught TypeError: canvas.getContext is not a function
function draw() {

  $('#canvas').on('click', function(event) {
    var coords = { x: event.pageX, y: event.pageY };
    drawMeasure(coords);
  });

  function drawMeasure(coords) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2s');
    ctx.beginPath();
    ctx.arc(coords.x,coords.y,5,0,2*Math.PI);
    ctx.stroke();
  }
}

