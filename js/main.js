// TODO use partials
//var circle = "<circle";

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
    // i comes: 1, 3, 5, 7.. and we want 0, 1, 2, 3..
    getMeasure: function(i) { 
      var measure = ractive.get('measures')[(i-1)/2];
      return measure.measure;
    },
    getProportion: function(i) {
      var measure = ractive.get('measures')[(i-1)/2];
      return measure.proportion;
    },
    getX: function(i) {
      var cota = ractive.get('cotas')[i];
      return cota.x
    },
    getY: function(i) {
      var cota = ractive.get('cotas')[i];
      return cota.y
    }
  }
  
});

ractive.on('start', function(event) {
  ractive.set({'content': 'Click two points to set main reference.'});
  setCanvas();
});

ractive.on('do-measure', function(event) {

  // if click was for draggin cota, return
  // (detect if cursor was crosshair or move ?)
  if (event.original.srcElement.nodeName !== 'svg') {
    return;
  }

  // add clicked position
  addCoord(event);

  // update counter
  var counter = ractive.get('counter') + 1;
  ractive.set('counter', counter);
  
  // on second clicks:
  if (counter % 2 === 0) {
    
    addMeasure(counter-1);

    // make #measures table draggable
    if (counter === 3) {
      ('#measures').addClass('drag');
    }
  }
});

ractive.on('remove', function(event) {
  var i = (event.keypath).split('.')[1]; console.log(i);
  var thisarray = event.keypath.split('.')[0];
  if (thisarray === 'cotas') {
    // index points to
    console.log(thisarray);
  } else if (thisarray === 'measures') {
    // index points to 
    console.log(thisarray); console.log(ractive.get(thisarray));
  }
  ractive.get(thisarray).splice(i, 1);
  // TODO remove related svg circles and line
  console.log($('#canvas').find('.'+i));
});

// TODO after each reset, on first click error:
// Failed to compute "${format(cotas-1)}"
// then continues ok (number of errors cotas-i depends on number of cotas clicked)
ractive.on('restart', function() {
  ractive.set({
    total: 0,
    counter: 0,
    measures: [],
    cotas: []
  });
  $('#canvas circle, #canvas text, #canvas line').remove();
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

function addMeasure(i) { 
  var cota1 = ractive.get('cotas')[i-1]; 
      cota2 = ractive.get('cotas')[i]; 

  var cota = cota2.y - cota1.y; 
  var total = ractive.get('total');
  if (total) {
    var proportion = +((cota * 100 / total).toFixed(2));
  } else {
    ractive.set('total', cota);
    proportion = 100;
  }

  ractive.get('measures').push({measure: cota, proportion: proportion});
}

function setCanvas() {
  $('#canvas').height($('#item').height());
}