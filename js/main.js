var svg_template = '<svg id="canvas" class="canvas" style="cursor: crosshair;" on-click="do-measure">' +
    '{{#cotas}}' + '<text>{{cota2.y}}</text>' +
      '<g class="cota {{i}}">' +
        '{{^doSecondCota}}' +
          '<rect x="{{cota1.x - 5}}" y="{{middlePoint(this) - 15}}" width="85" height="20" />' +
          '<text x="{{cota1.x}}" y="{{middlePoint(this)}}">' +
            '{{id}} {{d}}px, {{proportion}}%' +
          '</text>' +
          '<line x1="{{cota1.x}}" y1="{{cota1.y}}" x2="{{cota1.x}}" y2="{{cota2.y}}" />' +
          '<circle cx="{{cota1.x}}" cy="{{cota2.y}}" r="{{r}}" />' +
          '<circle cx="{{cota1.x}}" cy="{{cota1.y}}" r="{{r}}" />' +     
        '{{/}}' +
        '{{^doFirstCota}}' +
          '<circle cx="{{cota1.x}}" cy="{{cota1.y}}" r="{{r}}" />' +
        '{{/}}' + 
      '</g>' +
    '{{/cotas}}' +
    'Sorry, your browser does not support inline SVG.' +
  '</svg>';

var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  partials: {svg: svg_template},
  data: {
    cotas: [],
    total: false,
    counter: 0,
    content: '',
    imageInput: '',
    imageURL: 'enjoyMondays.jpg',
    images: [],
    r: 5,
    doSvg: true,
    doSecondCota: true,
    doFirstCota: true,
    middlePoint: function(cota) { 
      return (Math.max(cota.cota1.y, cota.cota2.y) - cota.d/2);
    }
  }
});

ractive.on({
  'start': function(event) {
    ractive.set({
      'content': 'Click two points to set main reference.',
      'doSvg': false
    });
  },

  'do-measure': function(event) {
    // if click was on cota (TODO: edit, drag?), return
    if (event.node.nodeName !== 'svg') {
      return;
    }
    // update counter
    var counter = ractive.get('counter') + 1; 
    ractive.set('counter', counter); 
    
    updateMeasures(counter, event);
  },

  'saveId': function(event) { 
    var id = $(event.node).attr('data-id'); 
    console.log(ractive.get(event.keypath));
    if (id) { 
      ractive.set(ractive.get(event.keypath).id, id); 
      var i = event.index.i; 
      setBg(i);
    }
  },

  'remove': function(event) {
    var thisarray = event.keypath.split('.')[0];

    if (thisarray === 'cotas') {
      var i = event.index.cota; console.log(i);
      // remove svg group
      $('.'+i).remove();
      // update counter
      ractive.set('counter', ractive.get('counter') - 1);
    } else {
      var i = event.index.i; console.log(event);
    }

    ractive.get(thisarray).splice(i, 1);
  },

  'restart': function() {
    ractive.set({
      content: '',
      total: false,
      counter: 0,
      cotas: [],
      doSvg: true,
      doSecondCota: true,
      doFirstCota: true
    });
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

function setBg(id) { 
  $('svg .' + id + ' rect').css('width', $('svg .' + id + ' text').width() + 10 + 'px');
}

function updateMeasures(counter, click) {  
  var coords = {x: click.original.offsetX, y: click.original.offsetY};
  var i = Math.floor((counter-1)/2); 
  // on second clicks
  if (counter%2 === 0) {  
    // object cota exists already in array cotas
    var cota = ractive.get('cotas')[i]; 
    cota.cota2 = coords;
    cota = calculate(cota); 
    ractive.set(ractive.get('cotas')[i], cota);
    ractive.set({
      'doSecondCota': false,
      'doFirstCota': true
    }); 
  } else { 
    var cota = {i: i, cota1: coords, id: ''};
    ractive.push('cotas', cota);
    ractive.set({
      'doSecondCota': true,
      'doFirstCota': false
    });  
  }
}

function calculate(cota) {
  cota.d = Math.abs(cota.cota2.y - cota.cota1.y);  
  if (ractive.get('total')) { 
    cota.proportion = +(cota.d * 100 / ractive.get('total')).toFixed();
  } else { 
    cota.proportion = 100;
    ractive.set('total', cota.d);
  }
  return cota;
}