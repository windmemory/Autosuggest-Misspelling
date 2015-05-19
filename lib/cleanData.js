/*--------------------------------------------------------------------------------
This file is used to post process the data from pre-process.js code. 
This code also re-assign the rank value to some records that lost the rank values
Then the code output the final dictionary as a json file
---------------------------------------------------------------------------------*/
exports.clean = function () {
	var fs = require('fs');
	var filePath = "tmp/finalDictWithPopularity";
	var popFilePath = "data/million_search_queries_transformed.csv";
	var cleanedDict = "data/cleanedDict.json"

	fs.readFile(filePath, {encoding: 'utf-8'}, function (err, content) {
		var dict = JSON.parse(content);
		var count = 0;
		for (var i = 0; i < dict.length; i++) {
			if (dict[i] == null) {
				dict.splice(i, 1);
				i--;
				continue;
			}
		}
		fs.readFile(popFilePath, {encoding: 'utf-8'}, function (err, content) {
			var popArray = content.split('\n');
			for (var i = 0; i < dict.length; i++) {
				if (dict[i].rank == null) {
					for (var j = 0; j < popArray.length; j++) {
						if (popArray[j] == null) continue;
						var line = popArray[j].split(',');
						if (line[0] === dict[i].word) {
							var pop = parseInt(line[line.length - 1]);
							dict[i].rank = Math.log(pop);
							break;
						}
					}

				}
			}
			for (var i = 0; i < dict.length; i++) {
				for (var j = i + 1; j < dict.length; j++) {
					if (dict[i].word === dict[j].word) {
						dict.splice(j, 1);
						j--;
						count++;
					}
				}
			}
			//149042 items in the dict
			fs.writeFile(cleanedDict, JSON.stringify(dict), function (err) {if (err) console.log(err);})
		});
	});
}