
/**
 * js describe the real world's object
 * vector object
 * @param x 		x-coordinate
 * @param y 		x-coordinate
 * @param z 		x-coordinate
 */
function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.set = function(x, y) {
		this.x = x;
		this.y = y;
	};
}

/**
 * point's collection
 */
function PointCollection() {
	this.mousePos = new Vector(-100, -100);
	this.pointCollectionX = 0;
	this.pointCollectionY = 0;
	this.points = [];

	//refresh every point's position
	this.update = function() {
		for (var i = 0; i < this.points.length; i++) {
			var point = this.points[i];

			var dx = this.mousePos.x - point.curPos.x;
			var dy = this.mousePos.y - point.curPos.y;
			var dd = (dx * dx) + (dy * dy);
			var d = Math.sqrt(dd);

			//make sure every point target position
			point.targetPos.x = d < 150 ? point.curPos.x - dx
					: point.originalPos.x;
			point.targetPos.y = d < 150 ? point.curPos.y - dy
					: point.originalPos.y;

			point.update();
		}
	};

	//make point shake
	this.shake = function() {
		//var randomNum = Math.floor(Math.random() * 5) - 2;

		for (var i = 0; i < this.points.length; i++) {
			var point = this.points[i];
			var dx = this.mousePos.x - point.curPos.x;
			var dy = this.mousePos.y - point.curPos.y;
			var dd = (dx * dx) + (dy * dy);
			var d = Math.sqrt(dd);

			//if the direct distance less than 50 make point shake
			if (d < 50) {
				this.pointCollectionX = Math.floor(Math.random() * 5) - 2;
				this.pointCollectionY = Math.floor(Math.random() * 5) - 2;
			}
			//draw point
			point.draw(bubbleShape, this.pointCollectionX,
					this.pointCollectionY);
		}
	};

	//draw all point
	this.draw = function(bubbleShape, reset) {
		for (var i = 0; i < this.points.length; i++) {
			var point = this.points[i];

			if (point === null)
				continue;

			if (window.reset) {
				this.pointCollectionX = 0;
				this.pointCollectionY = 0;
				this.mousePos = new Vector(-100, -100);
			}

			point.draw(bubbleShape, this.pointCollectionX,
					this.pointCollectionY, reset);
		}
	};

	this.reset = function(bubbleShape) {
	};
}

/**
 * js describe the real world's object
 * @param x 		x-coordinate
 * @param y 		x-coordinate
 * @param z 		x-coordinate
 * @param size 		point's size
 * @param color 	point's color
 */
function Point(x, y, z, size, color) {

	/**
	 * object project's properties
	 */
	this.curPos = new Vector(x, y, z);						//current position
	this.color = color;

	this.friction = document.Friction;						//Ħ��
	this.rotationForce = document.rotationForce;			//��ת ����
	this.springStrength = 0.1;								//���� ����

	this.originalPos = new Vector(x, y, z);					//original position
	this.radius = size;										//target's radius size
	this.size = size;										//target's size
	this.targetPos = new Vector(x, y, z);					//target's position
	this.velocity = new Vector(0.0, 0.0, 0.0);				//speed

	//refresh this point's condition
	this.update = function() {
		var dx = this.targetPos.x - this.curPos.x;							//dynamic x coordinate
		var dy = this.targetPos.y - this.curPos.y;							//dynamic y coordinate
		// Orthogonal vector is [-dy,dx]
		var ax = dx * this.springStrength - this.rotationForce * dy;		//x coordinate acceleration
		var ay = dy * this.springStrength + this.rotationForce * dx;		//y coordinate acceleration

		this.velocity.x += ax;								//speed = speed + acceleration
		this.velocity.x *= this.friction;					//speed = speed * friction
		this.curPos.x += this.velocity.x;

		this.velocity.y += ay;
		this.velocity.y *= this.friction;
		this.curPos.y += this.velocity.y;

		var dox = this.originalPos.x - this.curPos.x;		//document's x coordinate
		var doy = this.originalPos.y - this.curPos.y;		//document's y coordinate
		var dd = (dox * dox) + (doy * doy);
		var d = Math.sqrt(dd);								//direct distance  sqrt(x*x + y*y)

		this.targetPos.z = d / 100 + 1;
		var dz = this.targetPos.z - this.curPos.z;
		var az = dz * this.springStrength;
		this.velocity.z += az;								//z coordinate acceleration
		this.velocity.z *= this.friction;
		this.curPos.z += this.velocity.z;

		this.radius = this.size * this.curPos.z;			//change radius' size when radius move
		if (this.radius < 1)
			this.radius = 1;
	};

	//used to draw this target's shape
	this.draw = function(bubbleShape, dx, dy) {

		/**
		 * add some light effect
		 */

		var grd=ctx.createLinearGradient(
				this.curPos.x - this.radius,
				this.curPos.y - this.radius,
				this.curPos.x - this.radius*1/4,
				this.curPos.y - this.radius*1/4);

		grd.addColorStop(0,"#FFFFFF");
		grd.addColorStop(1,color);
		/*
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 10;
		ctx.shadowOffsetY = 10;
		ctx.shadowColor = "black";
		*/
//		ctx.fillStyle = this.color;
		ctx.fillStyle = grd;

		//make sure bubble's shape and draw method
		if (bubbleShape == "square") {
			ctx.beginPath();											//begin a path or rest current path
			ctx.fillRect(this.curPos.x + dx, this.curPos.y + dy,		//center coordinate
					this.radius * 1.5, this.radius * 1.5);				//current position + dynamic x/y distance
		} else {
			ctx.beginPath();
			ctx.arc(this.curPos.x + dx, this.curPos.y + dy,
					this.radius, 0,Math.PI * 2, true);
			ctx.fill();
		}
	};
}

