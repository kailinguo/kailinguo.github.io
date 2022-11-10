(function(global) {
var Sprite = function (name, painter, behaviors) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;
   if (behaviors !== undefined) this.behaviors = behaviors;

   return this;
};

Sprite.prototype = {
   left: 0,
   top: 0,
   width: 10,
   height: 10,
	velocityX: 0,
	velocityY: 0,
   visible: true,
   animating: false,
   painter: undefined, // object with paint(sprite, context)
   behaviors: [], // objects with execute(sprite, context, time)

   paint: function (context) {
     if (this.painter !== undefined && this.visible) {
        this.painter.paint(this, context);
     }
	},

   update: function (context, time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
   }
};

var canvas = document.getElementById('pendulumCanvas'),
    context = canvas.getContext('2d'),
    startTime = undefined,

    PIVOT_Y = 20,//摆杆上端的Y坐标
    PIVOT_RADIUS = 7,//钟摆上端球的半径
    WEIGHT_RADIUS = 25,//钟摆下端球的半径
    INITIAL_ANGLE = Math.PI/6,//钟摆的初始角度/5
    ROD_LENGTH_IN_PIXELS = 300,//摆杆长

    // 钟摆的绘制器..............................
    pendulumPainter = {
      PIVOT_FILL_STYLE:    'rgba(0,0,0,0.2)',
      WEIGHT_SHADOW_COLOR: 'rgb(0,0,0)',
      PIVOT_SHADOW_COLOR:  'rgb(255,255,0)',
      STROKE_COLOR:        'rgb(0,0,0)',//'rgb(100,100,195)',

      paint: function (pendulum, context) {
         this.drawPivot(pendulum);
         this.drawRod(pendulum);
         this.drawWeight(pendulum, context);
      },

      //画杆下端的球
      drawWeight: function (pendulum, context) {
         context.save();
         context.beginPath();
         context.arc(pendulum.weightX, pendulum.weightY,
                     pendulum.weightRadius, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = this.WEIGHT_SHADOW_COLOR;
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;

         context.lineWidth = 2;
         context.strokeStyle = this.STROKE_COLOR;
         context.stroke();

         context.beginPath();
         context.arc(pendulum.weightX, pendulum.weightY,
                     pendulum.weightRadius/2, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = this.PIVOT_SHADOW_COLOR;
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;
         context.stroke();

         context.restore();
      },
       //画杆上端的球
      drawPivot: function (pendulum) {
         context.save();
         context.beginPath();
         context.shadowColor = undefined;
         context.shadowBlur = undefined;
         context.shadowOffsetX = 0;
         context.shadowOffsetY = 0;
         context.fillStyle = 'white';
         context.arc(pendulum.x + pendulum.pivotRadius,
                     pendulum.y, pendulum.pivotRadius/2, 0, Math.PI*2, false);
         context.fill();
         context.stroke();

         context.beginPath();
         context.fillStyle = this.PIVOT_FILL_STYLE;
         context.arc(pendulum.x + pendulum.pivotRadius,
                     pendulum.y, pendulum.pivotRadius, 0, Math.PI*2, false);
         context.fill();
         context.stroke();
         context.restore();
      },
      //画杆
      drawRod: function (pendulum) {
         context.beginPath();

         context.moveTo(
            pendulum.x + pendulum.pivotRadius +
            pendulum.pivotRadius*Math.sin(pendulum.angle),

            pendulum.y + pendulum.pivotRadius*Math.cos(pendulum.angle));

         context.lineTo(
            pendulum.weightX - pendulum.weightRadius*Math.sin(pendulum.angle),
            pendulum.weightY - pendulum.weightRadius*Math.cos(pendulum.angle));

         context.stroke();
      }
    },

    // 精灵的行为对象........................

    swing = {
       GRAVITY_FORCE: 1, // 32 ft/s/s,
       ROD_LENGTH: 3.0,   // 0.8 ft

       execute: function(pendulum, context, time) {
          var elapsedTime = (time - startTime) / 1000;

          pendulum.angle = pendulum.initialAngle * Math.cos(
             Math.sqrt(this.GRAVITY_FORCE/this.ROD_LENGTH) * elapsedTime);

          pendulum.weightX = pendulum.x +
                             Math.sin(pendulum.angle) * pendulum.rodLength;

          pendulum.weightY = pendulum.y +
                             Math.cos(pendulum.angle) * pendulum.rodLength;
       }
    },

  // 钟摆对象..............................
  pendulum = new Sprite('pendulum', pendulumPainter, [ swing ]);

  // 动画循环..............................
  function animate(time) {
   context.clearRect(0,0,canvas.width,canvas.height);
   //drawGrid('lightgray', 10, 10);
   pendulum.update(context, time);//钟摆更新
   pendulum.paint(context);//钟摆绘制
   //window.requestNextAnimationFrame(animate);
   requestAnimationFrame(animate);
 }


 //画背景网络线
 function drawGrid(color, stepx, stepy) {
   context.save()

   context.shadowColor = undefined;
   context.shadowBlur = 0;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;

   context.strokeStyle = color;
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);

   for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
     context.beginPath();
     context.moveTo(i, 0);
     context.lineTo(i, context.canvas.height);
     context.stroke();
   }

   for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
   }

   context.restore();
 }


// 初始化.........
 pendulum.x = canvas.width/2; //钟摆的X坐标
 pendulum.y = PIVOT_Y;//钟摆的Y坐标
 pendulum.weightRadius = WEIGHT_RADIUS;
 pendulum.pivotRadius  = PIVOT_RADIUS;
 pendulum.initialAngle = INITIAL_ANGLE;
 pendulum.angle        = INITIAL_ANGLE;
 pendulum.rodLength    = ROD_LENGTH_IN_PIXELS;

 context.lineWidth = 0.5;
 context.strokeStyle = 'rgba(0,0,0,0.5)';

 if (navigator.userAgent.indexOf('Opera') === -1)
   context.shadowColor = 'rgba(0,0,0,0.5)';

 context.shadowOffsetX = 2;
 context.shadowOffsetY = 2;
 context.shadowBlur = 4;
 context.stroke();

 startTime = + new Date();
 animate(startTime);

 //drawGrid('lightgray', 10, 10);
})(window);
