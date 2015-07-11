var cotas = [],
    measures = [];

var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  data: {
    total: false,
    measures: [],
    counter: 0,
    content: ''
  }
});

ractive.on('start', function(event) {
  ractive.set({'content': 'Click two points to set main reference.'});
});

ractive.on('measure', function(event) {
  
  // add clicked position y
  addCoordY(event.original);

  // update counter
  var counter = ractive.get('counter') + 1;
  ractive.set('counter', counter);
    
  // set the firts two clicks to use as main ref
  if (counter === 2) {
    var total = cotas[1] - cotas[0];
    ractive.set('total', total);
  }

  // each next pairs of clicks calculate partial and proportion
  if ((counter > 2) && (counter % 2 == 0 )) {
    addMeasure(counter);
  }
});

ractive.on('remove', function(event) {
  var i = (event.keypath).split('.')[1];
  measures.splice(i, 1);
});

ractive.on('restart', function(event) {
  cotas = [];
  measures = [];
  ractive.set({
    total: 0,
    counter: 0,
    measures: measures,
  });
});

    
function addCoordY(e) {
  cotas.push(e.pageY);
}

function addMeasure(i) { 
  var measure = cotas[i-1] - cotas[i-2];
  var proportion = +((measure * 100 / ractive.get('total')).toFixed(2));

  measures.push({measure: measure, proportion: proportion});
  ractive.set({
    'measures': measures,
  });
}