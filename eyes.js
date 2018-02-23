function distToTime(x_new, x_old, y_new, y_old){
  var a = x_new - x_old;
  var b = y_new - y_old;

  var c = Math.sqrt( a*a + b*b );
  return c;
};





$(function() {
  var DEBUG = false;

  var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg';
  var two = new Two({
    type: Two.Types[type],
    width: 656,
    height: 416,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

  Two.Resoultion = 32;
  var eye_properties = {};
  eye_thickness_base = 37.5;
  eye_amplitude_base = 37.5;
  eye_height_base = 75;
  eye_width_base  = 150;
  eye_spacing_base = 138;
  eye_thickness=eye_thickness_base
  eye_amplitude=eye_amplitude_base
  eye_height=eye_height_base
  eye_width = eye_width_base
  eye_spacing = eye_spacing_base

  var delta = new Two.Vector();
  var mouse = new Two.Vector();
  var adjDelta = new Two.Vector();
  var drag = .2;
  var mouseDot = two.makeCircle(0,0,5);
  var leftEye  = two.makePath(-eye_width/2, eye_height/2,  0, -eye_height/2,  eye_width/2, eye_height/2,  eye_width/2-eye_thickness, eye_height/2, 0, -eye_height/2+eye_thickness, -eye_width/2+eye_thickness, eye_height/2);
  var rightEye = two.makePath(-eye_width/2, eye_height/2,  0, -eye_height/2,  eye_width/2, eye_height/2,  eye_width/2-eye_thickness, eye_height/2, 0, -eye_height/2+eye_thickness, -eye_width/2+eye_thickness, eye_height/2);
  var eyes = two.makeGroup(leftEye, rightEye);
  if(DEBUG){
    var groupRect = two.makeRectangle(0,0,20,20);
    var forceVector = two.makeLine(0,0,0,0);
  }
  eyes.center();
  leftEye.translation.set(-138,0);
  rightEye.translation.set(138,0);





  Object.defineProperty(eye_properties,'eye_height',
  {
    get: function() {
      return eye_height;
    },
    set: function(value){
      eye_height=value;
      leftEye.vertices[0].origin.y = eye_height/2;
      leftEye.vertices[1].origin.y = -eye_height/2;
      leftEye.vertices[2].origin.y = eye_height/2;
      leftEye.vertices[3].origin.y = eye_height/2;
      leftEye.vertices[4].origin.y = -eye_height/2+eye_thickness
      leftEye.vertices[5].origin.y = eye_height/2;
      rightEye.vertices[0].origin.y = eye_height/2;
      rightEye.vertices[1].origin.y = -eye_height/2;
      rightEye.vertices[2].origin.y = eye_height/2;
      rightEye.vertices[3].origin.y = eye_height/2;
      rightEye.vertices[4].origin.y = -eye_height/2+eye_thickness
      rightEye.vertices[5].origin.y = eye_height/2;
    }
  });
  Object.defineProperty(eye_properties,'eye_thickness',
  {
    get: function() {
      return eye_thickness;
    },
    set: function(value){
      eye_thickness=value;
      leftEye.vertices[3].origin.x = eye_width/2-eye_thickness;
      leftEye.vertices[4].origin.y = -eye_height/2+eye_thickness;
      leftEye.vertices[5].origin.x = -eye_width/2+eye_thickness;
      rightEye.vertices[3].origin.x = eye_width/2-eye_thickness;
      rightEye.vertices[4].origin.y = -eye_height/2+eye_thickness;
      rightEye.vertices[5].origin.x = -eye_width/2+eye_thickness;
    }
  });
  Object.defineProperty(eye_properties,'eye_width',
  {
    get: function() {
      return eye_width;
    },
    set: function(value){
      console.log("test");
      eye_width=value;
      leftEye.vertices[0].origin.x = -eye_width/2;
      leftEye.vertices[2].origin.x = eye_width/2;
      leftEye.vertices[3].origin.x = eye_width/2-eye_thickness;
      leftEye.vertices[5].origin.x = -eye_width/2+eye_thickness;
      rightEye.vertices[0].origin.x = -eye_width/2;
      rightEye.vertices[2].origin.x = eye_width/2;
      rightEye.vertices[3].origin.x = eye_width/2-eye_thickness;
      rightEye.vertices[5].origin.x = -eye_width/2+eye_thickness;
    }
  });

  // var blink = new TWEEN.Tween(eye_properties)
  //     .to({eye_thickness: 0, eye_height: 0}, 50)
  //     .onComplete(function(e){
  //       var blinkEnd = new TWEEN.Tween(eye_properties)
  //           .to({eye_thickness: eye_thickness_base, eye_height: eye_height_base}, 50)
  //           .delay(150)
  //           .onComplete(function(e){
  //             var blinkIDLE = new TWEEN.Tween(eye_properties) //hacky async delay before starting blink loop again
  //                 .to({eye_thickness: eye_thickness_base, eye_height: eye_height_base}, Math.random()*7000+6000)
  //                 .onComplete(function(e){
  //                   blink.start();
  //                 })
  //                 .start();
  //           })
  //           .start();
  //     })
  //     .start();


  var width=50;
  // eyes.scale = two.width/656;
  console.log("SCALE:");
  console.log(two.width/656);
  eyes.noStroke().fill = "#2980b9";
  mouseDot.noStroke().fill = "#FFFFFF";
  mouseDot.visible=false;
  if(DEBUG){
   eyes.noFill().stroke = "#2980b9";
   groupRect.noFill().stroke = "#ff0000";
   forceVector.stroke = "#00ff00";
   mouseDot.visible=true;
 }

  _.each(eyes.children, function(v){
    _.each(v.vertices, function(v) {
      v.origin = new Two.Vector().copy(v);
    });
  });
  var blink = new TWEEN.Tween({tallY: leftEye.vertices[1].origin.y, smallY: leftEye.vertices[4].origin.y})
      .to({tallY: leftEye.vertices[0].origin.y, smallY: leftEye.vertices[0].origin.y}, 50)
      .onUpdate(function(v){
        leftEye.vertices[1].origin.y=v.tallY;
        leftEye.vertices[4].origin.y=v.smallY;
        rightEye.vertices[1].origin.y=v.tallY;
        rightEye.vertices[4].origin.y=v.smallY;
      })
      .onComplete(function(e){
        var blinkEnd = new TWEEN.Tween({tallY: leftEye.vertices[1].origin.y, smallY: leftEye.vertices[4].origin.y})
            .to({tallY: -eye_height/2, smallY: -eye_height/2+eye_thickness}, 50)
            .delay(150)
            .onUpdate(function(v){
              leftEye.vertices[1].origin.y=v.tallY;
              leftEye.vertices[4].origin.y=v.smallY;
              rightEye.vertices[1].origin.y=v.tallY;
              rightEye.vertices[4].origin.y=v.smallY;
            })
            .onComplete(function(e){
              var blinkIDLE = new TWEEN.Tween({tallY: leftEye.vertices[1].origin.y, smallY: leftEye.vertices[4].origin.y}) //hacky async delay before starting blink loop again
                  .to({tallY: eye_height/2, smallY: eye_height/2-eye_thickness}, Math.random()*7000+6000)
                  .onComplete(function(e){
                    blink.start();
                  })
                  .start();
            })
            .start();
      })
      .start();
  var $window = $(window)
    .bind('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    })
    .bind('touchstart', function() {
      e.preventDefault();
      return false;
    })
    .bind('mousedown', function(e){
      switch(event.which){
          case 1:
            var rotateOne = new TWEEN.Tween(leftEye)
                .to({rotation: Math.PI}, 200)
                .onUpdate(function(v){rightEye.rotation=v.rotation})
                .start();
            var happy = new TWEEN.Tween(leftEye.translation)
                .to({y: "-100"}, 200)
                .onUpdate(function(v){rightEye.translation.y=leftEye.translation.y})
                .onComplete(function(e){
                  var happytwo = new TWEEN.Tween(leftEye.translation)
                      .to({y:0}, 200)
                      .onUpdate(function(v){rightEye.translation.y=leftEye.translation.y})
                  var rotatetwo = new TWEEN.Tween(leftEye)
                      .to({rotation: Math.PI*2}, 200)
                      .onUpdate(function(v){rightEye.rotation=v.rotation})
                      .onComplete(function(v){leftEye.rotation=0; rightEye.rotation=0;})
                  happytwo.start();
                  rotatetwo.start();
                })
                .start();
            break;
          case 2:
            var rotateOne = new TWEEN.Tween(leftEye)
                .to({rotation: Math.PI}, 200)
                .onUpdate(function(v){rightEye.rotation=-v.rotation})
                .start();
            // var angryColor = new TWEEN.Tween(leftEye)
            //     .to({fill: "#ff0000"}, 200)
            //     .onUpdate(function(v){
            //       console.log(v.fill)
            //       eyes.fill = v.fill})
            //     .onComplete(function(e){
            //     })
            //     .start();
            break;
      }

    })

    .bind('touchmove', function(e) {
      e.preventDefault();
      var touch = e.originalEvent.changedTouches[0];
      mouse.x = touch.pageX;
      mouse.y = touch.pageY;
      return false;
    });
  two.bind('update', function() {
    TWEEN.update();
    mouseDot.translation.set(mouse.x,mouse.y);
    console.log()
    delta.copy(mouse).subSelf(eyes.translation);
    _.each(eyes.children, function(v){
      var rot = v.rotation;
      var ca = Math.cos(-rot);
      var sa = Math.sin(-rot);
      adjDelta.x = delta.x*ca-delta.y*sa;
      adjDelta.y = delta.x*sa+ca*delta.y;
      _.each(v.vertices, function(v) {
        var dist = v.origin.distanceTo(adjDelta);
        dist = Math.min(dist, 200);
        var pct = dist / width;
        var x = adjDelta.x * pct;
        var y = adjDelta.y * pct;

        var destx = v.origin.x - x;
        var desty = v.origin.y - y;
        v.x += (destx - v.x) * drag;
        v.y += (desty - v.y) * drag;
        if(DEBUG){
          forceVector.vertices[0]=eyes.translation;
          forceVector.vertices[1].set(eyes.translation.x-(adjDelta.x * pct),  eyes.translation.y-(adjDelta.y * pct));
        }
      });
    });
    eyes.translation.addSelf(delta);
    if(DEBUG){
      groupRect.vertices[0].set(eyes.getBoundingClientRect().left, eyes.getBoundingClientRect().top);
      groupRect.vertices[1].set(eyes.getBoundingClientRect().right, eyes.getBoundingClientRect().top);
      groupRect.vertices[3].set(eyes.getBoundingClientRect().left, eyes.getBoundingClientRect().bottom);
      groupRect.vertices[2].set(eyes.getBoundingClientRect().right, eyes.getBoundingClientRect().bottom);
    }
    console.log(leftEye.fill)
  });

});
