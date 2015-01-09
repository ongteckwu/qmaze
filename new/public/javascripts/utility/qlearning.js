define(['./shuffle', './create', './roundto2'],
	function(shuffle, create, roundto2) {
		// agent
		function QAgent(startPoint, grid, stage, gridsize, gridsize2, canvaswidth, canvasheight, endPoints) {
			this.startPoint = startPoint;
			this.x = startPoint[0];
			this.y = startPoint[1];
			this.endPoints = endPoints;
			// reference to grid to know positions of walls
			this.grid = grid;
			// increment the visited value of the start point by 1
			this.grid.grid[this.y][this.x].visited++;
			this.stage = stage;
			this.gridsize = gridsize;
			this.gridsize2 = gridsize2;

			this.radius1 = roundto2(canvasheight/gridsize);
			this.radius2 = roundto2(canvaswidth/gridsize2);
			//create shape object
			this.shapex = new createjs.Shape();

			this.shapex.graphics.beginFill("red")
								.drawEllipse(this.x * gridsize2, this.y * gridsize2, this.radius2, this.radius1);
			this.render_queue = [];
			this.stage.addChild(this.shapex);
			this.stage.update();
		}

		QAgent.prototype.isIllegalAction = function(action) {
			// ensure action is legal
			var walls = this.grid.grid[this.y][this.x].walls;
			// if there is a wall, return true
			return walls[action] == 1;
		}

		QAgent.prototype.move = function(action) {
			if (this.isIllegalAction(action)) {
				throw "ILLEGAL ACTION BRO!";
			}
			var next_coords = this.nextTile(action);
			this.x = next_coords[0];
			this.y = next_coords[1];
		}

		QAgent.prototype.nextTile = function(action) {
		//	console.log("beforenexttile", this.x, this.y, action);
			if (this.isIllegalAction(action)) {
				throw "ILLEGAL ACTION BRO!";
			}
			if (action == "L") {
				return [this.x-1, this.y];
			}
			else if (action == "R") {
				return [this.x+1, this.y];
			}
			else if (action == "U") {
				return [this.x, this.y-1];
			}
			else if (action == "D") {
				return [this.x, this.y+1];
			}
		}
		QAgent.prototype.restart = function() {
			//restart agent's position
			this.x = this.startPoint[0];
			this.y = this.startPoint[1];
		}

		QAgent.prototype.render = function() {
			//renders agent
			// this.stage.removeChild(this.shapex);
			//shift coordinates from render_queue
			var coords = this.render_queue.shift();
			// console.log(this.render_queue.length);
			// console.log(coords[0], coords[1], this.endPoint[0], this.endPoint[1])
			//change coords
			this.shapex.x = coords[0] * this.radius2;
			this.shapex.y = coords[1] * this.radius1;
			// this.stage.addChild(this.shapex);
			this.stage.update();

		}

		var QLearning = function(agent, grid, alpha, k_random, e) {
			this.grid = grid;
			this.agent = agent;
			this.alpha = alpha;
			this.k = k_random;
			this.e = e;
			createjs.EventDispatcher.initialize(this);
		}

		QLearning.prototype.policyExtraction = function() {
			var x = this.agent.x;
			var y = this.agent.y;
			var tile = this.grid.grid[y][x];
			var qvalues = tile.qvalues;

			var max_qvalue = [null, -10000];
			var random_value = Math.random();
			var output = undefined;
			if (random_value < this.e) {
				//get a random direction
				var shuffled_dirs = shuffle(Object.keys(qvalues)); 
				for (var i in shuffled_dirs) {
					var dir = shuffled_dirs[i];
					if (!this.agent.isIllegalAction(dir)) {
						output = dir;
						break;
					}
				}
			}
			else {
				//get max value
				var max_val = -10000;
				for (var dir in qvalues) {
					if (!this.agent.isIllegalAction(dir)) {
						var coords = this.agent.nextTile(dir);
						explorified_val = this.explorationF(qvalues[dir], this.grid.grid[coords[1]][coords[0]].visited);
						if (max_val <= explorified_val) {
							max_val = explorified_val;
						}
					}
				}

				//get dir
				var shuffled_dirs = shuffle(Object.keys(qvalues)); 
				for (var i in shuffled_dirs) {
					var dir = shuffled_dirs[i];
						if (!this.agent.isIllegalAction(dir)) {
						var coords = this.agent.nextTile(dir);
						if (this.explorationF(qvalues[dir], this.grid.grid[coords[1]][coords[0]].visited) == max_val) {
							output = dir;
							break;
						}
					}	
				}
				// console.log(temp_array2);
			}
			return output;
		}

		QLearning.prototype.getMaxQsa = function(tile) {
			var max_qvalue = -10000; //arbitary value
			var qvalues = tile.qvalues;


			for (var dir in qvalues) {
				var qvalue_k = this.explorationF(qvalues[dir], tile.visited);
				if (max_qvalue < qvalue_k) {
					max_qvalue = qvalue_k;
				}
			}

			return max_qvalue //[dir, max_qvalue];

		}
		QLearning.prototype.explorationF = function(val, times) {
			return val + (this.k/(times + 1));
		}
		QLearning.prototype.qlearn = function(action) {
			//get action
			var action_to_take = action;
			var next_tile_coords = this.agent.nextTile(action_to_take);
			var qvalue = this.grid.grid[this.agent.y][this.agent.x].qvalues;
			var next_tile = this.grid.grid[next_tile_coords[1]][next_tile_coords[0]];
			
			max_qvalue = this.getMaxQsa(next_tile);

			qvalue[action_to_take] = ((1-this.alpha)*qvalue[action_to_take] + 
											this.alpha*(next_tile.reward + max_qvalue));
			next_tile.visited++; //visited once again
			//update qvalue of current tile
		}


		QLearning.prototype.run = function() {
			//runs the q-learning algorithm
			var n = 0;
			while(n <= 50000) {
				n++;
				action_to_take = this.policyExtraction();
				//qlearn
				this.qlearn(action_to_take);
				//move agent to next tile
				this.agent.move(action_to_take);
				//updates render queue
				if (greaterThanI(n)) {
					var qvalues = this.grid.grid[this.agent.x][this.agent.y].qvalues;
					var agent_coords = [this.agent.x, this.agent.y, action_to_take];
					this.agent.render_queue.push(agent_coords);
				}
				// update q_learning render
				// this.dispatchEvent("updateAgent");
				//moves agent back if agent is at the end tile
				if (this.grid.isEndPoint(this.agent.x, this.agent.y)) {
					this.agent.restart();
					var agent_coords = [this.agent.x, this.agent.y];
					if (greaterThanI(n)) {
						this.agent.render_queue.push(agent_coords);
					}
				}
			}
		}

		var greaterThanI = function(n) {
			//change i here
			i = 49000;
			return n >= i;
		}


	return {"QLearning": QLearning,
			"QAgent": QAgent}
	});