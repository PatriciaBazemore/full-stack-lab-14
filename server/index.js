// * Statically serve all files located in the `client` directory
//     * Use the Express body parser instead of manually collecting the incoming chirp on the POST request
//     * Use Express route handlers to set up your API server
//         * Take action depending on GET/POST
//     * Only set content type and response codes when Express cannot infer or incorrectly infers

// * Finish the front-end
//     * Use JQuery's $.ajax function (in lecture on JSON & REST) to communicate with a server
//     * If you'd like, you can use Bootstrap to style your project
//     * Otherwise, style your project with your own CSS file

var path = require("path");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser"); //middleware 
var app = express();
var clientPath = path.join(__dirname, '../client');
var dataPath = path.join(__dirname, 'data.json');

app.use(express.static(clientPath));

app.use(bodyParser.json());  //use a body parser for parsing jsons 

app.get('/', function(res, req){

})

// app.route('/api/chirps') 
//     .get(function(req,res){
//         res.sendFile(path.join(__dirname, 'data.json')); //var dataPath
//     }).post(function(req, res){
//         fs.readFile(path.join(__dirname, 'data.json'), 'utf8', function(err, fileContents) { //utf8 isn't binary, will be a string
//             if (err) {
//                 console.log(err);
//                 res.sendStatus(500);  
//             } else {
//                 var chirps = JSON.parse(fileContents); //creates object
//                 chirps.push(req.body); //req.body is the "incoming chirp" pulled in by body parser
//                 fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(chirps), function(err){   //turn back into json string and write back to file system
//                     if (err) {
//                         res.sendStatus(500);
//                     } else {
//                         res.sendStatus(201);
//                     }
//                 });
//             }
//         });
//     });

//rewritten with functions we created 
app.route('/api/chirps') 
    .get(function(req,res){
        res.sendFile(dataPath); //var dataPath
    }).post(function(req, res){
        var newChirp = req.body;
        readFile(dataPath, 'utf8')
        .then(function(fileContents){   //always do return when chaining promises to make the next .then wait on this step
            var chirps = JSON.parse(fileContents);
            chirps.push(newChirp);
            return writeFile(dataPath, JSON.stringify(chirps)); //need return to make the other code to wait on writing the file
        }).then(function(){ //don't need a parameter with writeFile
            res.sendStatus(201);
        }).catch(function(err){
            console.log(err);
            res.sendStatus(500);
        });
    });

app.listen(3000);

function readFile(filePath, encoding) {  //returns a promise, uses the fs.readFile process
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, encoding, function(err, data) {   //for any filePath utf8 or other
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })    
    });
}

function writeFile(filePath, data) {
    return new Promise(function(resolve, reject){
        fs.writeFile(filePath, data, function(err){
            if (err) {
                reject(err);
            } else {
                resolve(); //would be stuck if we didn't resolve or reject
            }
        });
    });
}


// app.use(bodyParser.json()); app.post('/api/chirps', function(req, res) {
//     // req.body is already a JS object of the submitted chirp
//     // req.body.message
//     // req.body.user
//     // req.body.timestamp
// });

// fs.readFile(path.join(__dirname, 'data.json'), 'utf8', function(err, fileContents) {
//                         if (err) {
//                             console.log(err);
//                             res.writeHead(500, { 'Content-Type': 'text/plain'});
//                             res.end('Internal Server Error');  
//                         } else {
//                             var chirpsJsonArray = JSON.parse(fileContents); //turn from json into array
//                             var incomingData = ''; //variable to collect new data in
//                             req.on('data', function(chunk){
//                                 incomingData += chunk;
//                             });
//                             req.on('end', function() {
//                                 var newJsonChirp = JSON.parse(incomingData); //creates object
//                                 chirpsJsonArray.push(newJsonChirp); //puts newJsonchirp into array
//                                 fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(chirpsJsonArray), function(err){   //turn back into json string and write back to file system
//                                     if (err) {
//                                         console.log(err);
//                                         res.writeHead(500, { 'Content-Type': 'text/plain'});
//                                         res.end('Internal Server Error');  
//                                     } else {
//                                         res.writeHead(201);
//                                         res.end();  
//                                     }
//                                 }); 
//                             });
//                         }