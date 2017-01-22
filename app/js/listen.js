const {desktopCapturer} = require('electron')
const $ = require('jquery');

//var fetch = require('node-fetch')
var listener = function () {
  var recording = false;
  var finishRec = false;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: true, /*video: { width: 1280, height: 720 }*/ },
      function (stream) {

        // creates the audio context
        var audioContext = window.AudioContext || window.webkitAudioContext;
        var context = new audioContext();

        // retrieve the current sample rate to be used for WAV packaging
        var sampleRate = context.sampleRate;

        // creates a gain node
        var volume = context.createGain();

        // creates an audio node from the microphone incoming stream
        var audioInput = context.createMediaStreamSource(stream);

        // connect the stream to the gain node
        audioInput.connect(volume);

        /* From the spec: This value controls how frequently the audioprocess event is
        dispatched and how many sample-frames need to be processed each call.
        Lower values for buffer size will result in a lower (better) latency.
        Higher values will be necessary to avoid audio breakup and glitches */
        var bufferSize = 2048;
        var recorder = context.createScriptProcessor(bufferSize, 2, 2);
        var leftchannel = [];
        var rightchannel = [];
        var recordingLength = 0;

        recorder.onaudioprocess = function (e) {
          if (!recording && !finishRec) return;
          console.log('rec');
          var left = e.inputBuffer.getChannelData(0);
          var right = e.inputBuffer.getChannelData(1);
          // we clone the samples
          leftchannel.push(new Float32Array(left));
          rightchannel.push(new Float32Array(right));
          recordingLength += bufferSize;
          if (finishRec) {
            var blob = file(leftchannel, rightchannel, recordingLength, sampleRate)
            finishRec = false;
            leftchannel = [];
            rightchannel = [];
            var form = new FormData();
            let token =  window.localStorage.getItem("token");
            form.append('command', blob)
            form.append('token', token)
            console.log(token)
            // var xhr = new XMLHttpRequest();
            // xhr.addEventListener("readystatechange", function () {
            //   if (this.readyState === 4) {
            //     console.log(JSON.parse(this.responseText));
            //   }
            // });
            var settings = {
              async: true,
              crossDomain: true,
              url: 'https://4ca55f42.ngrok.io/command_audio',
              method: 'POST',
              processData: false,
              contentType: false,
              mimeType: 'multipart/form-data',
              data: form
            }
            $.ajax(settings).done(function(resp){
              console.log(resp)
            })



            // xhr.open("POST", "https://4ca55f42.ngrok.io/command_audio");
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            // xhr.send(form);
          }
        }

        // we connect the recorder
        volume.connect(recorder);
        recorder.connect(context.destination);
      },
      function (err) {
        console.log("The following error occurred: " + err.name);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
  window.addEventListener('keydown', function (e) { $("#recordingContainer").slideDown() ;recording = true }, true)
              
  window.addEventListener('keyup', function (e) { $("#recordingContainer").slideUp(); recording = false; finishRec = true }, true)

  function file(leftchannel, rightchannel, recordingLength, sampleRate) {
    // we flat the left and right channels down
    var leftBuffer = mergeBuffers(leftchannel, recordingLength);
    var rightBuffer = mergeBuffers(rightchannel, recordingLength);
    // we interleave both channels together
    var interleaved = interleave(leftBuffer, rightBuffer);

    // create the buffer and view to create the .WAV file
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

    // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++) {
      view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
      index += 2;
    }

    // our final binary blob that we can hand off
    var blob = new Blob([view], { type: 'audio/wav' });
    console.log(blob)
    return blob;
  }

  function mergeBuffers(channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++) {
      var buffer = channelBuffer[i];
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  function interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length;) {
      result[index++] = leftChannel[inputIndex];
      result[index++] = rightChannel[inputIndex];
      inputIndex++;
    }
    return result;
  }

  function writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}


module.exports = exports = listener