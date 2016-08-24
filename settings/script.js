(function () {
    
    var onLoaded = function () {
        
        // Navigation Scripts to Show Header on Scroll-Up. This is the only place where jQUery is used.
        window.jQuery(document).ready(function ($) {
            var MQL = 1170;
            
            //primary navigation slide-in effect
            if ($(window).width() > MQL) {
                var headerHeight = $('.navbar-custom').height();
                $(window).on('scroll', {
                    previousTop: 0
                },
            function () {
                    var currentTop = $(window).scrollTop();
                    //check if user is scrolling up
                    if (currentTop < this.previousTop) {
                        // When scrolling up
                        if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                            $('.navbar-custom').addClass('is-visible');
                        } else {
                            $('.navbar-custom').removeClass('is-visible is-fixed');
                        }
                    } else {
                        // When scrolling down
                        $('.navbar-custom').removeClass('is-visible');
                        if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                    }
                    this.previousTop = currentTop;
                });
            }
        });
    }
    
    // Load jQuery if not already loaded
    if (!window.jQuery) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    onLoaded();
                }
            };
        } else { //Others
            script.onload = function () {
                onLoaded();
            };
        }
        
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        onLoaded();
    }

})();