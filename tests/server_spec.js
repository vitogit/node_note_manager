var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server');
var app = server.app
var db = require('../database/db');

before(function(done) {
  db.cleanTable(function(err) {
    if (err) return console.log(err);
    done();
  });
});
    
//todo: this overwrite the current notes. create different envs for test?
describe('Server', function() {
  it('save the notes GET', function(done) {
    var note = {name: 'notes.html', text:'hello my friend'}
    chai.request(app)
      .get('/saveNote')
      .query(note) 
      .end(function(err, res){
        var savedNote = JSON.parse(res.text)
        expect(res).to.have.status(200);
        expect(savedNote.name).to.eq(note.name);
        expect(savedNote.text).to.eq(note.text);
        done();
      });
  });  

  //todo: this uses the results from the previous tests. better make them independent
  it('load the notes GET', function(done) {
    chai.request(app)
      .get('/loadNote')
      .query({id: 1})
      .end(function(err, res){
        var savedNote = JSON.parse(res.text)
        expect(res).to.have.status(200);
        expect(savedNote.name).to.eq('notes.html');
        done();
      });
  });
  
  it('update the notes GET', function(done) {
    chai.request(app)
      .get('/updateNote')
      .query({id:1, name: 'notes2.html', text:'hello22'}) 
      .end(function(err, res){
        var savedNote = JSON.parse(res.text)
        expect(res).to.have.status(200);
        expect(savedNote.text).to.eq('hello22');
        expect(savedNote.name).to.eq('notes2.html');
        done();
      });
  });  
  

  // 
  // it('get the notes files array', function() {
  //   var files = server.getNotesFiles()
  //   expect(files[0].name).to.eq('notes.html');    
  // }); 
  // 
  // 
  // it('manage backups: create a new backup file', function(done) {
  //   server.saveBackup('notes.html', 'hello', function(){
  //     var files = server.getNotesFiles()
  //     expect(files.length).to.eq(2);   
  //     expect(files[0].name).to.eq('notes.html');
  //     done();
  //   })
  // });   
  // 
  // it('save until max backups', function(done) {
  //   server.maxBackups = 1;
  //   var oldFiles = server.getNotesFiles()
  //   
  //   server.saveBackup('notes.html', 'hello', function(){
  //     var files = server.getNotesFiles()
  //     expect(files.length).to.eq(2);   
  //     expect(files[0].name).to.eq('notes.html');    
  //     expect(files[1].name).to.not.eq(oldFiles[1].name);   
  //     console.log('oldname____'+oldFiles[1].name) 
  //     console.log('onewname____'+files[1].name) 
  //     done();
  //   })
  // }); 
  // 
  // it('clean all notes files', function() {
  //   server.cleanNoteFiles()
  //   var files = server.getNotesFiles()
  //   
  //   expect(files.length).to.eq(0);
  // });
  
  // it('save until 10 backups', function(done) {
  //   for (var i=0 ; i< 12 ; i++) {
  //     chai.request(server)
  //       .get('/saveNotes')
  //       .query({notes: 'hello'}) 
  //       .end(function(err, res){
  //       });
  //   }
  //   chai.request(server)
  //     .get('/getNotesFiles')
  //     .end(function(err, res){
  //       var files = JSON.parse(res.text)
  //       expect(files[0].name).to.eq('notes.html');
  //       expect(files[9].name).to.eq('notes.backup.9.html');
  //       expect(files.size).to.eq(10);
  //       done();
  // 
  //     });
  // });    
});
