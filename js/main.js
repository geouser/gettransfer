// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                              CONTACTS FORM
    ---------------------------*/
    $('input, textarea').each(function(index, el) {
        if ( !$(this).val() ) {
            $(this).parent().removeClass('focus');
        } else {
            $(this).parent().addClass('focus');
        }
    });
    $('input, textarea').on('focusin', function(event) {
        event.preventDefault();
        $(this).parent().addClass('focus');
    });
    $('input, textarea').on('focusout', function(event) {
        event.preventDefault();
        if ( !$(this).val() ) {
            $(this).parent().removeClass('focus');
        }
    });


    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('.placeholder');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    if ( filename == '' ) {
                        filename = placeholder.attr('data-label');
                    }
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text( placeholder.attr('data-label') );
            }
            
        });
    });


    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.mainNav a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    $('.js-scroll-down').on('click', function(event) {
        event.preventDefault();
        var target = $(this).parents('.section').next();
         $('html, body').animate({
            scrollTop: target.offset().top
        }, 800);
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.menu-button').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $(this).siblings('header').toggleClass('active');
        if ($('header').hasClass('active')) {
                $('body').css('overflow', 'hidden');
            } else {
                $('body').css('overflow', 'visible');
            }
    });


    /*_______ sliders __________*/
    $('.offer--slider').slick({
        autoplay: true,
        fade: true,
        speed: 900,
        autoplaySpeed: 7000,
        dots: false,
        arrows: false
    });

    $('.car-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.car-slider-nav',
      speed: 900
    });

    $('.car-slider-nav').slick({
      slidesToShow: 8,
      slidesToScroll: 1,
      asNavFor: '.car-slider',
      dots: false,
      centerMode: false,
      focusOnSelect: true
    });


    /*_______ change from/to values __________*/
    $('#exchange').click(function(){
        $(this).toggleClass('return');
        var el1 = $('#val-1');
        var val1 = el1.val();

        var el2 = $('#val-2');
        var val2 = el2.val();

        el1.val(val2);
        el2.val(val1);
    });

    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });



    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }

    $('.form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*Google map init*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 15,
            //draggable: false,
            disableDefaultUI: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var markerImage = new google.maps.MarkerImage('images/location.svg');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"GetTransfer"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }


    /* Clock */
    var $dOut = $('#date'),
        $hOut = $('#hours'),
        $mOut = $('#minutes'),
        $sOut = $('#seconds');

    function update(){
      var date = new Date();
      
      var ampm = date.getHours() < 12
                 ? 'AM'
                 : 'PM';
      
      var hours = date.getHours() == 0
                  ? 12
                  : date.getHours() > 12
                    ? date.getHours() - 12
                    : date.getHours();
      
      var minutes = date.getMinutes() < 10 
                    ? '0' + date.getMinutes() 
                    : date.getMinutes();
      
      var seconds = date.getSeconds() < 10 
                    ? '0' + date.getSeconds() 
                    : date.getSeconds();
      

      $hOut.text(hours);
      $mOut.text(minutes);
      $sOut.text(seconds).css('animation-name', 'pulse');
    } 

    update();
    window.setInterval(update, 1000);

}); // end file