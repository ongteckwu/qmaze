define(['./typechecker', './assert', './shuffle', './mazegrids', './tile', './create', './roundto2'],
	function(typechecker, assert, shuffle, grids, Tile, create, roundto2) {
		var mazeGenerator = function(gridsize, gridsize2, endPoints, startPoint, rewardGrid) {
			//reward grid must have the same size
			// assert((gridsize == rewardGrid.gridsize && 
			// 			gridsize2 == rewardGrid.gridsize2), "Grid Sizes have to be the same!!!");
			// assert(((endPoint[0] >= 0 && endPoint[0] < gridsize2) && (endPoint[1] >= 0 && endPoint[1] < gridsize),
			// 		"Endpoint coordinates not in grid"));

			//generates a complete maze grid
			var mazeGrid = new grids.Grid(gridsize, gridsize2, Tile);
			//initial cell at 0,0
			//stack & visited list
			var stack = [];
			var visited = [];
			var p = startPoint;
			mazeGrid.startPoint = startPoint;
			var endPoint = endPoints[0];
			var endPoints = endPoints;
			//for maze creation purposes
			mazeGrid.endPoint = endPoint;
			mazeGrid.endPoints = endPoints;
			//give end point a reward of 1
			var reward_e = null;
			for (var i in endPoints) {
				if (i == 0)
					reward_e = 100;
				else 
					reward_e = 1;
				mazeGrid.grid[endPoints[i][1]][endPoints[i][0]].reward = reward_e;
			}

			stack.push(p);
			while (visited.length < gridsize*gridsize2)  {
				//choose the last tile from stack
				p = stack[stack.length - 1];
				//do not get neighbors if it is an endpoint
				if (p[0] == endPoint[0] && p[1] == endPoint[1]) {
					visited.push(stack.pop());
					continue;
				}
				//get neighbors
				var pre_stack = [];
				var px_array = [];
				// if 0 <= p[0] <= gridsize2-1
				if (p[0] >= 0 && p[0] < gridsize2-1) {
					var px = [p[0]+1, p[1]];
					px_array.push(px);
				}
				if (p[0] < gridsize2 && p[0] > 0) {
					var px = [p[0]-1, p[1]];
					px_array.push(px);
				}
				if (p[1] >= 0 && p[1] < gridsize-1) {
					var px = [p[0], p[1]+1];
					px_array.push(px);
				}
				if (p[1] < gridsize && p[1] > 0) {
					var px = [p[0], p[1]-1];
					px_array.push(px);
				}


				px_array.forEach(function(px) {
					//if not in stack nor visited
					for (var i in stack) {
						if (stack[i][0] == px[0] && stack[i][1] == px[1]) {
							return; 
						}
					}

					for (var i in visited) {
						if (visited[i][0] == px[0] && visited[i][1] == px[1]) {
							return;
						}
					}
					//push into pre_stack if not in stack nor visited
					pre_stack.push(px);
				})
				//if nothing in pre_stack, pop p out of stack and put in visited
				if (pre_stack.length == 0) {
					visited.push(stack.pop());
				}
				else {
					//shuffle to get a randomized array
					pre_stack = shuffle(pre_stack);
					//pick last neighbor to add into stack
					var neighbor_p = pre_stack.pop();
					stack.push(neighbor_p);
					//break wall of tile of p that connects to the neighbor tile
					p_tile_render_walls = mazeGrid.grid[p[1]][p[0]].render_walls;
					p_tile_walls = mazeGrid.grid[p[1]][p[0]].walls;
					np_tile_render_walls = mazeGrid.grid[neighbor_p[1]][neighbor_p[0]].render_walls;
					np_tile_walls = mazeGrid.grid[neighbor_p[1]][neighbor_p[0]].walls;
					if (p[1] != neighbor_p[1]) {
						//neighbor at down
						if (p[1] - neighbor_p[1] == -1) {
							p_tile_walls.D = 0;
							np_tile_walls.U = 0;
							p_tile_render_walls.D = 0;
							np_tile_render_walls.U = 0;
						}
						//neighbor at up
						else {
							p_tile_walls.U = 0;
							np_tile_walls.D = 0;
							p_tile_render_walls.U = 0;
							np_tile_render_walls.D = 0;
						}
					}
					else {
						//neighbor at left
						if (p[0] - neighbor_p[0] == -1) {
							p_tile_walls.R = 0;
							np_tile_walls.L = 0;
							p_tile_render_walls.R = 0;
							np_tile_render_walls.L = 0;
						}
						else {
							p_tile_walls.L = 0;
							np_tile_walls.R = 0;
							p_tile_render_walls.L = 0;
							np_tile_render_walls.R = 0;
						}
					}
				}
			}

			// create a text grid
			return mazeGrid;
		}


		var mazeRender = function(mazeGrid, stage, canvaswidth, canvasheight) {
			var gridheight = roundto2(canvasheight/mazeGrid.gridsize);
			var gridwidth = roundto2(canvaswidth/mazeGrid.gridsize2);

			// var line_queue = [];
			var line = new createjs.Shape();
			line.graphics.setStrokeStyle(4)
						 .beginStroke('#222222');
			var qvalueline = new createjs.Shape();
			qvalueline.graphics.setStrokeStyle(1)
							   .beginStroke('#444444');
			for (var i=0; i<mazeGrid.gridsize; i++) {
				for (var j=0; j<mazeGrid.gridsize2; j++) {
					var current_grid = mazeGrid.grid[i][j];
					// render rewards
					if (mazeGrid.isEndPoint(j, i)) {
						// if it is the first end point (w a reward of 100), render it green instead of lightgreen
						if (mazeGrid.endPoint[0] == j && mazeGrid.endPoint[1] == i) {
							var reward_colour = "green";
						}
						else
							var reward_colour = "LightGreen";
	 					var square = new createjs.Shape();
						square.graphics.beginFill(reward_colour)
									   .drawRect(gridwidth*j, gridheight*i, gridwidth, gridheight);
						stage.addChild(square);
					}
					else if (j == mazeGrid.startPoint[0] && i == mazeGrid.startPoint[1]) {
	 					var square = new createjs.Shape();
						square.graphics.beginFill("LightBlue")
									   .drawRect(gridwidth*j, gridheight*i, gridwidth, gridheight);
						stage.addChild(square);
					}
					// render q-values
					var qvalues = current_grid.qvalues;
					// draw the q-value crosses
					qvalueline.graphics.moveTo(gridwidth*j, gridheight*i)
								 	   .lineTo(gridwidth*(j+1), gridheight*(i+1))
								 	   .moveTo(gridwidth*(j+1), gridheight*i)
								 	   .lineTo(gridwidth*j, gridheight*(i+1));
					//draw the text values
					// render walls
					for (var wall in current_grid.render_walls) {
						// if property exists and if wall should be existent
						if (current_grid.walls.hasOwnProperty(wall) && current_grid.render_walls[wall]) {

							//left wall rendering
							if (wall == "L") {
								line.graphics.moveTo(gridwidth*j, gridheight*i)
									.lineTo(gridwidth*j, gridheight*(i+1));
							}
							else if (wall == "R") {
								line.graphics.moveTo(gridwidth*(j+1), gridheight*i)
									.lineTo(gridwidth*(j+1), gridheight*(i+1));
							}
							else if (wall == "U") {
								line.graphics.moveTo(gridwidth*j, gridheight*i)
									.lineTo(gridwidth*(j+1), gridheight*i);
							}
							else if (wall == "D") {
								line.graphics.moveTo(gridwidth*j, gridheight*(i+1))
									.lineTo(gridwidth*(j+1), gridheight*(i+1));
							}
						}

						// stage.addChild(line);
						// stage.update();
					}
					
					//stage.addChild(line);
				}
			}
			line.graphics.endStroke();
			qvalueline.graphics.endStroke();
			stage.addChild(line);
			stage.addChild(qvalueline);
			stage.update();

			// return line_queue;
		}

		var mazeQValueRender = function(mazeGrid, stage, canvaswidth, canvasheight) {
			var gridheight = roundto2(canvasheight/mazeGrid.gridsize);
			var gridwidth = roundto2(canvaswidth/mazeGrid.gridsize2);
			var grid = mazeGrid.grid;

		for (var i in mazeGrid.gridsize) {
			for (var j in mazeGrid.gridsize2) {
				var qvalues = grid[j][i].qvalues;
				//render qvalues
				for (var qval in qvalues) {
					if (qval == "L") {
						var text = new createjs.Text();
					}
				}
			}
		}
	}

		return {"mazeGenerator" : mazeGenerator,
				"mazeRender" : mazeRender}
	});
