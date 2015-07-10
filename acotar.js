$(window).load(function() {

  alert('enter main ref 1');
  var cotas = []
  
  $('body')
    .css('cursor', 'crosshair')
    .on('click', function(e) { 
      e.preventDefault();
      acotar(e) })
    .append('<div class="button">Finished</div><div class="output"></div>');

  $('.button').on('click', function(e) {
    setProportions();
  })

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
     // proportions.push(+(partial / total).toFixed(2));
      proportions.push(partial * 100 / total);
    }

    $('.output')
      .append('<div class="main ref">Main ref: ' + total + '</div>')
      .append('<div class="partials">Partials: ' + partials + '</div>')
      .append('<div class="proportions">Proportion to main ref: ' + proportions + '</div>')

  }

});


