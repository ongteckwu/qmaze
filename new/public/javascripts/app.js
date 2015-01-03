//q-maze app
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'javascripts/utility',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

require(['qmazealgo', 'create', 'jquery'],
	function(qmazealgo, create, $) {
		$(document).ready(function() {

			var max_height = 500;
			var max_width = 500;
			var maze_generator = qmazealgo.mazeGenerator;
			var maze_render = qmazealgo.mazeRender;
			var stage = new createjs.Stage("mazeCanvas");
			var gridsize = 10;
			var gridsize2 = 10;
			//randomize endPoint
			ep1 = Math.floor(Math.random() * gridsize); 
			ep2 = Math.floor(Math.random() * gridsize2);
			var maze = maze_generator(gridsize, gridsize2, endPoint = [ep1, ep2], startPoint = [0, 0]);
			maze_render(maze, stage, max_width, max_height);			
			// createjs.Ticker.framerate = 500;
			// console.log(lines.length);
			// var addline = function() {
			// 	if (lines.length == 0)
			// 		createjs.Ticker.removeEventListener("tick", addline);		
			// 	var line = lines.shift();
			// 	stage.addChild(line);
			// 	stage.update();
			// };
			// createjs.Ticker.addEventListener("tick", addline);
			// stage.update();
			console.log("DONE");
		});
	});
