jQuery(function($){
  var z = 1;
  $('.drag')
    .drag("start",function(){ console.log('drag called');
      $( this ).css('zIndex', z++ );
    })
    .drag(function( ev, dd ){
      $( this ).css({
        top: dd.offsetY,
        left: dd.offsetX
      });
    });
});