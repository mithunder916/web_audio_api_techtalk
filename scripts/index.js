
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
  oscillator.frequency.value = noteSetter(index)
  oscillator.connect(gainNodes[index]);
})

//defines frequency values for each of the keys; starts from F4 and multiplies by 2^(1/12) as many times as the distance in semitones between that note and F
function noteSetter(distanceFromF){
  var semiToneRatio = Math.pow(2,1/12);
  var fourthF = 349.23;
  while (distanceFromF > 0){
    fourthF *= semiToneRatio
    distanceFromF--;
  }
  return fourthF;
}

gainNodes.forEach(function (gainNode){
  gainNode.connect(audioCtx.destination);
})

// oscillator.type = 'square'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'

// connects signal chain to default output of audio context
// oscillator.connect(biquadFilter);
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

function naturalNotes(){
  var whiteNoteArray = ['F','G','A','B','C','D','E'];
  return whiteNoteArray.map((note) =>
    document.getElementById(note))
}

function accidentalNotes(){
  var blackNoteArray = ['F#','G#','A#','C#','D#'];
  return blackNoteArray.map((note) =>
    document.getElementById(note))
}

var theWhites = naturalNotes();
var blackKeys = accidentalNotes();

//event listeners
document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  // gainNode.gain.value = 0.7;
  keySelector(keyName);
})

document.addEventListener('keyup', (event) => {
  gainNode.gain.value = 0;
  keyReleaser(event.key);
})

function keyPressDefiner(color, keyIndex, gainIndex){
  if (color === 'white') {
    theWhites[keyIndex].style.backgroundColor = 'blue';
  } else {
    blackKeys[keyIndex].style.border = '4px solid #000';
  }
  gainNodes[gainIndex].gain.value = 0.7;
}

// key helper functions
function keySelector(keyName){
  switch (keyName){
    case 'n': oscillators.forEach((osc) => osc.start())
              gainNodes.forEach((node) => node.gain.value = 0)
              break;
    case 'a': keyPressDefiner('white', 0, 0)
              break;
    case 'w': keyPressDefiner('black', 0, 1)
              break;
    case 's': keyPressDefiner('white', 1, 2)
              break;
    case 'e': keyPressDefiner('black', 1, 3)
              break;
    case 'd': keyPressDefiner('white', 2, 4);
              break;
    case 'r': keyPressDefiner('black', 2, 5)
              break;
    case 'f': keyPressDefiner('white', 3, 6);
              break;
    case 'g': keyPressDefiner('white', 4, 7);
              break;
    case 'y': keyPressDefiner('black', 3, 8)
              break;
    case 'h': keyPressDefiner('white', 5, 9);
              break;
    case 'u': keyPressDefiner('black', 4, 10)
              break;
    case 'j': keyPressDefiner('white', 6, 11);
              break;
    default: console.log(keyName)
  }
}

function keyUpDefiner(color, keyIndex, gainIndex){
  if (color === 'white') {
    theWhites[keyIndex].style.backgroundColor = '';
  } else {
    blackKeys[keyIndex].style.border = '1px solid #000';
  }
  gainNodes[gainIndex].gain.value = 0;
}

function keyReleaser(keyName){
  switch (keyName){
    case 'a': keyUpDefiner('white', 0, 0);
    case 'w': keyUpDefiner('black', 0, 1);
    case 's': keyUpDefiner('white', 1, 2);
    case 'e': keyUpDefiner('black', 1, 3);
    case 'd': keyUpDefiner('white', 2, 4);
    case 'r': keyUpDefiner('black', 2, 5);
    case 'f': keyUpDefiner('white', 3, 6);
    case 'g': keyUpDefiner('white', 4, 7);
    case 'y': keyUpDefiner('black', 3, 8);
    case 'h': keyUpDefiner('white', 5, 9);
    case 'u': keyUpDefiner('black', 4, 10)
    case 'j': keyUpDefiner('white', 6, 11);
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
