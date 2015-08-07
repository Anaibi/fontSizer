// SVG TEMPLATES
var svg_template = '<svg id="canvas" class="canvas" style="cursor: crosshair;" on-click="do-measure">' +
    '{{#each measures}}' + 
      '<g class="cota {{id}}">' +
        '{{#hasCota2}}' +
          '{{>measure}}' +
        '{{/hasCota2}}' +
        '{{>circle}}' +
      '</g>' +
    '{{/each}}' +
    'Sorry, your browser does not support inline SVG.' +
  '</svg>',

    svg_measure = '{{>circle2}}' +
      '{{>rect}}' +
      '{{>text}}' +
      '{{>line}}',

    svg_circle = '<circle cx="{{cota1.x}}" cy="{{cota1.y}}" r="{{r}}" />',
    svg_circle2 = '<circle cx="{{cota1.x}}" cy="{{cota2.y}}" r="{{r}}" />',

    svg_text = '<text x="{{cota1.x}}" y="{{this.middlePoint()}}">' +
        '{{id}} {{this.value()}}px, {{this.proportion()}}%' +
      '</text>',
    svg_line = '<line x1="{{cota1.x}}" y1="{{cota1.y}}" x2="{{cota1.x}}" y2="{{cota2.y}}" />',
    svg_rect = '<rect x="{{cota1.x - 5}}" y="{{this.middlePoint() - 15}}" width="85" height="20" />';

// LAYOUT TEMPLATES
var button_delete = '<span class="delete" on-click="remove" title="delete">X</span>';


// 
Pos = function(x, y) { 
  this.x = x ? x : false;
  this.y = y ? y : false;
}

Measure = function(cota, id) { 
  this.id = id ? id : false;
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

// GLOBAL VARS
var counter = 0;
var total = 0;

// RACTIVE
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
    measure: svg_measure,
    button_delete: button_delete
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

  // MEASURE FUNCTIONS:

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

    // get current default id
    var id = +(counter/2).toFixed();

    // update counter
    counter++;

    // get clicked position
    var cota = getPos(event);

    if (counter%2 == 1) { 
      // is first of two clicks = measure
      ractive.push('measures', new Measure(cota, id + 1));

    } else {
      // is second of two clicks
      var i = ractive.get('measures').length - 1;
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
    var thisarray = event.keypath.split('.')[0],
        i = event.keypath.split('.')[1];

    // remove measure or image url
    ractive.get(thisarray).splice(i, 1);
  },

  'restart': function() {
    counter = 0;
    ractive.set({
      content: '',
      total: false,
      measures: [],
      toggle: true
    });
  },

  'setBg': function(event) {
    var id = event.original.target.value;
    setBg(id);
  },

  // IMAGE FUNCTIONS:

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
  }
});

function setBg(id) {
  $('svg .' + id + ' rect').css('width', $('svg .' + id + ' text').width() + 10 + 'px');
}

function getPos(event) {
  return pos = new Pos(event.original.offsetX, event.original.offsetY);
}
