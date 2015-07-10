    var total, partials, proportions;

    var ractive = new Ractive({
      el: '#ractive-container',
      template: '#template',
      data: {
        total: false,
        partials: [],
        proportions: [],
        started: false,
        counter: 0,
        clicked: false,
        content: ''
      }
    });

    ractive.on('start', function(event) {
      ractive.set({'content': 'Enter main reference'});
      ractive.set({started: true})
    });

    /* TODO
      ractive.on('measure', function(event) {
      ractive.set({
        clicked: true,
        counter: cotas.length
      });
      console.log(this.el);
    //  cotas.push(event.pageY);
    //  if (ractive.get('counter') === 2) {
    //    ractive.set('total', cotas[1] - cotas[0]);
    //  }
    });
    */

    ractive.on('end', function(event) {
      console.log('finished measuring');
      setProportions();
    });

    ractive.observe( 'partials', function () {
      console.log('observed');
    });

    ractive.observe( 'total', function () {
      //
    });

    var cotas = []
  
    $('#item').on('click', function(e) { 
      e.preventDefault();
      acotar(e);
    });

    function acotar(e) {
      cotas.push(e.pageY);
    }

    function setProportions() {
    var total = cotas[1] - cotas[0];

    var partials = [],
        proportions = [];

    for (var i=3; i<cotas.length; i++) {
      partials.push(cotas[i] - cotas[i-1]);
      i++;
    }
  
    for (var partial of partials) {
      proportions.push(+(partial * 100 / total).toFixed(2));
    }

    ractive.set({
      total: total,
      partials: partials,
      proportions: proportions
    });
  }