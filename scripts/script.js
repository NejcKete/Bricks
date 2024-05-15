function start() {
	document.getElementById("button").disabled = true;
	drawIt();
}

function drawIt() {
	var x;
	var y;
	var dx = 1;
	var dy = 4;
	var WIDTH;
	var HEIGHT;
	var r = 10;
	var ctx;
	var paddlex;
	var paddley;
	var paddleh;
	var paddlew;
	var canvasMinX;
	var canvasMaxX;
	var bricks;
	var NROWS;
	var NCOLS;
	var BRICKWIDTH;
	var BRICKHEIGHT;
	var PADDING;
	var tocke = 0;
	$("#tocke").html(tocke);
	var sekunde = 0;
	var sekundeI;
	var minuteI;
	var intTimer;
	var izpisTimer;
	var playing = true;
	var hit = 0;
	var rightDown;
	var leftDown;

	const brickImage = document.getElementById("image");
	const brickImage2 = document.getElementById("image2");
	
	function timer(){
		sekunde = sekunde + 0.01;

		sekundeI = ((sekundeI = Math.floor((sekunde % 60))) > 9) ? sekundeI : "0"+sekundeI;
		minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0"+minuteI;
		izpisTimer = minuteI + ":" + sekundeI;

		$("#cas").html(izpisTimer);
	}

	function init() {
		ctx = $('#canvas')[0].getContext("2d");
		WIDTH = $("#canvas").width();
		HEIGHT = $("#canvas").height();
		x = parseInt(Math.random() * WIDTH-32 + 32);
		y = HEIGHT/2;
		init_paddle();
		init_mouse();
		init_bricks();
		clear();
		const drawInterval = setInterval(draw, 10);
		return drawInterval;
	}
	
	function init_paddle() {
		paddleh = 10;
		paddlew = 75;
		paddlex = WIDTH/2-paddlew/2;
		paddley = HEIGHT-paddleh;
	}
	
	function init_mouse() {
		canvasMinX = $("canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;
	}
	
	function init_bricks() {
		NROWS = document.getElementById("rows").value;
		NCOLS = document.getElementById("cols").value;
		BRICKWIDTH = (WIDTH/NCOLS) - 1;
		BRICKHEIGHT = 40;
		PADDING = 1;
		bricks = new Array(NROWS);
		for (i=0; i < NROWS; i++) {
			bricks[i] = new Array(NCOLS);
			for (j=0; j < NCOLS; j++) {
				if (Math.floor(Math.random()*4+1) > 1) {
					bricks[i][j] = 1;
				}
				else {
					bricks[i][j] = 2;
				}
			}
		}
	}

	function circle() {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}

	function rect(x,y,w,h) {
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		ctx.fill();
	}

	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}
	
	function draw() {
		if (playing) {
			timer();
			clear();
			circle();
			if (rightDown) paddlex += 5;
			else if (leftDown) paddlex -= 5;
			rect(paddlex, paddley, paddlew, paddleh);
			//ctx.drawImage(ball, x - r, y - r, 2 * r, 2 * r)
			
			for (i=0; i < NROWS; i++) {
				for (j=0; j < NCOLS; j++) {
					if (bricks[i][j] == 1) {
						ctx.drawImage(brickImage, (j * (BRICKWIDTH + PADDING)) + PADDING,
							(i * (BRICKHEIGHT + PADDING)) + PADDING,
							BRICKWIDTH, BRICKHEIGHT);
						if (x > (j * ((BRICKWIDTH + PADDING)) + PADDING)
							&& x < ((j * (BRICKWIDTH + PADDING)) + PADDING + BRICKWIDTH)
							&& y > ((i * (BRICKHEIGHT + PADDING)) + PADDING)
							&& y < ((i * (BRICKHEIGHT + PADDING)) + PADDING + BRICKHEIGHT)
							) {
							dy = -dy;
							bricks[i][j] = 0;
							tocke += 1;
							$("#tocke").html(tocke);
							hit += 1;
						}
					}
					else if (bricks[i][j] == 2) {
						ctx.drawImage(brickImage2, (j * (BRICKWIDTH + PADDING)) + PADDING,
							(i * (BRICKHEIGHT + PADDING)) + PADDING,
							BRICKWIDTH, BRICKHEIGHT);
						if (x > (j * ((BRICKWIDTH + PADDING)) + PADDING)
							&& x < ((j * (BRICKWIDTH + PADDING)) + PADDING + BRICKWIDTH)
							&& y > ((i * (BRICKHEIGHT + PADDING)) + PADDING)
							&& y < ((i * (BRICKHEIGHT + PADDING)) + PADDING + BRICKHEIGHT)
							) {
							dy = -dy;
							bricks[i][j] = 0;
							tocke += 2;
							$("#tocke").html(tocke);
							hit += 1;
						}
					}
				}
			}
			
			if (x+dx > WIDTH-r || x+dx < 0+r) {
				dx = -dx;
			}
			if (y+dy < 0+r) {
				dy = -dy;
			}
			else if (y + dy > paddley-r) {
				if (x >= paddlex && x <= paddlex + paddlew) {
					dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
					dy = -dy;
				}
			}
			if (y + dy > HEIGHT || hit == NROWS*NCOLS) {
				playing = false;
				document.getElementById("button").disabled = false;
				if(tocke == NROWS*NCOLS) {
					Swal.fire({
						title: "You Won.",
						text: "!!",
						confirmButtonText: "OK",
						confirmButtonColor: "#949494",
						background: "rgba(255, 255, 255, 0.70)",
						width: '450px',
						customClass: {
							confirmButton: 'confirm',
							title: 'swtitle',
							popup: 'swtext',
						},
						}).then((result) => {
						if (result.isConfirmed) {
							location.reload();
						}
					});
				}
				else {
					Swal.fire({
						title: "You lose.",
						text: "Better luck next time.",
						confirmButtonText: "OK",
						confirmButtonColor: "#949494",
						background: "rgba(255, 255, 255, 0.70)",
						width: '450px',
						customClass: {
							confirmButton: 'confirm',
							title: 'swtitle',
							popup: 'swtext',
						},
						}).then((result) => {
						if (result.isConfirmed) {
							location.reload();
						}
					});
				}
			}
			x += dx;
			y += dy;
		}
	}
	
	function onMouseMove(evt) {
		if(playing) {
			if (evt.pageX > canvasMinX + paddlew/2 && evt.pageX < canvasMaxX - paddlew/2) {
				paddlex = evt.pageX - canvasMinX - paddlew/2;
			}
		}
	}

	function onKeyDown(evt) {
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = true;
        else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39 || evt.keyCode == 68)
            rightDown = false;
        else if (evt.keyCode == 37 || evt.keyCode == 65) leftDown = false;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);
	$(document).mousemove(onMouseMove);
	
	init();
}
