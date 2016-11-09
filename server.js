var express = require('express');
var app = express();
var fs = require('fs');
var config = require('./config');
var db = require('./database/db');

app.use(express.static(__dirname + '/public'));

app.get('/saveNote',function(req,res){
  var note = {name:req.query.name, text:req.query.text}
  db.saveNote(note, function(err, data) {
    if (err) return console.log(err);
    res.end(JSON.stringify(data));
  });
});

app.get('/updateNote',function(req,res){
  var note = {id:req.query.id, name:req.query.name, text:req.query.text}
  db.updateNote(note, function(err, data) {
    if (err) {
      console.log("ERROR________")
      console.log(err);
      res.end(JSON.stringify(err));
    } 
    res.end(JSON.stringify(data));    
  });
});

app.get('/upsertNote',function(req,res){
  var note = {id:req.query.id, name:req.query.name, text:req.query.text}
  db.upsertNote(note, function(err, data) {
    console.log('data___'+JSON.stringify(data))
    if (err) return console.log(err);
    res.end(JSON.stringify(data));    
  });
});

app.get('/loadNote',function(req, res){
  var note = {id:req.query.id}
  db.loadNote(note, function(err, data) {
    if (err) return console.log(err);
    res.end(JSON.stringify(data));
  });
});

app.get('/getNotesFiles',function(req,res){
  var data = getNotesFiles();
  //todo send error
  res.end(JSON.stringify(data));  
});

app.listen(config.PORT);

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