/**
 * use input create a color format
 * @param hslList		hsl color
 * @param fade			gradient
 * @returns {String}	be formated string
 */
function makeColor(hslList, fade) {
	var hue = hslList[0] /*- 17.0 * fade / 1000.0*/;		//hue			ɫ��
	var sat = hslList[1] /* + 81.0 * fade / 1000.0 */;		//Saturation	���Ͷ�
	var lgt = hslList[2] /* + 58.0 * fade / 1000.0 */;		//light			����
	return "hsl(" + hue + "," + sat + "%," + lgt + "%)";
}

/**
 * make a String change to Hexadecimal
 * @param phrase 		String
 * @returns {String} 	Hexadecimal result
 */
function phraseToHex(phrase) {
	var hexphrase = "";
	for (var i = 0; i < phrase.length; i++) {
		hexphrase += phrase.charCodeAt(i).toString(16);
	}
	return hexphrase;
}

/**
 * initial the listener which should
 * all way's keep listen canvas right
 */
function initEventListeners() {
	$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);
	//$(document).on('tap', onMove).on('vmousemove', onMove);


	canvas.ontouchmove = function(e) {
		e.preventDefault();
		onTouchMove(e);
	};

	canvas.ontouchstart = function(e) {
		e.preventDefault();
	};
}


/**
 * refresh the canvas dom element
 * initial canvas's size and draw 2d graphic
 */
function updateCanvasDimensions() {
	canvas.attr({
		//height : 500,
		//width : 1000
		height : 200,
		width : 600
	});
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();
	draw();
}

/**
 * used to binding event
 * @param e parameter
 */
function onMove(e) {
	if (pointCollection) {
		pointCollection.mousePos.set(e.pageX - canvas.offset().left, e.pageY
				- canvas.offset().top);
//				console.log(e.pageX +"---"+ canvas.offset().left +"|"+ e.pageY +"---"+ canvas.offset().top);
//				console.log((e.pageX - canvas.offset().left) + "|" + (e.pageY - canvas.offset().top));
	}
}

/**
 * used to binding event
 * @param e parameter
 */
function onTouchMove(e) {
	if (pointCollection) {
		pointCollection.mousePos.set(e.targetTouches[0].pageX
				- canvas.offset().left, e.targetTouches[0].pageY
				- canvas.offset().top);
	}
}

/**
 * just shake per 30ms
 */
function bounceName() {
	shake();
	//call self per 30ms(MilliSecond)
	setTimeout(bounceName, 30);
}

/**
 * initial canvas
 * refresh it's self per 30ms
 */
function bounceBubbles() {
	draw();
	update();
	setTimeout(bounceBubbles, 30);
}

/**
 * initial canvas
 * @param reset reset points
 */
function draw(reset) {
	var tmpCanvas = canvas.get(0);

	if (tmpCanvas.getContext === null) {
		return;
	}

	ctx = tmpCanvas.getContext('2d');
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// if bubbleShape not defined set it's default value is circle
	bubbleShape = typeof bubbleShape !== 'undefined' ? bubbleShape : "circle";

	if (pointCollection) {
		pointCollection.draw(bubbleShape, reset);
	}
}

/**
 * invoke collection's shake method
 */
