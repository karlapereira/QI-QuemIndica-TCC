var neo4j = require('neo4j');

// Connect to DataBase
var db = new neo4j.GraphDatabase('http://neo4j:1234@localhost:7474');

function executeQuery(my_query,res){
    db.cypher({
        query: my_query
    }, (err, results)=>{
        if (err) throw err;
        var result = results;
        if (!result) {
            res.send("Error")
        } else {
           res.send(result);
        }
    });
}

module.exports = executeQuery;
