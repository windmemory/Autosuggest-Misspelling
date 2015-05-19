var fs = require('fs');

var dictENfilepath = "data/dictionaryEN.tsv";
var overrideENfilepath = "data/overridesEN.tsv";
var dictESfilepath = "data/dictionaryES.tsv";
var overrideESfilepath = "data/overridesES.tsv";
var popularityfilepath = "data/million_search_queries_transformed.csv";
var bigDictEN = new Array();
var bigDictES = new Array();
var finalDict = new Array();
var thredshod = 3;

fs.readFile(dictENfilepath, {encoding: 'utf8'}, function (err, content) {
	var line = content.split('\n');	
	for (var i = 1; i < line.length; i++) {
		var record = line[i].split('    ');
		var num = Math.log(2);
		var data = {word: record[2], auto: record[2], rank: num, override: []};
		if (record[1] != record[2]) data.override.push(record[1]);
		bigDictEN[parseInt(record[0])] = data;
	}
	fs.readFile(overrideENfilepath, {encoding: 'utf8'}, function (err, content) {
		var line = content.split('\n');
		for (var i = 1; i < line.length; i++) {
			var data = line[i].split('    ');
			bigDictEN[parseInt(data[2])].override.push(data[1]);
		}
		fs.readFile(dictESfilepath, {encoding: 'utf8'}, function (err, content) {
			var line = content.split('\n');	
			var num = Math.log(2);
			for (var i = 1; i < line.length; i++) {
				var record = line[i].split('    ');
				var data = {word: record[2], auto: record[2], rank: num, override: []};
				if (record[1] != record[2]) data.override.push(record[1]);
				bigDictES[parseInt(record[0])] = data;
			}
			fs.readFile(overrideESfilepath, {encoding: 'utf8'}, function (err, content) {
				var line = content.split('\n');
				for (var i = 1; i < line.length; i++) {
					var data = line[i].split('    ');
					bigDictES[parseInt(data[2])].override.push(data[1]);
				}
				fs.readFile(popularityfilepath, {encoding: 'utf8'}, function (err, content) {
					var line = content.split('\n');
					finalDict = bigDictES.concat(bigDictEN);
					console.log(finalDict.length);
					var count = 0;
					for (var i = 1; ;i++) {
						if (line[i] == null) continue;
						var data = line[i].split(',');
						var pop = parseInt(data[1]);
						if (pop < thredshod) break;
						var e = data[0];
						for (var k = 0; k < finalDict.length; k++) {
							if (finalDict[k] == null) continue;
							if (finalDict[k].word === e) {
								finalDict[k].rank = Math.log(pop);
								count++;
								break;
							}
						}
						// if (i % 1000 === 0) console.log(i / 1800000);

					}
					// console.log(count);

				});
			});
		});
	});
});





