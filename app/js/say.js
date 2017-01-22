var exec = require('child_process').exec;
module.exports = (say) => {
  exec(' echo ' +  say +' | festival --tts', function(error, stdout, stderr) {
    // command output is in stdou
    console.log('asdfa')
  });
}
