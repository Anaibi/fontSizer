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
    },
    img: { width: '100%', 'height': 'auto'},
    sidebar_w: '25%',
    complementW: function(t, p) { console.log(t);
      var units = t.split(parseInt(t))[1]; 
      console.log(parseInt(t) - parseInt(p) + units);
      return parseInt(t) - parseInt(p) + units;
    }
  }
});

ractive.on({
  'start': function(event) {
    ractive.set({'content': 'Click two points to set main reference.'});
  },

  'do-measure': function(event) {
    // if click was on cota (TODO: edit, drag?), return
    if (event.original.srcElement.nodeName !== 'svg') {
      return;
    }
    // add clicked position
    addCoord(event);

    // update counter
    var counter = ractive.get('counter') + 1; console.log(counter);
    ractive.set('counter', counter); console.log(counter);
    
    // on second clicks:
    if (counter % 2 === 0) {
      addMeasure(counter-1);
    }
  },

  'remove': function(event) {
    var i = (event.keypath).split('.')[1]; 
    var thisarray = event.keypath.split('.')[0];

    console.log(thisarray);
    if (thisarray === 'cotas') {
      // index points to
    } else if (thisarray === 'measures') {
      // index points to 
      console.log(ractive.get(thisarray));
    }

    ractive.get(thisarray).splice(i, 1);
    // TODO remove related svg circles and line
    console.log($('#canvas').find('.'+i));
  },

  // TODO after each reset, on first click error:
  // Failed to compute "${format(cotas-1)}"
  // then continues ok (number of errors cotas-i depends on number of cotas clicked)
  'restart': function() {
    ractive.set({
      total: false,
      counter: 0,
      measures: [],
      cotas: []
    });
    $('#canvas circle, #canvas text, #canvas line').remove();
  },

  // update loaded image
  'loadImage': function() { 
    ractive.set({
      'imageURL': ractive.get('imageInput'),
      'imageInput': ''
    });
  },

  // save actual img path
  'save': function() { 
    ractive.get('images').push(ractive.get('imageURL'));
  },

  // reload image as actual
  'reload': function(event) {
    ractive.set({
      'imageURL': ractive.get(event.keypath)
    });
  }
});

function addCoord(click) {
  ractive.push('cotas', {x: click.original.offsetX, y: click.original.offsetY});
}

function addMeasure(i) { console.log('addMeasure');
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

  ractive.push('measures', {measure: cota, proportion: proportion}); 
}

