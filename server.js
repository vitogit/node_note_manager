var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

//todo probably this needs to be a post
app.get('/saveNotes',function(req,res){
  var notes = req.query.notes
  saveToFile(notesFolder+'notes.html',notes, function(){
    saveBackup(notesFolder+'notes.html',notes, function(){})
  })
  //todo send error
  res.end("ok");
});

app.get('/loadNotes',function(req,res){
  var filename = req.query.filename || 'notes.html'
  console.log("filename________"+filename)
  var data = loadFromFile(notesFolder+filename)
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
var maxBackups = 10;
//PRIVATE 
function saveToFile(filename, content, done) {
  fs.writeFile(filename, content, function(err) {
    if(err) {
      return console.log(err);
      throw err;
    }
    console.log("The file was saved!");
    done();
  });   
}

function saveBackup(filename, content, done) {
  var files = getNotesFiles()
  var backupCount = files.length -1;
  var newFilename = filename+'.backup.'+Date.now()
  
  if (backupCount>=maxBackups){
    var olderFile = files[1].name
    fs.unlinkSync(notesFolder+olderFile);
  }
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


module.exports = {app, getNotesFiles, saveToFile, loadFromFile,saveBackup,cleanNoteFiles,maxBackups}
