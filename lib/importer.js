exports.importData = function () {
	var fs  = require('fs');
	var http = require('http');
	var filepath = 'data/cleanedDict.json';

	fs.readFile(filepath, {encoding: 'utf8'}, function (err, content) {
		var dict = JSON.parse(content);
		var index = 0;
		(function next() {
			var send = "";
			var firstLine = {index : {_index: "dict", _type: "word"}};
			for (i = 0; i < 100 && index < dict.length; i++, index++) {
				// firstLine.index._id = index;
				var data = dict[index];
				send += JSON.stringify(firstLine) + '\n' + JSON.stringify(data) + '\n';
			}
			
			var post_options = {
				host: 'localhost',
				port: '9200',
				path: '/_bulk',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(send)
				}
			};
			console.log(index + '\n');

			var post_req = http.request(post_options, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					// console.log('Response: ' + chunk);
				});
				res.on('end', function () {
					if (index != dict.length) {
						setImmediate(next);
					}
				});
			});

			post_req.write(send);
			post_req.end();
		})();
	});
}