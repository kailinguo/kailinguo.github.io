var drawGear = function(context,options){
	if(context){
		var default_options = {
			centerX: 50,
			centerY: 50,
			numberofTeath: 10,
			outerRadius:6,
			curve:6,
			pitch:10,
			innerRadius:4,
			rotateAngle:0,
			color:'#000000'
			};
		options = options || {};
		for (var opt in default_options)
			if (default_options.hasOwnProperty(opt) && !options.hasOwnProperty(opt))
				options[opt] = default_options[opt];

		  var enddeg=0,deg=0;
		  var angle=180/options.numberofTeath;
		  radius = options.numberofTeath*options.outerRadius*2/Math.PI;

		  var rad2deg = 180/Math.PI;
		  //circle
		  context.beginPath();
		  context.arc(options.centerX, options.centerY, options.innerRadius, 0, 2 * Math.PI, false);
		  context.strokeStyle = options.color;
		  context.stroke();

		  context.beginPath();
		  for(var i=0;i<=options.numberofTeath;++i)
		  {
			sdeg = i*angle*2+options.rotateAngle;
			senddeg= angle- (angle/options.curve);
			enddeg= (sdeg+senddeg)/rad2deg;
			deg = sdeg/rad2deg;
			context.arc(options.centerX, options.centerY, radius, deg, enddeg, false);
			 sdeg = sdeg+angle;
			enddeg= (sdeg+senddeg)/rad2deg;
			deg = sdeg/rad2deg;
			context.arc(options.centerX, options.centerY, radius-options.pitch, deg, enddeg, false);
		  }
		  context.strokeStyle = options.color;
		  context.stroke();
		  context.closePath();
	  }
   }

  var gearCanvas = document.getElementById('gearCanvas');
  var context = gearCanvas.getContext('2d');
  var centerCanX = gearCanvas.width / 4;
  var centerCanY = gearCanvas.height / 2;
  //var speed = 200;
  var speed = 50;
  var option1 = {
			centerX: centerCanX,
			centerY: centerCanY,
			numberofTeath: 10,
			outerRadius:6,
			curve:6,
			pitch:10,
			innerRadius:4,
			rotateAngle:0,
			//color:'#003300'
			color:'#ffff00'
			};
  var option2 = {
			centerX: centerCanX+70,
			centerY: centerCanY,
			numberofTeath: 10,
			outerRadius:6,
			curve:6,
			pitch:10,
			innerRadius:4,
			rotateAngle:0,
			//color:'#FF3300'
			color:'#6666ff'
			};
  //var angleChange = 10;
  var angleChange = 1;
  drawGear(context,option1);
  drawGear(context,option2);
  setInterval(function(){
     context.clearRect ( 0 , 0 , gearCanvas.width , gearCanvas.height );
     option1.rotateAngle = (option1.rotateAngle - angleChange + 360 )%360;
     option2.rotateAngle = (option2.rotateAngle + angleChange)%360 ;
     drawGear(context,option1);
     drawGear(context,option2);
  }  , speed);
