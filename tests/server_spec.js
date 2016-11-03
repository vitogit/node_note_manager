var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server');

//todo: this overwrite the current notes. create different envs for test?
describe('Server', function() {
  it('save the notes GET', function(done) {
    chai.request(server)
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
    chai.request(server)
      .get('/loadNotes')
      .end(function(err, res){
        expect(res).to.have.status(200);
        expect(res.text).to.eq('hello');
        done();
      });
  });
});
