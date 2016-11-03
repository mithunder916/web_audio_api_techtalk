#web_audio_api_techtalk

INSTRUCTIONS:

run npm start from the root directory

1. Press the N button once to turn the synth 'on' (technically starts all 12 oscillators).

2. Keys A, S, D, F, G, H and J play the white keys. W, E, T, Y and U play the black keys.

3. Keys [ and ] activate pitch-bend while a note is being played.

4. Hit the Filter button to hook up the synth to a lowpass filter and the analyser. 

   The first slider modulates the cutoff frequency between 50 and 4000Hz.
   
   The second slider modulates the resonance/Q between 1 and 15.
   
5. To load a different wav. file to loop, add it to the /samples folder and change line 343 of index.js to the stringifed name of that file (excluding .wav).

6. Go HAM.

NOTE: Currently, the drum loop cannot be reactivated once it is paused, so refresh the page if you want to play it again.
