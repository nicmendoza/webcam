<!DOCTYPE html>
<html>
	<head>
		<title>Webcam test</title>
		<style>
			html, body {
				width: 100%; height: 100%;
				margin: 0;
			}
		
			#box1 {
				background-color: #333;
				height: 100px;
				width: 100px;
				
				position: absolute;
				top: 200px;
				left: 500px;
			}
			
			#box2{
				width: 110px;
				height: 110px;
				background-color: #444;
				
				position: absolute;
				top: 195px;
				left: 495px;
			}
			
			#box3{
				width: 120px;
				height: 120px;
				background-color: #555;
				
				position: absolute;
				top: 190px;
				left: 490px;
			}
			
			#box4{
				width: 130px;
				height: 130px;
				background-color: #666;
				
				position: absolute;
				top: 185px;
				left: 485px;
			}
			
			
			#stage {
				position: fixed;
				height: 100%;
				width: 100%;
				top: 0;
				left: 0;
			}
		</style>
	</head>
	<body>
		<div id="stage">
		<div id="box1" data-level="4"></div>
    	<div id="box2" data-level="3"></div>
    	<div id="box3" data-level="2"></div>
    	<div id="box4" data-level="1"></div>
    </div>
    <script type="text/javascript" src="/scripts/jquery-1.7.1.min.js"></script>	
		<script type="text/javascript">
			
			function stageModel(){
				var self = this;
				
				this.player = $('#fake_head');
				
				this.center = {
					horizontal : 0,
					vertical: 0
				};
				
				this.maxOffset = {
					x: 100,
					y: 100
				};
				
				this.headData = {
					x: 0,
					y: 0,
					width: 10,
					height: 10,
					
				};
				
				this.currentOffset = function(){
					return {
						x: self.headData.x - self.center.horizontal,
						y: self.headData.y - self.center.vertical
					}
				}
				
				
				this.levels = 4;
				
				this.setup = function(){
					for(var i = 1; i <= self.levels; i++){
						$('[data-level=' + i + ']').each(function(){
							var $this = $(this);
							$this.data('originalPosition', {
								x: $this.position().left,
								y: $this.position().top,
								levelRatio: i / self.levels
							});
							$this.css('z-index', i)
						})
					}
				};
				
				this.redraw = function(){
					self.player.css({
						top: self.headData.y,
						left: self.headData.x,
						height: self.headData.height,
						width: self.headData.width
					});
					
					for(var i = 1; i <= self.levels; i++){
						$('[data-level=' + i + ']').each(function(){
							var $this = $(this);
							var data = $this.data('originalPosition');
							$this.css({
								left: data.x - stage.currentOffset().x * data.levelRatio,
								top: data.y - stage.currentOffset().y * data.levelRatio
							})
						})
					};
					
					$()// select players by level and offset them by head offset from center, proportional to level they are on
					
				}
			}
			
			var stage = new stageModel();
			stage.setup();
			
			
			$(window).on('mousemove', function(e){
			    stage.headData = {
			    	x: e.clientX,
			    	y: e.clientY
			    };
			    
			    stage.redraw();
			});
			
			//setInterval(stage.redraw, 600)
			
			$(function(){
				stage.center.horizontal = $(window).width() / 2;
				stage.center.vertical = $(window).height() / 2;
			})
		</script>
	</body>
</html>