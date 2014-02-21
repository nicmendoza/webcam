/*
	todo: revisit this project, get it to add classes to elements, or some such

*/

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
 
(function($) {
 
   var o = $({});
  
   $.subscribe = function() {
     o.on.apply(o, arguments);
   };
  
   $.unsubscribe = function() {
     o.off.apply(o, arguments);
   };
  
   $.publish = function() {
     o.trigger.apply(o, arguments);
   };
  
 }(jQuery));

var headPosition = {
	left: 0,
	top: 0
}


function stageModel(){
	var self = this;
	
	this.player = $('#fake_head');
	
	this.center = {
		horizontal : 0,
		vertical: 0
	};
	
	this.size = {
		height: 0,
		width: 0
	};
	
	this.maxOffset = {
		x: 100,
		y: 100
	}
	
	this.headData = {
		x: 0,
		y: 0,
		width: 10,
		height: 10,
		
	}
	
	this.currentOffset = function(){
		return {
			x: self.headData.x,
			y: self.headData.y
		}
	}
	
	
	this.levels = 4;
	
	this.setup = function(){
		for(var i = 1; i <= self.levels; i++){
			$('[data-level=' + i + ']').each(function(){
				var $this = $(this);
				$this.data('originalState', {
					x: $this.position().left,
					y: $this.position().top,
					width: $this.width(),
					height: $this.height(),
					levelRatio: i / self.levels * .2 //increase ratio for deeper scene
				});
				$this.css('z-index', i);
			})
		};
		stage.size = {
			height: $(window).height(),
			width: $(window).width()
		}
		
		stage.center = {
			vertical : stage.size.height / 2,
			horizontal : stage.size.width / 2
		}
	};
	
	this.redraw = function(){
		for(var i = 1; i <= self.levels; i++){
			$('[data-level=' + i + ']').each(function(){
				var $this = $(this);
				var data = $this.data('originalState');
											
				$this.css({
					left: data.x + stage.currentOffset().x * data.levelRatio, //webcam is reversed left to right
					top: data.y - stage.currentOffset().y * data.levelRatio
				})
			})
		};
	}
}

var stage = new stageModel();
stage.setup();


var video = document.querySelector("#webcam");
var canvas = document.querySelector('#canvas');
var statusDisplay = document.querySelector('#status-message');
var ctx = canvas.getContext('2d');
var localMediaStream = null;
//
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//
var imgGrabInt = 1; // iterate frames to limit how often images are drawn into canvas
var imgGrab = true;
//
var onCameraFail = function (e) {
    console.log('Camera did not work.', e);
};
	
	
glasses = new Image();
glasses.src = "images/facebox.png";

function drawOnFrame() {
    // Start the clock
    			 
    // Draw the video to canvas
    ctx.drawImage(video, 0, 0, video.width, video.height, 0, 0, canvas.width, canvas.height);
 
    // use the face detection library to find the face
    var comp = ccv.detect_objects({ "canvas" : (ccv.pre(canvas)),
                                    "cascade" : cascade,
                                    "interval" : 5,
                                    "min_neighbors" : 1 });
                                    
 
    // Stop the clock			 
    // Draw on image
    
    var best = 0;
    
    if(comp.length == 0){
    	$('#status-message').text('Face not found');
    } else {
    	
    	$('#status-message').text('');
    };
    
    for (var i = 0; i < comp.length; i++) {
    	// ctx.drawImage(glasses, comp[i].x, comp[i].y,comp[i].width, comp[i].height); // draws all boxes
    	if(comp.length > 0){
    		if(comp.length > 1 && comp[(i-1)] && (comp[i].confidence > comp[(i-1)].confidence)) {
    			best = i;
    		};
    		
    		var ratio = stage.size.width / canvas.width;
    		stage.headData = {
    			x: (comp[best].x + comp[best].width/2 - canvas.width / 2) * ratio,
    			y: (comp[best].y + comp[best].height/2 - canvas.height / 2) * ratio,
    			height: comp[best].height * ratio,
    			width: comp[best].width * ratio,
    			
    		}

        	ctx.drawImage(glasses, comp[best].x, comp[best].y,comp[best].width, comp[best].height);
    	}
    	stage.redraw();		        
    }
    	
}
	
	
	
	
	
video.addEventListener('play', function() { 
	vidInterval = setInterval(drawOnFrame, 60); 
 }, false);
	 
video.addEventListener('ended', function() {
    clearInterval(vidInterval);
});
	 video.addEventListener('pause', function() {
    clearInterval(vidInterval);
});
	
	
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia({video:true}, function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
}, onCameraFail);

$(window).keydown(function(e){
	switch(e.keyCode){
		case 32: 
			if (video.paused){
				video.play();
			} else {
				video.pause();
			}
			return false;
			break;
	}
});