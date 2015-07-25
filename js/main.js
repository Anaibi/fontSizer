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
    cota: function(i) { 
      // i comes: 1, 3, 5, 7.. and we want 0, 1, 2, 3..
      var measure = ractive.get('measures')[(i-1)/2];
      return {
        proportion: measure.proportion, 
        measure: measure.measure
      };
    }
  }
});

ractive.on('start', function(event) {
  ractive.set({'content': 'Click two points to set main reference.'});
});

ractive.on('do-measure', function(event) { console.log('do-measure called');

  // add clicked position
  addCoord(event);

  // update counter
  var counter = ractive.get('counter') + 1; console.log(counter);
  ractive.set('counter', counter);
  
  // on second clicks:
  if (counter % 2 === 0) { console.log(counter);
    
    addMeasure(counter-1);

    // set the firts 2 clicks to use as main ref
    if (counter === 2) { console.log(ractive.get('measures')[0]);
      ractive.set('total', ractive.get('measures')[0].y);
    }

    // make #measures table draggable
    if (counter === 3) {
      ('#measures').addClass('drag');
    }
    console.log(ractive.get('total'));
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

function addCoord(click) {
  ractive.push('cotas', {x: click.original.offsetX, y: click.original.offsetY});
}

function addMeasure(i) { console.log('addMeasure ' + i);
  var cota1 = ractive.get('cotas')[i-1]; 
      cota2 = ractive.get('cotas')[i]; 

  var cota = cota2.y - cota1.y; 
  var total = ractive.get('total'); console.log('total ' + total);
  if (total) { console.log(total);
    var proportion = +((measure * 100 / total).toFixed(2));
  } else {
    proportion = 100;
  }

  ractive.get('measures').push({measure: cota, proportion: proportion});
}