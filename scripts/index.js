
// creates audio context, within which all audio is defined and configured
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// creates a sound source and gain to node to control volume
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();

oscillator.type = 'square'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 130.81; // C3
// oscillator.start();

// connects signal chain to default output of audio context
oscillator.connect(biquadFilter);
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

biquadFilter.type = "lowshelf";
biquadFilter.frequency.value = 1000;
biquadFilter.gain.value = 25;

// event handler for button
var button = document.getElementById('alpha')
button.addEventListener('click', function (){
  oscillator.frequency.value += 100
})

var button2 = document.getElementById('beta')
button2.addEventListener('click', function (){
  if (oscillator.frequency.value > 0) oscillator.frequency.value -= 100
})

const filterEffect = document.getElementById('filter')
filterEffect.addEventListener('click', function(){
  // oscillator.connect(biquadFilter);
  biquadFilter.frequency.value -= 100
})

// could make a helper function that just switches cases based on which key was pressed

document.addEventListener('keydown', (event) => {
  const keyName = event.key
  // console.log(keyName)
  // oscillator.start();
  // if (keyName === 'a' ){
  //     alert(`${keyName}`)
  // }
  gainNode.gain.value = 1;
  keySelector(keyName);
})

document.addEventListener('keyup', (event) => {
  gainNode.gain.value = 0;
})

// key helper functions
function keySelector(keyName){
  switch (keyName){
    case 'a': oscillator.frequency.value = 440;
              break;
    case 's': oscillator.start();
              break;
    case 'd': oscillator.frequency.value = 320;
              break;
    // case 'd': oscillator.stop();
    //           break;
    default: console.log(keyName)
  }
}

function keyReleaser(keyName){

}

var source;

function getData() {
  source = audioCtx.createBufferSource();
  var request = new XMLHttpRequest();

  request.open('GET', './samples/kick.wav', true);

  request.responseType = 'arraybuffer';


  request.onload = function() {
    var audioData = request.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;

        source.connect(audioCtx.destination);
        source.loop = true;
      },

      function(e){"Error with decoding audio data" + e.err});

  }

  request.send();
}

var play = document.getElementById('play')
  play.onclick = function() {
  getData();
  source.start(0);
  play.setAttribute('disabled', 'disabled');
}
// var bufferLoader = new BufferLoader(
//         audioCtx,
//         [
//         "samples/kick.wav",
//         "samples/snare.wav",
//         "samples/hihat.wav",
//         ],
//         finishedLoading
//     );
//
// function finishedLoading(bufferList) {
//     // Create three sources and buffers
//     var kick = context.createBufferSource();
//     var snare = context.createBufferSource();
//     var hihat = context.createBufferSource();
//     kick.buffer = bufferList[0];
//     snare.buffer = bufferList[1];
//     hihat.buffer = bufferList[2];
//
//     kick.connect(context.destination);
//     snare.connect(context.destination);
//     hihat.connect(context.destination);
// 	// Play them together
//     kick.start(0);
//     snare.start(0);
//     hihat.start(0);
// }
//
// bufferLoader.load()
