import {
	audioInput,
	analyser,
	canvas,
	audioSelector,
	canvasCtx,
	fftSelector,
	barSpacingInput,
	playbackRateInput,
	userAudioInput,
} from "./constants.js";
import { observer } from "./utils.js";

let animationFrame;
let animationType = "bars";
let barSpacing = 1;
let lineWidth = 1;

function loadAudio(source = null) {
	audioInput.src = source ? source : audioSelector.value;
}

function bars() {
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	const WIDTH = canvas.width;
	const HEIGHT = canvas.height;

	const barWidth = (WIDTH / bufferLength) * 1.5;

	var barHeight;
	var x = 0;
	var y = 0;

	//const totalLength = bufferLength *;

	function draw() {
		animationFrame = requestAnimationFrame(draw);

		x = 0;

		analyser.getByteFrequencyData(dataArray);

		canvasCtx.fillStyle = "#fff";
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i];

			// bars
			canvasCtx.fillStyle = "#000000";
			y = HEIGHT / 2 - barHeight;
			canvasCtx.fillRect(x, y, barWidth, barHeight);

			// shadow
			canvasCtx.fillStyle = "#00000025";
			canvasCtx.fillRect(x, HEIGHT / 2, barWidth, barHeight * 0.9);

			x += barWidth + barSpacing;
		}
	}
	draw();
}

function sine() {
	const bufferLength = analyser.fftSize;
	const dataArray = new Uint8Array(bufferLength);

	const WIDTH = canvas.width;
	const HEIGHT = canvas.height;

	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

	const draw = function () {
		animationFrame = requestAnimationFrame(draw);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = "#fff";
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		canvasCtx.lineWidth = lineWidth;
		canvasCtx.strokeStyle = "#000";

		canvasCtx.beginPath();

		const sliceWidth = (WIDTH * 2) / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			let v = dataArray[i] / 128.0;
			let y = (v * HEIGHT) / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	};

	draw();
}

function drawCanvas() {
	window.cancelAnimationFrame(animationFrame);
	eval(animationType)();
}

function init() {
	audioInput.play();
	audioInput.volume = 0.3;
	drawCanvas();
}

// when the audio select options change
audioSelector.addEventListener("change", () => {
	loadAudio();
});

// When the audio input source changes
observer(audioInput, init, ["src"]);

// When the bar spacing input source changes
barSpacingInput.addEventListener("change", (ev) => {
	barSpacing = Number.parseInt(ev.target.value);
	drawCanvas();
});

// When the fft select changes
fftSelector.addEventListener("change", (ev) => {
	analyser.fftSize = ev.target.value;
	drawCanvas();
});

// When the type select changes
typeSelector.addEventListener("change", (ev) => {
	animationType = ev.target.value;
	drawCanvas();
});

// When the playbackRate input changes
playbackRateInput.addEventListener("change", (ev) => {
	audioInput.playbackRate = ev.target.value;
});

var blob = window.URL || window.webkitURL;
userAudioInput.addEventListener("change", (ev) => {
	var fileURL = blob.createObjectURL(ev.target.files[0]);
	loadAudio(fileURL);
});

// when the user resizes the window
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	drawCanvas();
}
window.addEventListener("resize", resize);
window.addEventListener("load", resize);
