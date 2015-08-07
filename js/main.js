var svg_template = '<svg id="canvas" class="canvas" style="cursor: crosshair;" on-click="do-measure">' +
    '{{#each measures:i}}' + '{{i}}' + 
      '<g class="cota {{.id}}">' +
        '{{#this.hasCota2}}' +
          '{{>measure}}' +
        '{{/hasCota2}}' +
        '{{>circle}}' +
      '</g>' +
    '{{/each}}' +
    'Sorry, your browser does not support inline SVG.' +
  '</svg>';

var svg_measure = '{{>circle2}}' +
  '{{>rect}}' +
  '{{>text}}' +
  '{{>line}}';

// svg elements:
var svg_circle = '<circle cx="{{cota1.x}}" cy="{{cota1.y}}" r="{{r}}" />';
var svg_circle2 = '<circle cx="{{cota1.x}}" cy="{{cota2.y}}" r="{{r}}" />';

var svg_text = '<text x="{{this.cota1.x}}" y="{{this.middlePoint()}}">' +
    '{{this.id}} {{this.value()}}px, {{this.proportion()}}%' +
  '</text>';
var svg_line = '<line x1="{{this.cota1.x}}" y1="{{this.cota1.y}}" x2="{{this.cota1.x}}" y2="{{this.cota2.y}}" />';
var svg_rect = '<rect x="{{this.cota1.x -5}}" y="{{this.middlePoint() -15}}" width="85" height="20" />';


Pos = function(x, y) { 
  this.x = x ? x : false;
  this.y = y ? y : false;
}

Measure = function(cota, id) { 
  this.id = id;
  this.cota1 = cota ? cota : new Pos();
  this.cota2 = false;
  hasCota2 = false;
}

Measure.prototype.value = function() {
  return Math.abs(this.cota1.y - this.cota2.y);
}

Measure.prototype.proportion = function() {
  if (!total) { return 100; }
  return (this.value() * 100 / total).toFixed();
}

Measure.prototype.update = function(cota) { 
  this.cota2 = cota;
  this.hasCota2 = true;
}

Measure.prototype.middlePoint = function() {
  return Math.max(this.cota1.y, this.cota2.y) - this.value()/2;
}

var counter = 0;
var total = 0;

var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  partials: {
    svg: svg_template,
    circle: svg_circle,
    circle2: svg_circle2,
    line: svg_line,
    rect: svg_rect,
    text: svg_text,
    measure: svg_measure
  },
  data: {
    measures: [],
    content: '',
    imageInput: '',
    imageURL: 'enjoyMondays.jpg',
    images: [],
    r: 5,
    toggle: true,
    value: function() { 
      return this.value();
    },
    proportion: function() {
      return this.proportion();
    },
    middlePoint: function() {
      return this.middlePoint(); 
    }
  }

});

ractive.on({

  'start': function() {
    ractive.set({
      'content': 'Click two points to set main reference.',
      'toggle': false
    });
  },

  'do-measure': function(event) { 
    
    // if click was on cota (TODO: edit, drag?), return
    if (event.original.srcElement.nodeName !== 'svg') {
      return;
    }

    // update counter
    counter++;

    // get clicked position
    var cota = getPos(event);

    var l = ractive.get('measures').length;

    if (counter%2 == 1) {

      var id = l;
      // is first of two clicks = measure
      var measure = new Measure(cota, id);
      ractive.push('measures', measure);

    } else {
      var i = l - 1; 
      // is second of two clicks
      var measures = ractive.get('measures');
      measures[i].update(cota);
      ractive.set('measures', measures);

    }

    // set total
    if (counter == 2) {
      total = ractive.get('measures')[0].value();
    }

  },


  'remove': function(event) {
    var i = (event.keypath).split('.')[1]; 
    var thisarray = event.keypath.split('.')[0];

    if (thisarray == 'measures') {
      // update counter
      counter = counter - 2;
    }
    // remove measure or image url
    ractive.get(thisarray).splice(i, 1);
    
  },

  'restart': function() {
    ractive.set({
      content: '',
      total: false,
      measures: [],
      toggle: true
    });
    counter = 0;
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
    ractive.set('imageURL', ractive.get(event.keypath));
  },

  'setBg': function(event) {
    var id = event.original.target.value;
    setBg(id);
  }
});


function setBg(id) {
  $('svg .' + id + ' rect').css('width', $('svg .' + id + ' text').width() + 10 + 'px');
}

/////////

function getPos(event) {
  return pos = new Pos(event.original.offsetX, event.original.offsetY);
}
