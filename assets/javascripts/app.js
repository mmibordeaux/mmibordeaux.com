jQuery(document).ready(function() {
  // module connectors configuration
  jQuery('.mod').each(function() {
    jQuery(this).attr('data-connectors', '1');
  });
});

// extend Tc.Module Class
Tc.Module = Tc.Module.extend({
  onInitStyle: function(data) {
    var $ctx = this.$ctx;

    if(data['color_scheme']) {
      $ctx.removeClass(/colorScheme.+/);
      $ctx.addClass("colorScheme"+Tc.Utils.String.capitalize(data['color_scheme']));
    }

  }
});

jQuery.extend({
  randomColor: function() {
    return '#' + Math.floor(Math.random()*256*256*256).toString(16);
  }
});

(function(removeClass) {
  jQuery.fn.removeClass = function(value) {
    if(value && typeof value.test === 'function') {
      for(var i = 0; i < this.length; i++) {
        var elem = this[i];
        if( elem.nodeType === 1 && elem.className ) {
          var classNames = elem.className.split(/\s+/);
          for(var n = 0; n < classNames.length; n++) {
            if(value.test(classNames[n])) {
              classNames.splice(n, 1);
            }
          }
          elem.className = jQuery.trim(classNames.join(" "));
        }
      }
    } else {
      removeClass.call(this, value);
    }

    return this
  }
})(jQuery.fn.removeClass);

jQuery(document).ready(function() {
  jQuery('html').removeClass('no-js');
});

jQuery(document).foundation();


