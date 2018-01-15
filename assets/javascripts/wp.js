(function($) {
  $(document).ready(function(){

    $('video').each(function() {
      this.muted = true;
    });

    if ( $('.top-bar-section').children().length > 0 ) {
      $('#menu-toggler').removeClass('hide');
    }

    $('.main-services').each(function() {
      $('.columns', this).last().addClass('end');

      $('.modIconText', this).each(function() {
        $('.icon-text-advanced', this).hover(
          function() { $(this).css({ 'background': 'url(' + $(this).data('bg') + ') center center no-repeat', 'background-size': 'cover' }); },
          function() { $(this).css({ 'background': 'none' }) }
        );
      });

    });

    function resetMainServicesHeight() {
      $('.main-services').each(function() {
        $('.columns', this).height('auto');
      });

    }

    function calcMainServicesHeight() {
      $('.main-services').each(function() {

        var container = this;
        var maxHeight = 0

        $('.columns', this).each(function() {
          if ( $(this).height() > maxHeight ) {
            maxHeight = $(this).height();
          }
        });

        $('.columns', this).height(maxHeight);

      });
    }

    calcMainServicesHeight();

    $(window).on('resize', function() {
      resetMainServicesHeight();
      calcMainServicesHeight();
    });



  });

})(jQuery)