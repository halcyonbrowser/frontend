(function (window) {
    var $ = require('jquery');
    var listener = require('../js/listen');
    var config = require('../config/config')
    var mock = require('../js/mock');
    var peer = require('../js/peer');
    var fb = require('../js/scripts')
    var cm = require('../js/communication');
    var say = require('../js/say');

    var visible = false;
    var speaking = false;

    var toggleMenu = function () {
        var width = document.getElementById('sideMenu').offsetWidth;
        var sign = '-';
        var contentWidth = '0%';
        if (!visible) {
            sign = '+';
            width = 0;
            contentWidth = '18%';
            say($('#sideMenu').text().trim());
            //peer();
        }

        $('#sideMenu').animate({ marginLeft: sign + width + 'px' });
        console.log();
        $('#contentHolder').animate({ marginLeft: sign + contentWidth });

        visible = !visible;
    }

    window.toggleMenu = toggleMenu;

    window.addEventListener('click', function () {
        toggleMenu();
    })

    $(document).ready(function () {

        console.log(localStorage.token);
        if (!localStorage.getItem('token')) {
            console.log('no token');
            cm.init()
            document.getElementById('main').setAttribute('style', 'display: none');
            document.getElementById("splash").setAttribute("style", "height: " + window.screen.availHeight + "px");
        } else {
            document.getElementById('splash').setAttribute('style', 'display: none');
            $('#main').fadeIn()
            $("#recordingContainer").slideUp(0);
            var sideMenu = document.getElementById('sideMenu');
            document.getElementById("main").setAttribute("style", "height: " + window.screen.availHeight + "px");

            if (sideMenu) {
                sideMenu.setAttribute('style', 'margin-left: -' + sideMenu.offsetWidth + 'px');
                //document.getElementById('micro').setAttribute('style', 'top: ' + (window.screen.availHeight - 400) + 'px')

            }
        }

        listener();
        // document.getElementById('splash').setAttribute('style', 'display: none');

        document.getElementsByTagName("body")[0].setAttribute("style", "height: " + window.screen.availHeight + "px");


        function el(tag) {
            return $(document.createElement(tag));
        }


        window.setTimeout(function () {
            mock.result.forEach(function (data) {
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
            speak();
        }, 500)


        var speak = function () {
            var content = document.getElementById('contentHolder');
            console.log(content);
            Array.from(content.childNodes).forEach(function (elem, index) {
                var result = mock.result[index];
                console.log(result);
                var entity = result.entity;
                var text = result.text;
                var title = text.split(' ');
                say(title + entity + text);
            })
        }

        var talk = function (text) {
            if (speaking) {
                window.setTimeout(function () {
                    say(text)
                    speaking = true;
                }, 300)
            } else {
                say(text);
                speaking
            }
        }


    })
})(window);
