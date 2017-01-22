(function (window) {
    var $ = require('jquery');
    var listener = require('../js/listen');
    var mock = require('../js/mock');
    var visible = false;
    var peer = require('../js/peer.js')
    

    var toggleMenu = function () {
        var width = document.getElementById('sideMenu').offsetWidth;
        var sign = '-';
        var contentWidth = '0%';
        if (!visible) {
            sign = '+';
            width = 0;
            contentWidth = '18%';
        }

        $('#sideMenu').animate({ marginLeft: sign + width + 'px' });
        $('#contentHolder').animate({ marginLeft: sign + contentWidth });


        visible = !visible;
    }
    
    window.toggleMenu = toggleMenu;

    $(document).ready(function () {
        // document.getElementById('main').setAttribute('style', 'display: none');
        document.getElementById('splash').setAttribute('style', 'display: none');

        // listener();
        document.getElementsByTagName("body")[0].setAttribute("style", "height: " + window.screen.availHeight + "px");
        //document.getElementById("splash").setAttribute("style", "height: " + window.screen.availHeight + "px");

        window.setTimeout(function () {
            $('#splash').fadeOut();
            $('#main').fadeIn()
            $("#recordingContainer").slideUp(0);
            var sideMenu = document.getElementById('sideMenu');
            document.getElementById("main").setAttribute("style", "height: " + window.screen.availHeight + "px");

            if (sideMenu) {
                sideMenu.setAttribute('style', 'margin-left: -' + sideMenu.offsetWidth + 'px');
                //document.getElementById('micro').setAttribute('style', 'top: ' + (window.screen.availHeight - 400) + 'px')

            }
        }, 30);


        window.setTimeout(function () {
            var contentHolder = document.getElementById('contentHolder');
            $('#contentHolder').fadeOut(0);
            function el(tag) {
                return $(document.createElement(tag));
            }

            mock.result.forEach(function (data) {
                console.log(data);
                var title = data.text.split(' ')[0];
                var elem = el('div').addClass('contentContainer panel col-xs-12')
                    .append(el('div').addClass('text-container')
                        .append(el('h1').text(title))
                        .append(el('hr'))
                        .append(el('h2').text(data.entity))
                        .append(el('p').text(data.text)))

                $("#contentHolder").append(elem);
            })

            $('#contentHolder').fadeIn();
            
        }, 2000)




    })
})(window);
