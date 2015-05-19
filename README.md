# Autosuggest-Misspelling
####Step 1
Run Elasticsearch

####Step 2
Put the script inside file script/create in the terminal and set up the index of Elasticsearch

####Step 3
Process the data, you can run the code use main.js
Unless you want to update the raw data, otherwise you just need to run the `node main.js 3`
```
//Aggregate data from dictionary, overrides and popularities into tmp/finalDictWithPopularity
node main.js 1 
//Clean finalDictWithPopularity: delete empty rows, use log to scale down the popularity of the records
node main.js 2  
//Import data into elasticsearch
node main.js 3
```

####Step 4
Do the query with `test.js`
You can change the `term` variable inside the code and have the results back
