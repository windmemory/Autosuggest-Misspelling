var term = "birht";


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200'
});

var fuzzyOne = 3;
var fuzzyTwo = 8;
var fuzzyThree = 13;

var fuzziness = 0;
if (term.length > fuzzyOne) {
	if (term.length < fuzzyTwo) {
		fuzziness = 1;
	} else if (term.length < fuzzyThree) {
		fuzziness = 2;
	} else fuzziness = 3;
}

var start = new Date();
client.search({
	index: 'dict',
	type: 'word',
	body: {
		size: 5,
		query: {
			function_score: {
				query: {
					multi_match: {
						query: term,
						fields: ["word", "auto", "override"],
						fuzziness: fuzziness
					}
				},
				field_value_factor: {
					field: "rank"
				}
			}
		},
	}
}).then(function (resp) {
	// console.log(resp.hits.hits);
	console.log("time" + (new Date() - start));
	var resultArray = resp.hits.hits;
	var results = [];
	for (var i = 0; i < resultArray.length; i++) {
		results[i] = resultArray[i]._source.word;
	}
	console.log(results);
	
}, function (err) {
	console.log(err.message);
});

