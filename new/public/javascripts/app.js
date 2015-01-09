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

require(['qmazealgo', 'qlearning', 'create', 'jquery'],
	function(qmazealgo, qlearning, create, $) {
		$(document).ready(function() {

			var max_height = 800;
			var max_width = 800;
			var $canvas = $("#mazeCanvas");
			$canvas.attr("width", max_width);
			$canvas.attr("height", max_height);
			var maze_generator = qmazealgo.mazeGenerator;
			var maze_render = qmazealgo.mazeRender;
			var stage = new createjs.Stage("mazeCanvas");
			var gridsize = 10;
			var gridsize2 = 10;
			//randomize endPoint
			var endPoints = [];
			for (var i=0; i<6; i++) {
				ep1 = Math.floor(Math.random() * 4*gridsize/5 + gridsize/5); 
				ep2 = Math.floor(Math.random() * 4*gridsize2/5 + gridsize2/5);
				endPoints.push([ep1, ep2])
			}
			startPoint = [0,0];
			var maze = maze_generator(gridsize, gridsize2, endPoints = endPoints, startPoint = startPoint);
			maze_render(maze, stage, max_width, max_height);
			var agent = new qlearning.QAgent(startPoint, maze, stage, gridsize, gridsize2, max_width, max_height, endPoints);
			var qlearner = new qlearning.QLearning(agent, maze, alpha = 0.05, k_random = 0.9, e = 0.01);
			createjs.Ticker.fps = 120;
			var thisfunc = function() {
				if (agent.render_queue.length == 0) 
					createjs.Ticker.removeEventListener("tick", thisfunc);
				agent.render();
			}
			createjs.Ticker.addEventListener("tick", thisfunc)
			// qlearner.addEventListener("updateAgent", function() {
			// 	agent.render();
			// });
			qlearner.run();

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
