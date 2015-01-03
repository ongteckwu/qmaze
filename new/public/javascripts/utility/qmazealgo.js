define(['./typechecker', './assert', './shuffle', './mazegrids', './tile', './create'],
	function(typechecker, assert, shuffle, grids, Tile, create) {
		var mazeGenerator = function(gridsize, gridsize2, endPoint, rewardGrid) {
			//reward grid must have the same size
			// assert((gridsize == rewardGrid.gridsize && 
			// 			gridsize2 == rewardGrid.gridsize2), "Grid Sizes have to be the same!!!");
			assert(((endPoint[0] >= 0 && endPoint[0] < gridsize) && (endPoint[1] >= 0 && endPoint[1] < gridsize2),
					"Endpoint coordinates not in grid"));

			//generates a complete maze grid
			var mazeGrid = new grids.Grid(gridsize, gridsize2, Tile);
			//initial cell at 0,0
			//stack & visited list
			var stack = [];
			var visited = [];
			var p = [0,0];
			var endPoint = endPoint;

			stack.push(p);
			while (visited.length < gridsize*gridsize2)  {
				//choose the last tile from stack
				p = stack[stack.length - 1];
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
					if (px[0] == endPoint[0] && px[1] == endPoint[1]) {
						if ((stack.length + visited.length) < (gridsize*gridsize2 - 1))
							return;
						else {
							pre_stack.push(px);
							return;
						}
					}
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
					p_tile_walls = mazeGrid.grid[p[0]][p[1]].walls;
					np_tile_walls = mazeGrid.grid[neighbor_p[0]][neighbor_p[1]].walls;
					if (p[0] != neighbor_p[0]) {
						//neighbor at up
						if (p[0] - neighbor_p[0] == -1) {
							p_tile_walls.D = 0;
							np_tile_walls.U = 0;
						}
						//neighbor at down
						else {
							p_tile_walls.U = 0;
							np_tile_walls.D = 0;
						}
					}
					else {
						//neighbor at left
						if (p[1] - neighbor_p[1] == -1) {
							p_tile_walls.R = 0;
							np_tile_walls.L = 0;
						}
						else {
							p_tile_walls.L = 0;
							np_tile_walls.R = 0;
						}
					}
				}
			}

			return mazeGrid;
		}

		var mazeRender = function(mazeGrid, stage, canvaswidth, canvasheight) {
			var gridheight = Math.floor(canvasheight/mazeGrid.gridsize);
			var gridwidth = Math.floor(canvaswidth/mazeGrid.gridsize2);

			// var line_queue = [];
			var line = new createjs.Shape();
			line.graphics.setStrokeStyle(3)
						 .beginStroke('#222222');
			for (var i=0; i<mazeGrid.gridsize; i++) {
				for (var j=0; j<mazeGrid.gridsize2; j++) {
					var current_grid = mazeGrid.grid[i][j];
					// render q-values	
					// render walls
					for (var wall in current_grid.walls) {
						// if property exists and if wall should be existent
						if (current_grid.walls.hasOwnProperty(wall) && current_grid.walls[wall]) {

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
			stage.addChild(line);
			stage.update();

			// return line_queue;
		}

		return {"mazeGenerator" : mazeGenerator,
				"mazeRender" : mazeRender}
	});
