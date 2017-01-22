navigator.getUserMedia({ audio: true}, function(stream1) {
var Peer = require('simple-peer')

var peer = new Peer({
  initiator: true,
  trickle: false,
  stream: stream1
})

peer.on('signal', function(data) {
  console.log(data)
  /*fetch('http://localhost:3000/usr', {
    method: 'POST',
    body: JSON.stringify({usr: data})
  })*/
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      //console.log(JSON.parse(this.responseText));
      setTimeout( () => {
      var xhr1 = new XMLHttpRequest();
      xhr1.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          console.log(this.responseText)
          var otherId = this.responseText;//JSON.parse(this.responseText)
          peer.signal(otherId)
        }
      })
      xhr1.open("POST", "http://kerlin.tech:3000/getAid");
      xhr1.setRequestHeader("Content-Type", "application/json")
      xhr1.send();
      }, 3000)
    }
  });
  xhr.open("POST", "http://kerlin.tech:3000/usr");
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.send(JSON.stringify({usr: data}));
})

/*peer.on('data', function(data) {
  console.log(data);
  console.log('????????')
})*/

peer.on('stream', function(stream) {
  var audio = document.createElement('video')
  document.body.appendChild(audio)

  audio.src = window.URL.createObjectURL(stream)
  audio.play()
})

}, function(err) {
  console.log(err)
})

