define(['./structfactory', './typechecker', './assert', './tile'],
	function(structfactory, typechecker, assert, Tile) {
		var LRUD = new structfactory("L R U D");
		var test_lrud = new LRUD();

		function applyToConstructor(constructor, argArray) {
    		var args = [null].concat(argArray);
    		var factoryFunction = constructor.bind.apply(constructor, args);
    		return new factoryFunction();
		}

		var Grid = function(gridsize, gridsize2, gridObj) {
			assert(typechecker.typecomparer(1, gridsize), "Gridsize not a Number");

			if (!typechecker.typecomparer(gridsize, gridsize2))
				var gridsize2 = gridsize;

			this.gridsize = gridsize;
			this.gridsize2 = gridsize2;
			this.gridObj = gridObj;
			this.startPoint = undefined;
			this.endPoint = undefined; // first end point
			this.endPoints = undefined;

			//create grid of row-size g1 column-size g2 filled with class Tile
			this.grid = function(g1, g2, self) {
				var grid = [];
				for (var i=0; i<g1; i++) {
					var temp_grid = [];
					for (var j=0; j<g2; j++) {
						//if gridObj is a func, initialize it
						if (typeof gridObj == "function") {
							// temp for Tile
							temp = new gridObj(0, undefined, undefined, i, j);
							temp_grid.push(temp); //TODO

						}
						//if not, do not
						else
							temp_grid.push(self.gridObj);
					}
					grid.push(temp_grid);
				}
				return grid;
			}(gridsize, gridsize2, this);

		}

		Grid.prototype.isEndPoint = function(x, y) {
			var endPoints = this.endPoints;
			for (var i in endPoints) {
				if (endPoints[i][0] == x && endPoints[i][1] == y) {
					return true
				}
			}
			return false;
		}

		// var mazeGrid = function(gridsize, gridsize2) {
		// 	MazeGrid.prototype = new Grid(gridsize, gridsize2, Tile);
		// 	console.log(this.gridsize);

		// }

		// MazeGrid.prototype.updateTileQvalue = function(row, col, qvalues) {
		// 	//TODO: need to put boundary conditions
		// 	//throw error if qvalues is not an LRUD obj
		// 	assert(typechecker.typecomparer(test_lrud, qvalues), "LRUD not passed");
		// 	//update q-values
		// 	this.grid[row][col].qvalues = this.grid[row][col].qvalues.add(qvalues);
		// }

		// MazeGrid.prototype.updateTileWalls = function(row, col, walls) {
		// 	//TODO: need to put boundary conditions
		// 	//throw error if walls is not an LRUD obj
		// 	assert(typechecker.typecomparer(test_lrud, walls), "LRUD not passed");
		// 	//update walls
		// 	this.grid[row][col].walls = walls;
		// }

		// var RewardGrid = function(gridsize, gridsize2, reward) {
		// 	this.prototype = new Grid(gridsize, gridsize2, reward);
		// }

		// RewardGrid.prototype.updateReward(row, col, reward) {
		// 	//TODO: need to put boundary conditions
		// 	this.grid[row][col] = reward;
		// }

		return {"Grid": Grid};
	});