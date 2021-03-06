// SVG TEMPLATES
var svg_template = '<svg id="canvas" class="canvas" style="cursor: crosshair;" on-click="do_measure">' +
    '{{#each measures}}' + 
      '<g class="cota {{id}}">' +
        '{{#hasCota2}}' +
          '{{>measure}}' +
        '{{/hasCota2}}' +
        '{{>circle1}}' +
      '</g>' +
    '{{/each}}' +
    'Sorry, your browser does not support inline SVG.' +
  '</svg>',

    svg_measure = '{{>circle2}}' +
      '{{>rect}}' +
      '{{>text}}' +
      '{{>line}}',
 
    svg_circle1 = '<circle cx="{{cota1.x}}" cy="{{cota1.y}}" r="{{r}}" />',
    svg_circle2 = '<circle cx="{{cota1.x}}" cy="{{cota2.y}}" r="{{r}}" />',

    svg_text = '<text x="{{cota1.x}}" y="{{this.middlePoint()}}">' +
        '{{id}} {{this.value()}}px, {{this.proportion()}}%' +
      '</text>',
    svg_line = '<line x1="{{cota1.x}}" y1="{{cota1.y}}" x2="{{cota1.x}}" y2="{{cota2.y}}" />',
    svg_rect = '<rect x="{{cota1.x - 5}}" y="{{this.middlePoint() - 15}}" width="85" height="20" />';

// LAYOUT TEMPLATES
var button_delete = '<div class="relative">' +
      '<span class="delete" on-click="remove" on-hover="showPopup">X</span>' +
      '<div class="popup"><p>Delete</p></div></div>',
    button_reload = '<div class="relative">' +
      '<span class="reload" on-click="reload" title="reload" on-hover="showPopup"data-imgurl={{this}}>+</span>' +
      '<div class="popup"><p>Reload {{this}}</p></div></div>';


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

var url_enjoymondays = 'enjoyMondays.jpg';

// RACTIVE
var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  partials: {
    svg: svg_template,
    circle1: svg_circle1,
    circle2: svg_circle2,
    line: svg_line,
    rect: svg_rect,
    text: svg_text,
    measure: svg_measure,
    button_delete: button_delete,
    button_reload: button_reload
  },
  data: {
    measures: [],
    content: '',
    imageInput: '',
    imageURL: url_enjoymondays,
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
    },
    isFirstLoad: function() {
      return counter === 0;
    },
    isMainRef: false
  },
  // DISPLAY FUNCTIONS:
  updateDisplay: function(display) { 
    switch (display) {
      case 'image':
        hide('home');
        show('image');
        break;
      case 'menu':
        $('.side-menu').toggleClass('collapsed expanded');
        break;
    }
  },

  setMainRefMeasure: function() {
    var $image = $('.img-active');
    var h = $image.height();
    var cota1 = { x: $image.width()/2, y: 0 };
    var cota2 = { x: cota1.x, y: h };
    
    // add to measures 
    var measure = new Measure(cota1 ,1);
    measure.update(cota2);
    ractive.push('measures', measure);

    // set total
    total = measure.value();

    // update counter
    counter = 2;
  }

});


ractive.on({

  // MEASURE FUNCTIONS:

  'editMainReference': function() {
    ractive.set({
      'help_content': 'Click two points to set a new main reference.'
    });
    ractive.set('isMainRef', true);
  },

  'do_measure': function(event, args) {  
    // if click was on cota (TODO: edit, drag?), return
    if (event.original.srcElement.nodeName !== 'svg') {
      return;
    }

    // get current default id
    var id = +(counter/2).toFixed();

    // get clicked position
    var cota = getPos(event);

    // update counter
    counter++;

    // if is first of two clicks
    if (counter%2 == 1) {
      // create new measure and add it to measures
      ractive.push('measures', new Measure(cota, id + 1));
    
    // is second of two clicks
    } else {
      var measures = ractive.get('measures');
      var i = measures.length - 1;
      measures[i].update(cota);

      if (ractive.get('isMainRef')) {
        // change main reference
        measures[0] = measures[i];
        // remove from pushed position
        measures.pop();
        // update total
        total = measures[0].value();
        // update controller
        ractive.set('isMainRef', false);
      } 
      // update ractive measures array for rerendering
       ractive.set('measures', measures);
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
      toggle: true,
      toggle: false
    });
  },

  'setBg': function(event) {
    var id = event.original.target.value;
    setBg(id);
  },

  // IMAGE FUNCTIONS:

  // update loaded image
  'loadImage': function() { 
    if (ractive.get('imageInput') == '') return;
    ractive.set({
      'imageURL': ractive.get('imageInput'),
      'imageInput': '',
      'toggle': false
    });
    // save actual img path
    ractive.get('images').push(ractive.get('imageURL'));
    // update display
    this.updateDisplay('image');
    // set default main reference
    var t = getTransitionTime();
    setTimeout(function() {
      ractive.setMainRefMeasure()
    }, t + 100);
    if (ractive.get('isFirstLoad')) {
      showHelp();
    }
  },

  // reload image as actual
  'reload': function(event) {
    ractive.set('imageURL', ractive.get(event.keypath));
  },

  // MENU FUNCTIONS:

  // collapse/extend side-menu
  'toggleMenu': function() {
    this.updateDisplay('menu');
  },

  // HELP functions:

  'hideHelp': function() {
    hideHelp();
  },

  'showPopup': function(event) {
    $(event.original.target).next().toggle();
  }
});

function setBg(id) {
  $('svg .' + id + ' rect').css('width', $('svg .' + id + ' text').width() + 10 + 'px');
}

function getPos(event) {
  return pos = new Pos(event.original.offsetX, event.original.offsetY);
}

function hide(elem) {
  $('.'+elem).removeClass('active').addClass('inactive').hide();
}

function show(elem) {
  $('.'+elem).show().removeClass('inactive').addClass('active');
}

function getTransitionTime() {
  return $('.screen').css('transition-duration').split('s')[0]*1000;
}

function showHelp() {
  $('.help').removeClass('hidden');
}

function hideHelp() {
  $('.help').fadeOut();
}
