window.onload = function() {
    let audioCtx;
    let oscillator;
    let gainNode;
    let lfo;
    let lfoGain;

    function initAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Oscillator and Gain for theremin tone
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        // LFO for vibrato
        lfo = audioCtx.createOscillator();
        lfoGain = audioCtx.createGain();

        // Connect the nodes
        oscillator.connect(gainNode).connect(audioCtx.destination);
        lfo.connect(lfoGain).connect(oscillator.frequency);  // LFO modulates oscillator frequency

        // Oscillator and LFO properties
        oscillator.type = 'sine'; // Theremin-like sine wave
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Starting frequency

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5, audioCtx.currentTime);  // Vibrato frequency (5Hz)
        lfoGain.gain.setValueAtTime(5, audioCtx.currentTime);   // Vibrato depth

        // Start oscillators
        oscillator.start();
        lfo.start();
    }

    function setFrequency(x) {
        const minFreq = 65.41;  // Minimum theremin frequency
        const maxFreq = 2093; // Maximum theremin frequency
        const WIDTH = window.innerWidth;
        const freq = minFreq + (x / WIDTH) * (maxFreq - minFreq);

        oscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.01); // Smooth transition
    }

    function setGain(y) {
        const maxVol = 0.02;
        const HEIGHT = window.innerHeight;
        const volume = 1 - (y / HEIGHT) * maxVol;

        gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.01);  // Smooth volume change
    }

    // Wait for user interaction before starting the audio context
    document.body.addEventListener('click', function() {
        if (!audioCtx) {
            initAudio();  // Initialize the audio context and start oscillators
        }
    });

    document.body.addEventListener('keydown', function() {
        if (!audioCtx) {
            initAudio();  // Initialize the audio context and start oscillators
        }
    });

    document.onmousemove = function(event) {
        if (audioCtx) {
            setFrequency(event.pageX);
            setGain(event.pageY);
        }
    };

    document.ontouchmove = function(event) {
        if (audioCtx) {
            const touch = event.touches[0];  // Only considering first touch point
            setFrequency(touch.pageX);
            setGain(touch.pageY);
        }
    };

    const muteButton = document.querySelector('.mute');
    muteButton.addEventListener('click', function() {
        if (!audioCtx) return;

        if (muteButton.getAttribute('data-muted') === 'false') {
            gainNode.disconnect(audioCtx.destination);
            muteButton.setAttribute('data-muted', 'true');
            muteButton.innerHTML = "Unmute";
        } else {
            gainNode.connect(audioCtx.destination);
            muteButton.setAttribute('data-muted', 'false');
            muteButton.innerHTML = "Mute";
        }
    });
};
