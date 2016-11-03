//SIGNAL CHAIN: 12 OSC -> 12 GAIN NODES -> FILTER -> ANALYSER -> DESTINATION
// creates audio context, within which all audio is defined and configured
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// helper functions that create arrays of oscillators and gain nodes, one for each piano key
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

var analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0.8
var waveAnalyser = audioCtx.createAnalyser();

// Low pass filter
var biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = "lowpass";
biquadFilter.frequency.value = 1500;
biquadFilter.Q.value = 1;

oscillators.forEach(function (oscillator, index){
  oscillator.type = 'triangle';
  oscillator.frequency.value = noteSetter(index)
  oscillator.connect(gainNodes[index]);
})

biquadFilter.connect(analyser);
biquadFilter.connect(waveAnalyser);

// changes waveshape of all oscillators
function changeWaveform(waveShape){
  oscillators.forEach(osc =>
    osc.type = waveShape)
}

// shifts pitch up or down 100 cents; fired variable is to make sure pitch can only be bent up once
var fired;
function pitchBend(direction){
  if (!fired){
    oscillators.forEach(osc => {
      if (direction === 'up') osc.frequency.value += 100;
      else if (direction === 'down') osc.frequency.value -= 100;
    })
  }
}

function pitchReset(direction){
  oscillators.forEach(osc => {
    if (direction === 'up') osc.frequency.value += 100;
    else if (direction === 'down') osc.frequency.value -= 100;
  }
  )}

// helper function for defining note frequency values
// defines frequency values for each of the keys; starts from F4 and multiplies by 2^(1/12) as many times as the distance in semitones between that note and F
function noteSetter(distanceFromF){
  const semiToneRatio = Math.pow(2,1/12);
  var fourthF = 349.23;
  while (distanceFromF > 0){
    fourthF *= semiToneRatio
    distanceFromF--;
  }
  return fourthF;
}

// gain nodes are not connected to filter by default; pressing filter button will connect source to both filter and analyser
gainNodes.forEach(function (gainNode){
  gainNode.connect(audioCtx.destination);
})
biquadFilter.connect(audioCtx.destination);

// event handler for buttons; could perhaps abstract this away by selecting a wave button class
var sineButton = document.getElementById('sine')
var squareButton = document.getElementById('square')
var triangleButton = document.getElementById('triangle')
var sawtoothButton = document.getElementById('sawtooth')

sineButton.onclick = function () {changeWaveform('sine')}
squareButton.onclick = function () {changeWaveform('square')}
triangleButton.onclick = function () {
  changeWaveform('triangle')}
sawtoothButton.onclick = function () {
  changeWaveform('sawtooth')}

const filterEffect = document.getElementById('filter');
const filterSlider = document.getElementById('frequency');
const qSlider = document.getElementById('q');

// button that turns on filter
var filtered = false;
filterEffect.addEventListener('click', function(){
  draw()
  if (!filtered){
    gainNodes.forEach(function (gainNode){
      gainNode.disconnect(audioCtx.destination)
      gainNode.connect(biquadFilter);
    })
    filtered = true;
  } else {
    gainNodes.forEach(function (gainNode){
      gainNode.disconnect(biquadFilter)
      gainNode.connect(audioCtx.destination);
    })
    filtered = false;
  }
})

//sets biquadFilter parameters to value of html range sliders
filterSlider.onchange = function () {
  biquadFilter.frequency.value = this.value;
}

qSlider.onchange = function () {
  biquadFilter.Q.value = this.value
}

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

var whiteKeys = naturalNotes();
var blackKeys = accidentalNotes();

//event listeners for key up and keydown
document.addEventListener('keydown', (event) => {
  keySelector(event.key);
})

document.addEventListener('keyup', (event) => {
  keyReleaser(event.key);
})

// when a key is pressed, animates keyboard and turns up its gain node
function keyPressDefiner(color, keyIndex, gainIndex){
  if (color === 'white') {
    whiteKeys[keyIndex].style.backgroundColor = 'blue';
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
    case '[': pitchBend('up');
              fired = true;
              break;
    case ']': pitchBend('down');
              fired = true;
              break;
    default: console.log(keyName)
  }
}

