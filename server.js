var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

//todo probably this needs to be a post
app.get('/saveNotes',function(req,res){
  var notes = req.query.notes
  saveToFile(notesFolder+'notes.html',notes, function(){})
  //todo send error
  res.end("ok");
});

app.get('/loadNotes',function(req,res){
  var data = loadFromFile(notesFolder+'notes.html')
  //todo send error
  res.end(data);  
});

app.get('/getNotesFiles',function(req,res){
  var data = getNotesFiles();
  //todo send error
  res.end(JSON.stringify(data));  
});

app.listen(process.env.PORT || 5000);

var notesFolder = 'savedNotes/';

//PRIVATE 
function saveToFile(filename, content, done) {
  fs.writeFile(filename, content, function(err) {
    if(err) {
      return console.log(err);
      throw err;
    }
    done();
    console.log("The file was saved!");
  });   
}

function saveBackup(filename, content, done) {
  console.log(done)
  var files = getNotesFiles()
  var backupCount = files.length -1;
  var number = backupCount+1;
  var newFilename = notesFolder+filename+'.backup.'+number
  saveToFile(newFilename, content, done)
}

function loadFromFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

function getNotesFiles() {
  var notesFiles = [];
  var files = fs.readdirSync(notesFolder);  
  files.forEach(file => {
    var stats = fs.statSync(notesFolder+file);
    var size = stats["size"];
    var modifiedDate = stats["mtime"];
    notesFiles.push({name:file, size:size, modifiedDate:modifiedDate});
  });
  return notesFiles;
}

function cleanNoteFiles() {
  var notesFiles = [];
  var files = fs.readdirSync(notesFolder);  
  files.forEach(file => {
    fs.unlinkSync(notesFolder+file);
  });
}


module.exports = {app, getNotesFiles, saveToFile, loadFromFile,saveBackup,cleanNoteFiles}
