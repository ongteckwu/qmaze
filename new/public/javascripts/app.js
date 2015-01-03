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
			var maze = maze_generator(5, 5, [1,1]);

			var lines = maze_render(maze, stage, max_width, max_height);
			createjs.Ticker.framerate = 60;
			console.log(lines.length);
			var addline = function() {
				if (lines.length == 0)
					createjs.Ticker.removeEventListener("tick", addline);		
				var line = lines.shift();
				stage.addChild(line);
				stage.update();
			};
			createjs.Ticker.addEventListener("tick", addline);
			stage.update();
			console.log("DONE");
		});
	});
