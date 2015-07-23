jQuery(function($){
  var z = 1;

  // added
  var w = $('.drag').width(),
      h= $('.drag').height(),
      init = false,
      secondInit = false;


  $('.drag')
    .drag("start",function(){ 
      $( this ).css({
        'zIndex': z++
      });
    })
    .drag(function( ev, dd ){
      // mantain initial state:
      if (!init) {
        $(this).css({
          width: w,
          height: h,
          padding: 0,
          position: 'absolute',
        });
        init = true;
      } 
      // remove fixed measures otherwise doesn't rescale smaller
      if (init) {
        if (!secondInit) {
          $(this).css({
            width: 'auto',
            height: 'auto'
          });
          secondInit = true;
        }
      }

      $( this ).css({
        top: dd.offsetY,
        left: dd.offsetX,
        right: dd.offsetX + $(this).width()
      });
    });
});