define(['./structfactory', './typechecker', './assert', './tile'],
	function(structfactory, typechecker, assert, Tile) {
		var LRUD = new structfactory("L R U D");
		var test_lrud = new LRUD();

		Function.prototype.construct = function(aArgs) {
			var fConstructor = this, fNewConstr = function() { fConstructor.apply(this, aArgs); };
			fNewConstr.prototype = fConstructor.prototype;
			return new fNewConstr();
		};


		var Grid = function(gridsize, gridsize2, gridObj, gridArguments) {
			assert(typechecker.typecomparer(1, gridsize), "Gridsize not a Number");

			if (!typechecker.typecomparer(gridsize, gridsize2))
				var gridsize2 = gridsize;

			this.gridsize = gridsize;
			this.gridsize2 = gridsize2;
			this.gridObj = gridObj;

			//create grid of row-size g1 column-size g2 filled with class Tile
			this.grid = function(g1, g2, self) {
				var grid = [];
				for (var i=0; i<g1; i++) {
					var temp_grid = [];
					for (var j=0; j<g2; j++) {
						//if gridObj is a func, initialize it
						if (typeof gridObj == "function") {
							temp = new self.gridObj();
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