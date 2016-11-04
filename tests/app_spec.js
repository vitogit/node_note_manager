var expect = require('chai').expect;
var fs = require('fs');
var App = require('../public/app.js');
var jsdom = require('jsdom').jsdom;

var document = jsdom(fs.readFileSync("public/index.html", "utf-8"), {});
var window = document.defaultView;
var $ = require('jquery')(window);
 
describe('App', function() {
  
  beforeEach(function() {
    global.tinymce = {activeEditor: {dom: {getRoot: function (){return '<body id="tinymce" class="mce-content-body " data-id="editor" contenteditable="true" spellcheck="false" style="font-size: 14px;"></body>' } }}}
    global.$ = $
  });
    
  it('exists', function() {
    expect(app).to.exist;  
  }); 
  
  it('filters the text', function() {

  }); 
    
  it('parse the hashtags', function() {
    app.content = "Hello #hashtag. Bye bye."
    app.parseHashtags()
    expect(app.content).to.eq('Hello <a class="hashLink" onclick="parent.filter_link(\'hashtag\')" href="#">#hashtag</a>. Bye bye.');
  }); 
      
  it('extract the hashtags', function() {
    app.content = "Hello #hashtag. Bye #hashtag . Hello #sip" 
    app.extractHashtags()
    expect(app.section_all_tags).to.eq('');

  });  

});
