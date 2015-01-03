define(['./structfactory', './typechecker', './assert'], 
	function(structfactory, typechecker, assert) {
		var LRUD = new structfactory("L R U D");
		var test_lrud = new LRUD();

		var Tile = function(reward, qvalues, walls) {
			//default reward
			this.reward = (typeof reward == "undefined") ? 0 : reward;
			//default qvalues
			if (typeof qvalues == "undefined") {
				this.qvalues = new LRUD(0, 0, 0, 0);
			}
			else {
				assert(typechecker.typecomparer(this.qvalues, {}), "Qvalues not an Object.");
				this.qvalues = qvalues;
			}
			//default walls
			//1 for wall, 0 for nothing
			if (typeof walls == "undefined") {
				this.walls = new LRUD(1, 1, 1, 1);
			}
			else {
				assert(typechecker.typecomparer(this.walls, {}), "Walls not an Object.");
				this.walls = walls;
			}

		}

		return Tile;
	});