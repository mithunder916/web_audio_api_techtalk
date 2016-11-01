
// creates audio context, within which all audio is defined and configured
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// creates a sound source and gain to node to control volume
function oscillatorCreator(num){
  let oscArray = [];
  for (var i = 0; i<num; i++){
    oscArray.push(audioCtx.createOscillator())
  }
  return oscArray
}

function gainNodeCreator(num){
  let gainArray = [];
  for (var i = 0; i<num; i++){
    gainArray.push(audioCtx.createGain())
  }
  return gainArray
}

var oscillators = oscillatorCreator(12);
var gainNodes = gainNodeCreator(12);


var oscillator = audioCtx.createOscillator();
var oscillator2 = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();

oscillators.forEach(function (oscillator, index){
  oscillator.type = 'square';
  oscillator.frequency.value = 130.81;
  oscillator.connect(gainNodes[index]);
})

gainNodes.forEach(function (gainNode){
  gainNode.connect(audioCtx.destination);
})

// oscillator.type = 'square'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
// oscillator2.type = 'sawtooth'
// oscillator.frequency.value = 130.81; // C3
// oscillator2.frequency.value = 196.00 // E3
// oscillator.start(4);
// oscillator2.start(2);

// connects signal chain to default output of audio context
// oscillator.connect(biquadFilter);
// oscillator.connect(gainNode);
// oscillator2.connect(gainNode);
// gainNode.connect(audioCtx.destination);

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

function whiteNotes(){
  var whiteNoteArray = ['F','G','A','B','C','D','E'];
  return whiteNoteArray.map((note) =>
    document.getElementById(note))
}

var theWhites = whiteNotes();
console.log(theWhites)

var fKey = document.getElementById('F')
var gKey = document.getElementById('G')
var aKey = document.getElementById('A')

document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  // gainNode.gain.value = 0.7;
  keySelector(keyName);
})

document.addEventListener('keyup', (event) => {
  gainNode.gain.value = 0;
  keyReleaser(event.key);
})

// key helper functions
function keySelector(keyName){
  switch (keyName){
    case 'n': oscillators[0].start();
              oscillators[1].start();
              gainNodes.forEach((node) => node.gain.value = 0)
              whiteNotes()
              break;
    case 'k': button.click()
    case 'a': theWhites[0].style.backgroundColor = 'blue'
              gainNodes[0].gain.value = 0.7;
              oscillators[0].frequency.value = 349.23;
              break;
    case 's': theWhites[1].style.backgroundColor = 'blue'
              oscillators[0].frequency.value = 392;
              break;
    case 'd': theWhites[2].style.backgroundColor = 'blue'
              gainNodes[1].gain.value = 0.7;
              oscillators[1].frequency.value = 440;
              break;
    case 'f':
    case 'g':
    default: console.log(keyName)
  }
}

function keyReleaser(keyName){
  switch (keyName){
    case 'a': theWhites[0].style.backgroundColor = '';
    case 's': theWhites[1].style.backgroundColor = '';
    case 'd': theWhites[2].style.backgroundColor = '';
    default: console.log(keyName)
  }
}


// get data retrieves an audio file from the samples folder and decodes it, saving that audio file to a new buffer source. Think of it as making a sample ready to play.
var source;

function getData() {
  source = audioCtx.createBufferSource();
  var request = new XMLHttpRequest();

  request.open('GET', './samples/snare.wav', true);

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