(function($) {
  "use strict";
  $(document).ready(function() {

    // var the_words = [
    //   '<strong>Creating solutions</strong> for any visual identity project',
    //   ' <strong>Join</strong> us in happiness',
    // ];
    // var the_word_index = 0;
    // var update_the_word = function() {
    //   if ( the_word_index >= the_words.length ) {
    //     the_word_index = 0;
    //   }

    //   $('#to-be-update').html(the_words[the_word_index]);

    //   the_word_index++
    // }

    // setInterval(update_the_word, 3000);



    var defaultOpts = {
      anchors: ["home", "philosophy", "services", "milestones", "works", "team", "blog", "contact"],
      navigationTooltips: ["home", "philosophy", "services", "milestones", "works", "team", "blog", "contact"]
    };

    var personalOpts = {
      anchors: ["home", "about", "services", "works", "blog", "contact"],
      navigationTooltips: ["home", "about", "services", "works", "blog", "contact"]
    };


    if ( $('#fullpage').length > 0 ) {
      // to fix the fullpage section content flash
      $('body').removeClass('invisible');
      $('#fullpage').fullpage({
        verticalCentered: false,
        navigation: true,
        navigationPosition: 'right',
        resize: false,
        responsive: 960,
        navigationTooltips: $('#fullpage').hasClass('personal') ? personalOpts.navigationTooltips : defaultOpts.navigationTooltips,
        anchors: $('#fullpage').hasClass('personal') ? personalOpts.anchors : defaultOpts.anchors,
        afterRender: function() {
          var popins = $($('#fullpage .section')[0]).find('.box-popin');

          for(var i = 0; i < popins.length; i++) {
            $(popins[i]).addClass('appear');
          }

        },
        afterLoad: function( anchorLink, index ) {
          // console.log($($('#fullpage .section')[index]).find('.box-popin').length);

          var popins = $($('#fullpage .section')[index-1]).find('.box-popin');

          for(var i = 0; i < popins.length; i++) {
            $(popins[i]).addClass('appear');
          }

          var activeSection = $('.section.active');

          $('#fp-nav').removeClass(/color\-.+/);

          if ( activeSection.data('nav-color') ) {
            $('#fp-nav').addClass("color-" + activeSection.data('nav-color'));
          }

          $('.contain-to-grid').addClass('white');

          // console.log(activeSection.data('topbar-nowhite'));

          if ( activeSection.data('topbar-nowhite') ) {
            $('.contain-to-grid').removeClass('white');
          }

        }
      });
    }

    var videos = $('video');
    for(var i = 0; i < videos.length; i++) {
      videos[i].muted = true;
    }

    $('.fadeinleft, .fadeinright, .fadein, .popin, .moveup, .diamond-milestones-wrapper').appear(function() {
      var delay = $(this).data('delay');
      var that = this;

      setTimeout(function() {
        $(that).addClass('appear');
      }, delay)

    });


    $(window).scroll(function() {

      var scroll = $(window).scrollTop();

      if ( scroll >= 1 ) {
        $('body').addClass('shrink');
      } else {
        $('body').removeClass('shrink');
      }

    });

    $('form#contact_form').validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: "https://formspree.io/" + $('input[name="recipient"]', form)[0].value,
          data: $(form).serialize(),
          dataType: "json",
          success: function(data) {
            if(data.success) {                          
              $(form).trigger('reset');
              $('#thanks').show().removeClass('hide').fadeOut(5000);
            }
          }
        });
        return false;
      }
    });

    if($('.masonry-container').length > 0) {

      var containers = $('.masonry-container');

      for(var i = 0; i < containers.length; i++) {
        var container = containers[i];

        // initialize Masonry after all images have loaded
        $(container).imagesLoaded(function() {

          setTimeout(function() {
            window.msnry = new Masonry($(container)[0], {
              itemSelector: '.mod',
              // columnWidth: '.mod',
              gutter: 30
            });

            // window.msnry.layout();

          }, 10);

        });
      }

    }


    // onepage nav scroll
    if ( $("nav.top-bar.onepage").length > 0 ) {
      $('.top-bar-section a[href=#top]').closest('li').addClass('active');

      var ctx = $("nav.top-bar.onepage");

      // var headerHeight = ctx.height();
      // $(window).scroll(function() {
      //   headerHeight = ctx.height();
      //   console.log(headerHeight);
      // });
      var headerHeight = 59;

      // use to mark whether the scrolling is caused by clicking
      var clickScrolling = false;
      // cache for current anchor id
      var currentAnchorId;

      $('.top-bar-section a', ctx).click(function(event) {
        $('.top-bar-section a', ctx).closest('li').removeClass('active');
        $(this).closest('li').addClass('active');
        clickScrolling = true;

        // console.log($(this).attr('href').offset());
        try {
          if ( $(this).attr('href') == '#top' ) {
            var distance = 0;
          } else {
            var distance = $($(this).attr('href')).offset().top - headerHeight + 'px';
          }

          // console.log(distance);

          $('html, body').stop().animate({
            scrollTop: distance
          }, { duration: 1200, easing: "easeInOutExpo", complete: function() { clickScrolling = false; } });
          event.preventDefault();
        } catch(e) {}
      });


      // hightlight nav when scrolling
      var anchors = $('.top-bar-section a[href^="#"]', ctx).map(function() {
        // console.log(this);
        var anchor = $($(this).attr('href'));
        if(anchor.length) { return anchor; }
      });

      var anchors = [];

      $(window).scroll(function() {
        if(clickScrolling) return false;

        var fromTop = $(this).scrollTop();
        var passedAnchors = anchors.map(function() {
          // add 1 to make the current nav change 1px before it should when scrolling top to bottom
          if(fromTop + headerHeight + 1 >= $(this).offset().top)
            return this;
        });
        // get the last anchor in the passedAnchors as the current one
        var currentAnchor = passedAnchors[passedAnchors.length - 1];
        if(currentAnchor) {
          if(currentAnchorId !== currentAnchor.attr('id')) {
            currentAnchorId = currentAnchor.attr('id');
            $('.top-bar-section a', ctx).closest('li').removeClass('active');
            $('.top-bar-section a[href=#'+currentAnchorId+']', ctx).closest('li').addClass('active');
          }
        }

      });
    }

    $('#menu-toggler').click(function() {
      $('.top-bar-section').toggle();
      return false;
      // $('.top-bar-section').slideToggle('slow');
      // $('.top-bar-section').toggle('slide');
    });

    $('.scroll-down').click(function() {
      // $.fn.fullpage.moveSectionDown();
    });

    // var resizeTimer;

    // $(window).resize(function() {

    //   clearTimeout(resizeTimer);

    //   resizeTimer = setTimeout(function() {
    //     inline_nav('#section6', '.box:not(.slick-cloned) .modBlogPost', '.box .modBlogPost');

    //     var posts = $('.mod.modBlogPost');

    //     for(var i = 0; i < posts.length; i++) {
    //       var post = posts[i];

    //       var options = {
    //         autoplay: true,
    //         pauseOnHover: false,
    //         dots: true,
    //         speed: 1500,
    //         arrows: false
    //       };

    //       // use if condition, try to fix _.$slides is null issue
    //       if ( $('.images', $(post))[0] && !$('.images', $(post))[0].slick ) {
    //         $('.images', $(post)).slick(options);
    //       }

    //     }

    //   }, 250)

    // });

    // inline_nav('#section6', '.box:not(.slick-cloned) .modBlogPost', '.box .modBlogPost a');
    // inline_nav('#section4', '.gallery li a', ".gallery li a");

    // inline_nav('#section4', '.box:not(.slick-cloned) .modBlogPost', '.box .modBlogPost a');
    // inline_nav('#section3', '.gallery li a', ".gallery li a");

    // inline_nav('#demo-1-works', '.gallery li a', ".gallery li a");

    function inline_nav(context_sel, items_sel, clickable_items_sel) {
      var items = $(items_sel, $(context_sel));
      var modal = $('.modal', $(context_sel));
      var clickable_items = $(clickable_items_sel, $(context_sel));
      var links = [];

      for(var i = 0; i < items.length; i++) {
        links.push($(items[i]).data('link'));
      }

      var slider_tick = function(context_sel) {
        $('.modal', $(context_sel)).imagesLoaded(function() {
          $('.slides', $(".modal", $(context_sel))).slick({
            autoplay: true,
            pauseOnHover: false,
            dots: true,
            speed: 1500,
            arrows: false
          });

          $('.modal .content', $(context_sel)).css('visibility', 'visible');
        });
      }

      for(var i = 0; i < clickable_items.length; i++) {
        var item = clickable_items[i];

        $(item).click(function(event) {
          $('body').addClass('no-overflow');

          // console.log(event.target);
          //
          if ($(event.target).is("button")) {
            return false;
          }

          var link = $(this).data('link');
          // console.log(link);
          var index = links.indexOf(link);

          // console.log(index);

          $('.modal .content', $(context_sel)).data('index', index);

          $.ajax({
            url: link,
            success: function(result) {
              $('.modal .content', $(context_sel)).html(result);
              modal.show();
              slider_tick(context_sel);
            }
          });

          return false;
        });
      }


      var close_buttons = $('.modal a.close', $(context_sel));

      for(var i = 0; i < close_buttons.length; i++) {
        var button = close_buttons[i];

        $(button).click(function() {
          modal.hide();
          $('body').removeClass('no-overflow');
          $.fn.fullpage.setAllowScrolling(true);
          return false;
        })
      }



      var navs = $('.modal ul.nav li a', $(context_sel));

      for(var i = 0; i < navs.length; i++) {
        var nav = navs[i];

        $(nav).click(function() {

          var current = $('.modal .content', $(context_sel)).data('source');
          var current_index = $('.modal .content', $(context_sel)).data('index');

          if ( isNaN(current_index) ) return false;

          // console.log(current_index);

          var target = null;
          var target_index;

          if ( $(this).attr('href') == '#prev' ) {
            if ( current_index != 0 ) {
              target_index = current_index - 1;
              // console.log(target_index);
              target = $(items[target_index]).data('link');
            }

          } else {
            if ( current_index + 1 != items.length ) {
              target_index = current_index + 1;
              // console.log(target_index);
              target = $(items[target_index]).data('link');
            }
          }

          $('.modal .content', $(context_sel)).data('index', target_index);

          if ( target ) {
            $.ajax({
              url: target,
              success: function(result) {
                $('.modal .content', $(context_sel)).css('visibility', 'hidden');
                $('.modal .content', $(context_sel)).html(result);
                $('.modal .content', $(context_sel)).data('source', target);
                slider_tick(context_sel);
              }
            });
          }

          return false;
        })

      }

    }

    // hide it in the html to prevent from flash on load
    $('#section1').show();

    $('.border-wrapper').hover(
      function() {
        $(this).addClass('reverse');
      },
      function() {
        $(this).removeClass('reverse');
      }
    );

    var gmaps = $('.gmap');

    for(var i = 0; i < gmaps.length; i++) {
      var gmap = gmaps[i];

      var lat = parseFloat($(gmap).attr('data-lat'));
      var lng = parseFloat($(gmap).attr('data-lng'));
      var location = $(gmap).attr('data-location');
      var that = $(gmap);


      var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];


      if(!(lat && lng) && location) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location.split(/\n+/).join(', ') }, function(results, status) {
          if( status == google.maps.GeocoderStatus.OK ) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            that.gMap({ zoom: 14, latitude: lat, longitude: lng, markers: [ { latitude: lat, longitude: lng - 0.03 } ], mapTypeControl: false, zoomControl: false, scrollwheel: false, maptype: google.maps.MapTypeId.TERRAIN, styles: styles });
          }
        });
      } else {
        $(gmap).gMap({ zoom: 15, latitude: lat, longitude: lng, markers: [ { latitude: lat, longitude: lng } ], mapTypeControl: false, zoomControl: false, scrollwheel: false });
      }
    }


  });
})(jQuery);
(function($) {
  Tc.Module.BarGraph = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var bars = $(".bars", $ctx);

      for(var i = 0; i < bars.length; i++) {
        var bar = bars[i];
        var highlights = $('> li > .highlighted', $(bar));

        for ( var j = 0; j < highlights.length; j++ ) {

          var highlight = highlights[j];

          $(highlight).appear(function() {
            var percent = $(this).attr("data-percent");
            // $bar.html('<p class="highlighted"><span class="tip">'+percent+'%</span></p>');
            // http://stackoverflow.com/questions/3363035/jquery-animate-forces-style-overflowhidden
            $(this).animate({
              'width': percent + '%'
            }, 1700, function() { $(highlight).css('overflow', 'visible'); });
          });

        }
      }

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.BlogPost = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('slick.min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      if($ctx.find('img, .images').length == 0) {
        $ctx.addClass('no-media');
      }

      $('.images', $ctx).slick({
        autoplay: true,
        pauseOnHover: false,
        dots: true,
        speed: 1500,
        arrows: false
      });

      $('.images', $ctx).css('height', 'auto');

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.BlogPostSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;


      var outSlider = function() {
        $('.slides', $ctx).slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 4000,
          pauseOnHover: false,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 568,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });
      }

      outSlider();

      var fix_for_blog_post_slider = function() {
        // init slick for cloned ones
        // should limit to $ctx
        // otherwise will cause _.$slides is null issue
        var posts = $('.mod.modBlogPost', $ctx);

        for(var i = 0; i < posts.length; i++) {
          var post = posts[i];

          // use if condition, try to fix _.$slides is null issue
          if ( $('.images', $(post))[0] && !$('.images', $(post))[0].slick ) {
            $('.images', $(post)).slick({
              autoplay: true,
              pauseOnHover: false,
              dots: true,
              speed: 1500,
              arrows: false
            });
          }

        }

        $('.images', $ctx).css('height', 'auto');
      }

      setTimeout(function() {
        fix_for_blog_post_slider();
      }, 250);

      $('.boxes', $ctx).on('beforeChange', function() {
        fix_for_blog_post_slider();
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.BoxedSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('slick.min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var timeout = $ctx.data('timeout');

      // console.log(timeout);

      if ( timeout ) {
        var autoplay = true;
      } else {
        var autoplay = false;
      }

      // console.log(autoplay);

      $('.slides', $ctx).slick({
        autoplay: autoplay,
        pauseOnHover: false,
        dots: true,
        speed: 1500,
        arrows: false
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.BoxedTextSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('slick.min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;




      // $('.boxes', $ctx).slick({
      //   slidesToShow: 3,
      //   slidesToScroll: 1,
      //   autoplay: false,
      //   autoplaySpeed: 3000,
      //   pauseOnHover: false,
      //   responsive: [
      //     {
      //       breakpoint: 1024,
      //       settings: {
      //         slidesToShow: 2,
      //         slidesToScroll: 1
      //       }
      //     },
      //     {
      //       breakpoint: 568,
      //       settings: {
      //         slidesToShow: 1,
      //         slidesToScroll: 1
      //       }
      //     }
      //   ]
      // });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.CallToAction = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);
(function($) {
  Tc.Module.Clients = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('slick.min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var slides_to_show = $ctx.data('slides_to_show');

      $('.clients', $ctx).slick({
        slidesToShow: slides_to_show,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          }
        ]
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.DefaultSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.sequence-min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var options = {
        nextButton: true,
        prevButton: true,
        autoPlay: true,
        autoPlayDelay: 3000,
        pauseButton: true,
        cycle: true,
        // preloader: true,
        animateStartingFrameIn: true,
        pagination: true,
        reverseAnimationsWhenNavigatingBackwards: true,
        preventDelayWhenReversingAnimations: true,
        fadeFrameWhenSkipped: false,
        swipeEvents: {
          left: "next",
          right: "prev"
        },
        pauseOnHover: false
      }

      var autostop = $('.sequence', $ctx).data('autostop') == 'on' ? true : false;
      var timeout = $('.sequence', $ctx).data('timeout');

      if ( timeout == '0' ) {
        options.autoPlay = false;
      } else {
        options.autoPlay = true;
        options.autoPlayDelay = parseInt(timeout, 10);
      }

      if ( autostop ) {
        options.autoStop = true;
      } else {
        options.autoStop = false;
      }

      // console.log(options);

      var sequence = $(".sequence", $ctx).sequence(options).data("sequence");
      sequence.beforeCurrentFrameAnimatesOut = function() {
        var sequence = this;
        var removeStatic = function() {
          jQuery(".frame.static").removeClass('static');
          if ( !window.sequenceAutoStarted && sequence.settings.autoPlay ) {
            sequence.startAutoPlay(sequence.settings.autoPlayDelay);
            window.sequenceAutoStarted = true;
          }
        }
        setTimeout(removeStatic, 1000);

        // when the next frame is the last one
        if ( sequence.nextFrameID == sequence.frames.length && options.autoStop ) {
          // console.log(sequence.nextFrameID);
          sequence.stopAutoPlay();
        }

      }


    }
  })
})(Tc.$);
(function($) {
  Tc.Module.FullscreenSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var fullscreen_slide = function() {
        if ( !$ctx.hasClass('fullheight') ) {
          $('.fullscreen_slideshow', $ctx).width($(window).width());
        }
        if( $ctx.hasClass('force')) {
          $('.fullscreen_slideshow', $ctx).height($(window).height());
        } else {
          $('.fullscreen_slideshow', $ctx).height($(window).height() - $('.top-bar').height());
        }
      }

      fullscreen_slide();

      $(window).on('resize', fullscreen_slide);

      var options = {
        nextButton: true,
        prevButton: true,
        autoPlay: false,
        autoStop: true,
        autoPlayDelay: 3000,
        pauseButton: true,
        cycle: true,
        // preloader: true,
        animateStartingFrameIn: true,
        pagination: true,
        reverseAnimationsWhenNavigatingBackwards: true,
        preventDelayWhenReversingAnimations: true,
        fadeFrameWhenSkipped: false,
        swipeEvents: {
          left: "next",
          right: "prev"
        },
        pauseOnHover: false
      }

      var autostop = jQuery('.fullscreen_slideshow', $ctx).data('autostop') == 'on' ? true : false;
      var timeout = jQuery('.fullscreen_slideshow', $ctx).data('timeout');

      if ( timeout == '0' || !timeout ) {
        options.autoPlay = false;
      } else {
        options.autoPlay = true;
        options.autoPlayDelay = parseInt(timeout, 10);
      }


      if ( autostop ) {
        options.autoStop = true;
      } else {
        options.autoStop = false;
      }

      var fullscreen = jQuery(".fullscreen_slideshow", $ctx).sequence(options).data("sequence");

      fullscreen.beforeCurrentFrameAnimatesOut = function() {
        var sequence = this;
        var removeStatic = function() {
          jQuery(".frame.static").removeClass('static');

          if ( !window.fullSequenceAutoStarted && sequence.settings.autoPlay ) {
            sequence.startAutoPlay(sequence.settings.autoPlayDelay);
            window.fullSequenceAutoStarted = true;
          }
        }
        setTimeout(removeStatic, 1000);
        // when the next frame is the last one
        if ( sequence.nextFrameID == sequence.frames.length && options.autoStop ) {
          sequence.stopAutoPlay();
        }
      }

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.Gallery = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      // function pixelized_dimensions(resize) {
      //   $('.item > a', $ctx).css({
      //     width: '99%',
      //     height: 'auto'
      //   });

      //   if(resize) {
      //     $('.item > a', $ctx).css({
      //       width: Math.floor($('.item > a', $ctx).width()),
      //       height: Math.floor($('.item > a', $ctx).height())
      //     });
      //   }
      // }

      // pixelized_dimensions($.browser.mozilla);

      // if(!$.browser.msie) {
      //   var timer;
      //   $(window).resize(function() {
      //     clearTimeout(timer);
      //     timer = setTimeout(function() {
      //       pixelized_dimensions(true);
      //     }, 100);
      //   });
      // }

      $('.gallery-nav ul li a', $ctx).click(function() {

        $('.gallery-nav ul li').removeClass('current');
        $(this).closest('li').addClass('current');

        var cat = $(this).attr('data-cat');

        var gallery = $('.gallery-nav').closest('.modGallery').find('ul.gallery');

        if (cat === 'all') {
          $('li', gallery).removeClass('hidden');
        } else {
          var lis = $('li', gallery);

          for( var i = 0; i < lis.length; i++ ) {
            var li = lis[i];
            if ($(li).hasClass(cat)) {
              $(li).removeClass('hidden');
            } else {
              $(li).addClass('hidden');
            }
          }
        }

        return false;

      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.IconText = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);
(function($) {
  Tc.Module.MasonryGallery = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var items = $('.gallery li', $ctx);

      var gutter = $ctx.data('gutter');

      if ( !gutter ) { gutter = 0 };

      for( var i = 0; i < items.length; i++ ) {
        var item = items[i];
        $(item).data('masonry-id', i);
      }

      var msnry = new Masonry($('.gallery')[0], { itemSelector: 'li', gutter: gutter, isInitLayout: false, columnWidth: ".modMasonryGallery li:not(.wide)" });

      window.msnry = msnry;

      $('.gallery', $ctx).imagesLoaded( function() {
        // setTimeout(function() {})
        // console.log($('#main').width());
        // console.log($('body').width());
        // console.log($('.gallery').width());
        msnry.layout();
      });

      $('.gallery-nav ul li a', $ctx).click(function() {

        $('.gallery-nav ul li').removeClass('current');
        $(this).closest('li').addClass('current');

        var cat = $(this).attr('data-cat');

        var gallery = $('.gallery-nav').closest('.mod').find('ul.gallery');

        if (cat === 'all') {

          // msnry.reveal(masonryItems);
          // TODO:
          // 1. remove all
          // 2. add all
          //

          var exists = $('.gallery li', $ctx);
          // console.log(exists);
          var elems = [];


          for( var i = 0; i < items.length; i++ ) {
            var item = items[i];
            var skip = false;

            for(var j = 0; j < exists.length; j++ ) {
              var exist = exists[j];
              if ($(item).data('masonry-id') == $(exist).data('masonry-id')) {
                skip = true;
              }
            }

            if (!skip) {
              ($('.gallery', $ctx)[0]).appendChild($(item)[0]);
              elems.push($(item)[0]);
            }

          }

          msnry.prepended(elems);

        } else {

          var lis = $('li', gallery);

          for(var i = 0; i < lis.length; i++) {
            var li = lis[i];

            if (!$(li).hasClass(cat)) {
              msnry.remove($(li));
            }
          }

          var exists = $('.gallery li', $ctx);
          var elems = [];

          for( var i = 0; i < items.length; i++) {
            var item = items[i];
            var skip = false;

            for( var j = 0; j < exists.length; j++) {
              var exist = exists[j];

              if ($(item).data('masonry-id') == $(exist).data('masonry-id')) {
                skip = true;
              }
            }


            if ( $(item).hasClass(cat) && !skip) {
              ($('.gallery', $ctx)[0]).appendChild($(item)[0]);
              elems.push($(item)[0]);
            }
          }

          msnry.appended(elems);

        }

        msnry.layout();

        // console.log(items);

        return false;

      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.Milestone = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.appear.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      $ctx.appear(function() {
        $('strong', $ctx).countTo({
          speed: 1400
        });
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.PriceBox = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);
(function($) {
  Tc.Module.SectionHeader = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);
(function($) {
  Tc.Module.StaggerGallery = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;


      if ( !$ctx.hasClass('alt') ) {

        var images = $('.wrapper .large-8 a img', $ctx);

        // console.log(images.length);

        for(var i = 0; i < images.length; i++) {
          var image = images[i];
          var src = $(image).attr('src');
          $(image).closest('a').css('background-image', 'url(' + src +')');
        }

      }


    }
  })
})(Tc.$);
(function($) {
  Tc.Module.StylePanel = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.cookie.js', 'plugin', 'onBinding');
      // this.require('json2.js', 'plugin', 'onBinding');
      // this.require('jquery.url.js', 'plugin', 'onBinding');
    },
    setCookie: function(key, value) {
      var cookie = JSON.parse($.cookie('wrap_html') || '{}') || {};
      cookie[key] = value;
      $.cookie('wrap_html', JSON.stringify(cookie), { expires: 7, path: '/' });
    },
    readCookie: function(key) {
      var cookie = JSON.parse($.cookie('wrap_html') || '{}') || {};
      if(key) {
        return cookie[key];
      } else {
        return cookie;
      }
    },
    reloadMod: function() {
      // to make css pie work
      $('.ie8 .mod *').each(function() {
        var klass = $(this).attr('class');
        $(this).attr('class', klass);
      });
    },
    afterBinding: function() {
      // $.cookie('wrap_html', null);
      var $ctx = this.$ctx;

      if(this.readCookie('bg_pattern')) {
        $('body').removeClass(/pattern\-\d+/);
        $('body').addClass(this.readCookie('bg_pattern'));
      }

      if(this.readCookie('color_scheme')) {
        $('body').removeClass(/colorScheme.+/);
        $('body').addClass("colorScheme"+Tc.Utils.String.capitalize(this.readCookie('color_scheme')));
      }

      var path = window.location.pathname;


        if ( path.match(/^\/wrap(\/)?(\/\w+\.html)?$|(\/demo\-[2-3])/) ) {


        var color_scheme = this.readCookie('color_scheme');

        // console.log(color_scheme);
        var path = $('.title-area .name img').attr('src').split('/').slice(0, -1).join('/');

        if ( !color_scheme || color_scheme == 'yellow' ) {
          $('.title-area .name img').attr('src', path + '/' + 'logo.png');
        } else {
          $('.title-area .name img').attr('src', path + '/' + 'logo-black.png');
        }

      }

      this.fire('initStyle', this.readCookie());

      this.reloadMod();

      if($.url().param('screenshot')) {
        $ctx.hide();
      }
    },
    onBinding: function() {
      var $ctx = this.$ctx;
      var that = this;

      // $ctx.css('margin-left', '0');

      $('.panel-container').find('.bg_pattern').click(function() {
        that.setCookie('bg_pattern', $(this).attr('id'));
        that.afterBinding();
        return false;
      });

      $('.panel-container').find('.color_scheme').click(function() {
        that.setCookie('color_scheme', $(this).attr('id'));
        that.afterBinding();
        return false;
      });

      $('.switch', $ctx).click(function() {
        if($(this).hasClass('to-open')) {
          $(this).removeClass('to-open');
          $(this).addClass('to-close');
          $ctx.stop().animate({"left": $('.panel-container', $ctx).outerWidth() }, {duration: 500});
        } else {
          $(this).removeClass('to-close');
          $(this).addClass('to-open');
          $ctx.stop().animate({"left": "0px"}, {duration: 500});
        }

        return false;
      });

      $('.demo', $ctx).change(function() {

        var target = $(this).val();

        if (target) {
          var host = window.location.host;
          if ( target == 'demo-1' ) {

              window.location = 'http://' + host + '/wrap/' + 'index.html';

          } else {

              window.location = 'http://' + host + '/wrap/' + target + '/index.html';

          }

        }

        return false;
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.TeamMember = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);
(function($) {
  Tc.Module.Testimonials = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('slick.min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var show_dots = true;

      if ($ctx.hasClass('simple')) {
        show_dots = false;
      }

      $('.items', $ctx).slick({
        autoplay: true,
        pauseOnHover: false,
        dots: show_dots,
        speed: 1500,
        arrows: false
      });

    }
  })
})(Tc.$);
(function($) {
  Tc.Module.Timeline = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.ui.core.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;
    }
  })
})(Tc.$);



