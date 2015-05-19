var preProcess = require('./lib/pre-process');
var clean = require('./lib/cleanData.js');
var importer = require('./lib/importer.js');

if (process.argv[2] === '1') {
	preProcess.read();
} else if (process.argv[2] === '2') {
	clean.clean();
} else if (process.argv[2] === '3') {
	importer.importData();
}



