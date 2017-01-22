var $ = require('jquery');

var communication = {
    init: function () {
        $.ajax({
            url: 'https://4ca55f42.ngrok.io/init',
            type: 'POST',
            data: JSON.stringify({ devid: { os: 'mac', cpu_count: '14', release: '14', hostname: 'jony' } }),
            contentType: 'application/json',
            success: function (data) {
                console.log(window.localStorage);
                console.log(status, data);
                window.localStorage.setItem('token', data.token);
                $('#splash').fadeOut();
                $('#main').fadeIn()
                $("#recordingContainer").slideUp(0);
                var sideMenu = document.getElementById('sideMenu');
                document.getElementById("main").setAttribute("style", "height: " + window.screen.availHeight + "px");

                if (sideMenu) {
                    sideMenu.setAttribute('style', 'margin-left: -' + sideMenu.offsetWidth + 'px');
                    //document.getElementById('micro').setAttribute('style', 'top: ' + (window.screen.availHeight - 400) + 'px')

                }
            }
        })
    },
    commandAudio: function () {
        $.ajax({
            url: 'https://4ca55f42.ngrok.io/command_audio',
            type: 'POST',
            data: JSON.stringify({ token: window.localStorage.getItem('token') }),
            contentType: 'application/x-www-form-urlencoded',
            success: function (data, status) {
                console.log(status);
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
            }
        })
    }
}

module.exports = communication