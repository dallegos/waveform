window.onload = function () {
	var audio = document.getElementById("audio");

	audio.load();
	audio.volume = 0.3;
	audio.play();

	var audioContext = new AudioContext();
	var src = audioContext.createMediaElementSource(audio);
	var analyser = audioContext.createAnalyser();

	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");

	src.connect(analyser);
	analyser.connect(audioContext.destination);

	analyser.fftSize = 16384;

	var bufferLength = analyser.frequencyBinCount;

	var dataArray = new Uint8Array(bufferLength);

	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;

	var barWidth = (WIDTH / bufferLength) * 3.5;
	var barHeight;
	var x = 0;

	function renderFrame() {
		requestAnimationFrame(renderFrame);

		x = 0;

		analyser.getByteFrequencyData(dataArray);

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i];

			// bars
			ctx.fillStyle = "#000000FF";
			y = HEIGHT / 2 - barHeight;
			ctx.fillRect(x, y, barWidth, barHeight);

			// shadow
			ctx.fillStyle = "#00000044";
			ctx.fillRect(x, HEIGHT / 2, barWidth, barHeight * 0.6);

			x += barWidth + 4;
		}
	}

	audio.play();
	renderFrame();
};
