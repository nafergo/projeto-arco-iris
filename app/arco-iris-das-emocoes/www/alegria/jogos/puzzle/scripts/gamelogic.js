var canvas;
var context;
var sectionWidth;
var sectionHeight;
var mouseX = 0;
var mouseY = 0;
var movingPiece = false;
var currentMovingFromPiece = -1;
var currentMovingToPiece = 0;
var offsetX = 0;
var offsetY = 0;
var imageObj;
var solved = false;
var currentImageNumber = 0;
var imageObj = new Image();
var PIECES = 16;
var SIDES = 4;
var isAnimating = false;

var IMAGECOUNT = 4;

var artTitle = new Array();
artTitle[0] = '1.jpg';
artTitle[1] = '2.jpg';
artTitle[2] = '3.jpg';
artTitle[3] = '4.jpg';
artTitle[4] = '5.jpg';


function Piece() {
	var pieceNumber;
	var x;
	var y;
}

var pieceArray = new Array();

function Slot() {
	var slotNumber;
	var x;
	var y;
	var Piece;
}

var slotArray = new Array();

// 720 x 450 image for canvas

function init(document) {
	canvas = document.getElementById('puzzleCanvas');
	currentImageNumber = Math.floor(Math.random() * IMAGECOUNT);
	var canvasOffset = $("#puzzleCanvas").offset();
	offsetX = Math.round(canvasOffset.left);
	offsetY = Math.round(canvasOffset.top);
	sectionWidth = canvas.width / SIDES;
	sectionHeight = canvas.height / SIDES;
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mouseout", doMouseOut, false);
	context = canvas.getContext('2d');

	document.getElementById("savePuzzleButton").addEventListener("click",
			function() {
				// creating a literal object "progress" filled with values from
				// inputs
				var progress = {
					currentImageNumber : currentImageNumber,
					pieces : PIECES,
					sides : SIDES,
					slotArray : slotArray,
					pieceArray : pieceArray
				};

				localStorage["progress"] = JSON.stringify(progress);

			});

	document.getElementById("loadPuzzleButton").addEventListener("click",
			function() {
				// decoding "progress" from local storage
				$('#buttonDiv').finish();
				var progress = JSON.parse(localStorage.getItem("progress"));
				currentImageNumber = progress.currentImageNumber;
				slotArray = progress.slotArray;
				pieceArray = progress.pieceArray;
				PIECES = progress.pieces;
				SIDES = progress.sides;
				sectionWidth = canvas.width / SIDES;
				sectionHeight = canvas.height / SIDES;
				solved = false;
				loadPreviousImage();
			});

	document.getElementById("nextImageButton").addEventListener("click",
			function() {
				$('#buttonDiv').finish();
				currentImageNumber++;
				if (currentImageNumber > IMAGECOUNT) {
					currentImageNumber = 0;
				}
				initArrays();
				loadImage();
			});

	document.getElementById("changeDifficultyButton").addEventListener("click",
			function() {
				$('#buttonDiv').finish();
				if (SIDES > 5) {
					SIDES = 2;
					PIECES = SIDES * SIDES;
				} else {
					SIDES++;
					PIECES = SIDES * SIDES;
				}

				sectionWidth = canvas.width / SIDES;
				sectionHeight = canvas.height / SIDES;
				initArrays();
				loadImage();
			});
	initArrays();
	loadImage();
}

