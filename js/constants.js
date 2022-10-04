const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioInput = document.getElementById("audio");
const userAudioInput = document.getElementById("userAudio");
const audioSelector = document.getElementById("audioSelector");
const playbackRateInput = document.getElementById("playbackRate");
const barSpacingInput = document.getElementById("barSpacing");
const fftSelector = document.getElementById("fftSelector");
const typeSelector = document.getElementById("typeSelector");

const analyser = audioContext.createAnalyser();
analyser.connect(audioContext.destination);
/**
 * Must be a power of 2 between 2^5 and 2^15, so one of:
 * 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
 * and 32768. Defaults to 2048.
 */
analyser.fftSize = 4096;

const mediaSource = audioContext.createMediaElementSource(audioInput);
mediaSource.connect(analyser);

const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");

export {
	audioContext,
	audioInput,
	barSpacingInput,
	playbackRateInput,
	audioSelector,
	fftSelector,
	typeSelector,
	analyser,
	canvas,
	canvasCtx,
	userAudioInput,
};
