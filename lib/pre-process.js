
exports.read = function () {
	var fs = require('fs');
	var dictENfilepath = "data/dictionaryEN.tsv";
	var overrideENfilepath = "data/overridesEN.tsv";
	var dictESfilepath = "data/dictionaryES.tsv";
	var overrideESfilepath = "data/overridesES.tsv";
	var popularityfilepath = "data/million_search_queries_transformed.csv";
	var tempFile = "tmp/finalDict";
	var tempFinalFile = "tmp/finalDictWithPopularity"
	var bigDictEN = new Array();
	var bigDictES = new Array();
	var finalDict = new Array();
	var thredshod = 3;

	fs.readFile(dictENfilepath, {encoding: 'utf8'}, function (err, content) {
		var line = content.split('\n');	
		for (var i = 1; i < line.length; i++) {
			if (line[i] == "") continue;
			var record = line[i].split('    ');
			var num = Math.log(2);
			var word = record[2];
			var override = record[1];
			if (word[0] === '"') word = word.substr(1, word.length - 2);
			if (override[0] === '"') override = override.substr(1, override.length - 2);
			var data = {word: word, auto: word, rank: num, override: ""};
			if (word != override) data.override += override;
			bigDictEN[parseInt(record[0])] = data;
		}
		fs.readFile(overrideENfilepath, {encoding: 'utf8'}, function (err, content) {
			var line = content.split('\n');
			for (var i = 1; i < line.length; i++) {
				if (line[i] == "") continue;
				var data = line[i].split('    ');
				var word = data[1];
				if (word[0] === '"') word = word.substr(1, word.length - 2);
				if (bigDictEN[parseInt(data[2])].override != "")
					bigDictEN[parseInt(data[2])].override += ' ';
				bigDictEN[parseInt(data[2])].override += word;

			}
			fs.readFile(dictESfilepath, {encoding: 'utf8'}, function (err, content) {
				var line = content.split('\n');	
				var num = Math.log(2);
				for (var i = 1; i < line.length; i++) {
					if (line[i] == "") continue;
					var record = line[i].split('    ');
					var word = record[2];
					var override = record[1];
					if (word[0] === '"') word = word.substr(1, word.length - 2);
					if (override[0] === '"') override = override.substr(1, override.length - 2);
					var data = {word: word, auto: word, rank: num, override: ""};
					if (word != override) data.override += override;
					bigDictES[parseInt(record[0])] = data;
				}
				fs.readFile(overrideESfilepath, {encoding: 'utf8'}, function (err, content) {
					var line = content.split('\n');
					for (var i = 1; i < line.length; i++) {
						if (line[i] == "") continue;
						var data = line[i].split('    ');
						var word = data[1];
						if (word[0] === '"') word = word.substr(1, word.length - 2);
						if (bigDictES[parseInt(data[2])].override == "")
							bigDictES[parseInt(data[2])].override += ' ';
						bigDictES[parseInt(data[2])].override += word;
					}
					fs.readFile(popularityfilepath, {encoding: 'utf8'}, function (err, content) {
						var line = content.split('\n');
						finalDict = bigDictES.concat(bigDictEN);
						// fs.writeFile(tempFile, JSON.stringify(finalDict), function (err) {if (err) console.log(err);});
						var count = 0;
						for (var i = 1; i < line.length ;i++) {
							if (line[i] == null || line[i] == "") continue;
							var data = line[i].split(',');
							var pop = parseInt(data[1]);
							if (pop < thredshod) continue;
							var e = data[0];
							for (var k = 0; k < finalDict.length; k++) {
								if (finalDict[k] == null) continue;
								if (finalDict[k].word === e) {
									finalDict[k].rank = Math.log(pop);
									count++;
									break;
								}
							}
							if (i % 1000 === 0) console.log(i / 1800000);
						}
						fs.writeFile(tempFinalFile, JSON.stringify(finalDict), function (err) {if (err) console.log(err);})
						
					});
				});
			});
		});
	});

	

}

