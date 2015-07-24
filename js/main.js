var cotas = [],
    measures = [],
    images = [];

var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  data: {
    total: false,
    measures: [],
    counter: 0,
    content: '',
    imageInput: '',
    imageURL: 'file:///Users/tatianaburgos/Desktop/app1.png',
    images: [],
    cotas: [],
    r: 5,
    format: function(c) { 
      
      console.log(c.x);
      console.log(c.y);
      
    },
    measure: function(i) {
      var cotas = ractive.get('cotas');
      var cota = cotas[i].x - cotas[i-1].x;
      var proportion = +((cota * 100 / ractive.get('total')).toFixed(2));

      measures.push({measure: cota, proportion: proportion});
      ractive.set('measures', measures);
      return {
        proportion: proportion, 
        measure: cota
      };
    }
  }
});

ractive.on('start', function(event) {
  ractive.set({'content': 'Click two points to set main reference.'});
});

ractive.on('measure', function(event) { 
  console.log(event.original.pageX);
  console.log(event.original.pageY);
  var coords = {
    x: event.original.pageX,
    y: event.original.pageY
  };
  // add clicked position
  addCoord(coords);

  // update counter
  var counter = ractive.get('counter') + 1;
  ractive.set('counter', counter);
    
  // set the firts two clicks to use as main ref
  if (counter === 2) {
    var total = cotas[1].x - cotas[0].x;
    ractive.set('total', total);
  }

  // each next pairs of clicks calculate partial and proportion
  if ((counter > 2) && (counter % 2 == 0 )) {
    $('#measures').addClass('drag');
    addMeasure(counter);
  }
});

ractive.on('remove', function(event) {
  var i = (event.keypath).split('.')[1];
  var thisarray = event.keypath.split('.')[0];
  ractive.get(thisarray).splice(i, 1);
});

// TODO after each reset, on first click error:
// Failed to compute "${format(cotas-1)}"
// then continues ok (number of errors cotas-i depends on number of cotas clicked)
ractive.on('restart', function() {
  cotas = [];
  measures = [];
  ractive.set({
    total: 0,
    counter: 0,
    measures: measures,
  });
  $('#canvas circle, #canvas text').remove();
});

// update loaded image
ractive.on('loadImage', function() { 
  ractive.set({
    'imageURL': ractive.get('imageInput'),
    'imageInput': ''
  });
});

// save actual img path
ractive.on('save', function() { 
  ractive.get('images').push(ractive.get('imageURL'));
});

// reload image as actual
ractive.on('reload', function(event) {
  ractive.set({
    'imageURL': ractive.get(event.keypath)
  });
});

function addCoord(coords) {
  // add coords of click to cotas array
  cotas.push(coords);
  ractive.set('cotas', cotas);
}

function addMeasure(i) { 
  var measure = cotas[i-1].x - cotas[i-2].x;
  var proportion = +((measure * 100 / ractive.get('total')).toFixed(2));

  measures.push({measure: measure, proportion: proportion});
  ractive.set('measures', measures);
}