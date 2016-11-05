var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server');
var app = server.app

before(function() {
  server.cleanNoteFiles();
});
    
//todo: this overwrite the current notes. create different envs for test?
describe('Server', function() {
  it('save the notes GET', function(done) {
    chai.request(app)
      .get('/saveNotes')
      .query({notes: 'hello'}) 
      .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.text).to.eq('ok');
        done();
      });
  });  
  
  //todo: this uses the results from the previous tests. better make them independent
  it('load the notes GET', function(done) {
    chai.request(app)
      .get('/loadNotes')
      .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.text).to.eq('hello');
        done();
      });
  });
  
  it('get the notes files array', function() {
    var files = server.getNotesFiles()
    expect(files[0].name).to.eq('notes.html');    
  }); 
  
  
  it('manage backups: create a new backup file', function(done) {
    server.saveBackup('notes.html', 'hello', function(){
      var files = server.getNotesFiles()
      expect(files.length).to.eq(2);   
      expect(files[0].name).to.eq('notes.html');    
      expect(files[1].name).to.eq('notes.html.backup.1');      
      done();
    })
  });   

  it('clean all notes files', function() {
    server.cleanNoteFiles()
    var files = server.getNotesFiles()
    
    expect(files.length).to.eq(0);
  });     
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
