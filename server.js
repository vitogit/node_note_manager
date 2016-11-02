var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/saveNotes',function(req,res){
  var notes = req.query.notes
  saveToFile('savedNotes/notes.html',notes)
  //todo send error
  res.end("ok");
});

app.get('/loadNotes',function(req,res){
  var data = loadFromFile('savedNotes/notes.html')
  //todo send error
  res.end(data);  
});

app.listen(process.env.PORT || 5000);

function saveToFile(filename, content) {
  fs.writeFile(filename, content, function(err) {
    if(err) {
      return console.log(err);
      throw err;
    }
    console.log("The file was saved!");
  });   
}

function loadFromFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}