function keyUpDefiner(color, keyIndex, gainIndex){
  if (color === 'white') {
    whiteKeys[keyIndex].style.backgroundColor = '';
  } else {
    blackKeys[keyIndex].style.border = '1px solid #000';
  }
  gainNodes[gainIndex].gain.value = 0;
}

function keyReleaser(keyName){
  switch (keyName){
    case 'a': keyUpDefiner('white', 0, 0);
              break;
    case 'w': keyUpDefiner('black', 0, 1);
              break;
    case 's': keyUpDefiner('white', 1, 2);
              break;
    case 'e': keyUpDefiner('black', 1, 3);
              break;
    case 'd': keyUpDefiner('white', 2, 4);
              break;
    case 'r': keyUpDefiner('black', 2, 5);
              break;
    case 'f': keyUpDefiner('white', 3, 6);
              break;
    case 'g': keyUpDefiner('white', 4, 7);
              break;
    case 'y': keyUpDefiner('black', 3, 8);
              break;
    case 'h': keyUpDefiner('white', 5, 9);
              break;
    case 'u': keyUpDefiner('black', 4, 10);
              break;
    case 'j': keyUpDefiner('white', 6, 11);
              break;
    case '[': pitchReset('down');
              fired = false;
              break;
    case ']': pitchReset('up');
              fired = false;
              break;
    default: console.log(keyName)
  }
}

// AUDIO ANALYSER
var canvas = document.getElementById('myCanvas');
var canvasCtx = canvas.getContext("2d")
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// red bar frequency visualizer; x-axis is frequency, y-axis is amplitude(intensity)

analyser.fftSize = 256;

function draw() {
  var bufferLength = analyser.frequencyBinCount; // equal to half of fftSize
  var dataArray = new Uint8Array(bufferLength); // creates an array of unsigned 8 bit integers, with a length of 1024
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  drawVisual = window.requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
    x += barWidth + 1;
  }
};

// waveform visualizer; x-axis is time, y-axis is amplitude
waveAnalyser.fftSize = 2048;

var canvas2 = document.getElementById('myCanvas2');
var canvasCtx2 = canvas2.getContext("2d")
var WIDTH2 = canvas2.width;
var HEIGHT2 = canvas2.height;

function draw2() {
  drawVisual = requestAnimationFrame(draw2);
  var bufferLength2 = waveAnalyser.frequencyBinCount;
  var dataArray2 = new Uint8Array(bufferLength2);
  waveAnalyser.getByteTimeDomainData(dataArray2);
  canvasCtx2.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx2.fillRect(0, 0, WIDTH2, HEIGHT2);
  canvasCtx2.lineWidth = 2;
  canvasCtx2.strokeStyle = 'rgb(0, 0, 0)';
  canvasCtx2.beginPath();
  var sliceWidth = WIDTH2 * 1.0 / bufferLength2;
  var x = 0;
  for(var i = 0; i < bufferLength2; i++) {
    var v = dataArray2[i] / 128.0;
    var y = v * HEIGHT2/2;
    if(i === 0) {
      canvasCtx2.moveTo(x, y);
    } else {
      canvasCtx2.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx2.lineTo(canvas2.width, canvas2.height/2);
  canvasCtx2.stroke();
};
draw2();

// DRUM SAMPLE LOADER
// get data retrieves an audio file from the samples folder and decodes it, saving that audio file to a new buffer source. Think of it as making a sample ready to play.
var source;
var drumGain = audioCtx.createGain();
drumGain.gain.value = 3;

function getData(sound) {
  source = audioCtx.createBufferSource();

  var request = new XMLHttpRequest();
  request.open('GET', `./samples/${sound}.wav`, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
      source.buffer = buffer;
      source.connect(drumGain)
      drumGain.connect(audioCtx.destination);
      source.loop = true;
      },
      function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}

var play = document.getElementById('play')
  play.onclick = function() {
  getData('drumloop');
  source.start(0);
  play.setAttribute('disabled', 'disabled');
}

var stop = document.getElementById('stop')
  stop.onclick = function(){
    source.stop(0);
  }
