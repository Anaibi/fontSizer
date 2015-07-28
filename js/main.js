var svg_template = '<svg id="canvas" class="canvas" style="cursor: crosshair;" on-click="do-measure">' +
    '{{#each cotas:i}}' +
      '{{#if i%2 === 1}}' +
        '<g class="cota {{(i-1)/2}}">' +
          '<rect x="{{getX(i-1) - 5}}" y="{{Math.max(y, getY(i-1)) - getMeasure(i)/2 - 15}}" width="85" height="20" />' +
          '<text x="{{getX(i-1)}}" y="{{Math.max(y, getY(i-1)) - getMeasure(i)/2}}">' +
            '{{getId(i)}} {{getMeasure(i)}}px, {{getProportion(i)}}%' +
          '</text>' +
          '<line x1="{{getX(i-1)}}" y1="{{getY(i-1)}}" x2="{{getX(i-1)}}" y2="{{y}}" />' +
          '<circle cx="{{getX(i-1)}}" cy="{{y}}" r="{{r}}" />' +
        '</g>' +
      '{{else}}' +
        '<g class="cota {{(i)/2}}">' +
          '<circle cx="{{x}}" cy="{{y}}" r="{{r}}" />' +
        '</g>' +
      '{{/if}}' +
    '{{/each}}' +
    'Sorry, your browser does not support inline SVG.' +
  '</svg>';

var ractive = new Ractive({
  el: '#ractive-container',
  template: '#template',
  partials: {svg: svg_template},
  data: {
    cotas: [],
    measures: [],
    total: false,
    counter: 0,
    content: '',
    imageInput: '',
    imageURL: 'enjoyMondays.jpg',
    images: [],
    r: 5,
    getMeasure: function(i) { 
      // i comes: 1, 3, 5, 7.. and we want 0, 1, 2, 3..
      return ractive.get('measures')[(i-1)/2].measure;
    },
    getProportion: function(i) {
      return ractive.get('measures')[(i-1)/2].proportion;
    },
    getId: function(i) {
      return ractive.get('measures')[(i-1)/2].id;
    },
    getX: function(i) {
      return ractive.get('cotas')[i].x
    },
    getY: function(i) {
      return ractive.get('cotas')[i].y
    },
    max: function(a, b) {
    },
    toggle: true
  }
});

ractive.on({
  'start': function(event) {
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
    // add clicked position
    addCoord(event);

    // update counter
    var counter = ractive.get('counter') + 1; 
    ractive.set('counter', counter); 
    
    // on second clicks:
    if (counter % 2 === 0) {
      addMeasure(counter-1);
    }
  },

  'remove': function(event) {
    var i = (event.keypath).split('.')[1]; 
    var thisarray = event.keypath.split('.')[0];

    if (thisarray === 'measures') {
      // remove svg group
      $('.'+i).remove();
      // update counter
      ractive.set('counter', ractive.get('counter') - 1);
    }

    ractive.get(thisarray).splice(i, 1);
  },

  'restart': function() {
    ractive.set({
      content: '',
      total: false,
      counter: 0,
      measures: [],
      cotas: [],
      toggle: true
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
  },

  'saveId': function(event) { 
    var id = $(event.original.target).attr('data-id'); 
    if (id) { 
      ractive.set(ractive.get(event.keypath).id, id);
      var i = (event.keypath).split('.')[1]; 
      setBg(i);
    }
  }
});

function addCoord(click) {
  ractive.push('cotas', {x: click.original.offsetX, y: click.original.offsetY});
}

function addMeasure(i) { 
  var cota1 = ractive.get('cotas')[i-1]; 
      cota2 = ractive.get('cotas')[i]; 

  var cota = Math.abs(cota2.y - cota1.y); 
  var total = ractive.get('total');
  if (total) {
    var proportion = +((cota * 100 / total).toFixed(2));
  } else {
    ractive.set('total', cota);
    proportion = 100;
  }

  var id = $('.' + i).find('td input').attr('value'); 

  ractive.push('measures', {measure: cota, proportion: proportion, id: ''}); 
}

function setBg(id) { console.log(id); 
  $('svg .' + id + ' rect').css('width', $('svg .' + id + ' text').width() + 10 + 'px');
}