function clearCanvas() {
	context.save();

	// Use the identity matrix while clearing the canvas
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	context.restore();
	context.fillStyle = "#A1D0C7";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function initArrays() {
	pieceArray = new Array();
	slotArray = new Array();
	for (i = 0; i < PIECES; i++) {
		pieceArray[i] = new Piece();
		pieceArray[i].pieceNumber = i;
		slotArray[i] = new Slot();
		slotArray[i].slotNumber = i;
		slotArray[i].piece = pieceArray[i];
	}

	for (y = 0; y < SIDES; y++) {
		for (x = 0; x < SIDES; x++) {
			var index = x + (y * SIDES);
			var w = x * sectionWidth;
			var h = y * sectionHeight;
			slotArray[index].x = w;
			slotArray[index].y = h;
			pieceArray[index].x = w;
			pieceArray[index].y = h;
		}
	}
}

function adjustOffset() {
	var canvasOffset = $("#puzzleCanvas").offset();
	offsetX = Math.round(canvasOffset.left);
	offsetY = Math.round(canvasOffset.top);
}

function loadPreviousImage() {
	isAnimating = true;
	$('#buttonDiv').slideUp(0);
	imageObj.src = 'images/' + artTitle[currentImageNumber];
	imageObj.onload = function() {
		$('#buttonDiv').slideDown(0, function() {
			isAnimating = false;
			checkForAllPiecesInCorrectSlot();
			drawCanvas();
		});
	}
}

function loadImage() {
	isAnimating = true;
	solved = false;
	$('#buttonDiv').slideUp(0);
	imageObj.src = 'images/' + artTitle[currentImageNumber];
	imageObj.onload = function() {
		putPiecesInRandomSlots();
		$('#buttonDiv').slideDown(0, function() {
			isAnimating = false;
			checkForAllPiecesInCorrectSlot();
			drawCanvas();
		});
	}
}

function doMouseDown(event) {
	if (solved == false && isAnimating == false) {
		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;
		currentMovingFromPiece = getCurrentPiece(mouseX, mouseY);
		drawCanvas();
	}
}

function doMouseMove(event) {
	if (solved == false && isAnimating == false) {
		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;
		drawCanvas();
	}
}

function doMouseUp(event) {
	if (solved == false && isAnimating == false) {
		mouseX = event.clientX - offsetX;
		mouseY = event.clientY - offsetY;
		currentMovingToPiece = getCurrentPiece(mouseX, mouseY);
		switchPieces(currentMovingFromPiece, currentMovingToPiece);
		currentMovingFromPiece = -1;
		checkForAllPiecesInCorrectSlot();
		drawCanvas();
	}
}

function checkForAllPiecesInCorrectSlot() {
	var piecesSolved = 0;
	for (var int = 0; int < PIECES; int++) {
		if (slotArray[int].slotNumber == slotArray[int].piece.pieceNumber) {
			piecesSolved++;
		}
	}
	if (piecesSolved == PIECES) {
		solved = true;
	}
}

function doMouseOut(event) {
	currentMovingFromPiece = -1;
	drawCanvas();
}

function getCurrentPiece(x, y) {
	var xIndex = 0;
	var tempSectionWidth = sectionWidth;
	while (x >= tempSectionWidth) {
		xIndex++;
		tempSectionWidth += sectionWidth;
	}

	var yIndex = 0;
	var tempSectionHeight = sectionHeight;
	while (y >= tempSectionHeight) {
		yIndex++;
		tempSectionHeight += sectionHeight;
	}

	var pieceIndex = xIndex + (yIndex * SIDES);

	return pieceIndex;
}

function putPiecesInRandomSlots() {
	var isRandom = false;
	var attempts = 0;
	var moves = 0;
	if (PIECES % 2 == 0) {
		moves = PIECES / 2;
	} else {
		moves = (PIECES / 2) + 1;
	}
	while (!isRandom) {
		attempts++;
		for (var from = 0; from < moves; from++) {
			var to = Math.floor(Math.random() * PIECES);
			while (from == to) {
				to = Math.floor(Math.random() * PIECES);
			}
			switchPieces(from, to);
		}

		isRandom = true;
		for (var int = 0; int < slotArray.length; int++) {
			if (slotArray[int].slotNumber == slotArray[int].piece.pieceNumber) {
				isRandom = false;
			}
		}
	}
}

function switchPieces(fromSlot, toSlot) {
	var tempPiece = slotArray[toSlot].piece;
	slotArray[toSlot].piece = slotArray[fromSlot].piece;
	slotArray[fromSlot].piece = tempPiece;
}

function drawCanvas() {
	// Store the current transformation matrix
	clearCanvas();
	drawPieces();
}

function drawBorder() {
	context.strokeStyle = "#000000";
	context.lineWidth = 3;
	context.beginPath();

	var tempWidth;
	var tempHeight;
	for (var int = 1; int <= SIDES - 1; int++) {
		tempWidth = sectionWidth * int;

		context.moveTo(tempWidth, 0);
		context.lineTo(tempWidth, 0);
		context.lineTo(tempWidth, canvas.height);

		tempHeight = sectionHeight * int;

		context.moveTo(0, tempHeight);
		context.lineTo(0, tempHeight);
		context.lineTo(canvas.width, tempHeight);
	}

	context.stroke();
}

function drawPieces() {
	for (var int = 0; int < PIECES; int++) {
		var slot = slotArray[int];
		var piece = slotArray[int].piece;
		var movingPiece;
		if (currentMovingFromPiece != int) {
			context.drawImage(imageObj, piece.x, piece.y, sectionWidth,
					sectionHeight, slot.x, slot.y, sectionWidth, sectionHeight);
		} else {
			movingPiece = piece;
		}

		if (solved == false) {
			drawBorder();
		}

		if (movingPiece != null) {
			var centerX = mouseX - sectionWidth / 2;
			var centerY = mouseY - sectionHeight / 2;
			context.drawImage(imageObj, movingPiece.x, movingPiece.y,
					sectionWidth, sectionHeight, centerX, centerY,
					sectionWidth, sectionHeight);
		}
	}
}