function shake() {
	var tmpCanvas = canvas.get(0);

	if (tmpCanvas.getContext === null) {
		return;
	}

	ctx = tmpCanvas.getContext('2d');
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	bubbleShape = typeof bubbleShape !== 'undefined' ? bubbleShape : "circle";

	if (pointCollection) {
		pointCollection.shake(bubbleShape);
	}
}

/**
 * update all point condition
 */
function update() {
	if (pointCollection)
		pointCollection.update();
}

/**
 * draw the input String and Color
 * @param name				the String be draw
 * @param letterColors		the String's color
 */
function drawName(name, letterColors) {
	updateCanvasDimensions();
	var g = [];
	var offset = 0;

	/**
	 * make letter bubble
	 * @param cc_hex 		character's hexadecimal value
	 * @param ix 			character's real index
	 * @param letterCols	character's color
	 */
	function addLetter(cc_hex, ix, letterCols) {

		//make sure letter's color
		if (typeof letterCols !== 'undefined') {
			if (Object.prototype.toString.call(letterCols) === '[object Array]'
					&& Object.prototype.toString.call(letterCols[0]) === '[object Array]') {
				letterColors = letterCols;
			}
			if (Object.prototype.toString.call(letterCols) === '[object Array]'
					&& typeof letterCols[0] === "number") {
				letterColors = [ letterCols ];
			}
		} else {
			// if undefined set black
			letterColors = [ [ 0, 0, 27 ] ];
		}

		//make sure letter's bubble
		if (document.alphabet.hasOwnProperty(cc_hex)) {
			var chr_data = document.alphabet[cc_hex].P;				//get corresponding character data
			var bc = letterColors[ix % letterColors.length];		//blank is no color circle loop

			//add letter's point into a array
			for (var i = 0; i < chr_data.length; ++i) {
				point = chr_data[i];


						//x, y, z, size, color
				g.push(new Point(point[0] + offset, point[1], 0.0, point[2],
						makeColor(bc, point[3])));
			}

			//offset show the letter's index contain the blank space
			offset += document.alphabet[cc_hex].W;
		}

	}

	/**
	 * get name's hexadecimal variable
	 */
	var hexphrase = phraseToHex(name);

	/**
	 * prepare parameters to add letter
	 */
	var col_ix = -1;			//character's effective length
	for (var i = 0; i < hexphrase.length; i += 2) {
		var cc_hex = "A" + hexphrase.charAt(i) + hexphrase.charAt(i + 1);
		if (cc_hex != "A20") {
			col_ix++;			//not a blank character ' '
		}
		addLetter(cc_hex, col_ix, letterColors);
	}

	/**
	 * make sure letter's position
	 */
	for (var j = 0; j < g.length; j++) {
		g[j].curPos.x = (canvasWidth / 2 - offset / 2) + g[j].curPos.x;
		g[j].curPos.y = (canvasHeight / 2 - 105) + g[j].curPos.y;
		g[j].originalPos.x = (canvasWidth / 2 - offset / 2)
				+ g[j].originalPos.x;
		g[j].originalPos.y = (canvasHeight / 2 - 105) + g[j].originalPos.y;
	}

	/**
	 * create new point collection
	 * and set it's property
	 */
	pointCollection = new PointCollection();
	pointCollection.points = g;
	initEventListeners();
}



window.reset = false;

$(window).mouseleave(function() {
	window.reset = true;
});

$(window).mouseenter(function() {
	window.reset = false;
});

var canvas = $("#myCanvas");
var canvasHeight;
var canvasWidth;
var ctx;
var pointCollection;

/**
 * groble value
 */
document.rotationForce = 0.0;
document.Friction = 0.85;

var white = [ 0, 0, 100 ];
var black = [ 0, 0, 27 ];
var red = [ 0, 100, 63 ];
var orange = [ 40, 100, 60 ];
var green = [ 75, 100, 40 ];
var blue = [ 196, 77, 55 ];
var purple = [ 280, 50, 60 ];

setTimeout(updateCanvasDimensions, 30);



/** 判断移动端 */
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/*Bubble*/
var myName = "lcg51271";
var red = [0, 100, 63];
var orange = [40, 100, 60];
var green = [75, 100, 40];
var blue = [196, 77, 55];
var purple = [280, 50, 60];
var letterColors = [red, orange, green, blue, purple];

drawName(myName, letterColors);
// square
bubbleShape = 'circle';
// 手机不弹
if(IsPC()) {
  bounceBubbles();
} else {
  draw();
}
