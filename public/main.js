var App = function() {
  this.tinyDom = tinyMCE.activeEditor.dom.getRoot();
  
  this.init = function() {
    $('.bookmark_link').click(function(){
      var hashtag = $(this).text()
      $('#filter_box').val(hashtag)  
      $('#filter_box').trigger("input")  
    })  
    
    $('#container').on('click', '.file_link', function(){
      var filename = $(this).data('filename');
      app.loadNotes(filename);
    })

    $('#container').on('click', '.filter_clear', function(){
      $('#filter_box').val("")
      app.filter()
    })

    $('#container').on('click', '.filter_link', function(){
      var hashtag =  '#'+$(this).data('name')
      $('#filter_box').val(hashtag)  
      $('#filter_box').trigger("input") 
    })

    $(this.tinyDom).on('click', '.hash_link', function(){
      var hashtag =  '#'+$(this).data('name')
      $('#filter_box').val(hashtag)  
      $('#filter_box').trigger("input") 
    })
  }

  this.filter = function() {
    var current_text = $('#filter_box').val()
    $(this.tinyDom).find('li').hide()
    $(this.tinyDom).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      if (li_text.indexOf(current_text) != -1) {
        $(this).show()
        $(this).parents().show()
        $(this).find('li').show()
      } 
    })
  }
  
  this.parseHashtags = function() {
    var initText = $(this.tinyDom).html()
    parsedText = initText.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hash_link" data-name="$1" href="#">#$1</a>')
    $(this.tinyDom).html(parsedText);
    this.extractHashtags();
  }

  this.extractHashtags = function() {
    $('#allTags').html("")
    var tagMap = {}
    $(this.tinyDom).find('.hash_link').each(function(){
      var name = $(this).data('name')
      if (tagMap[name]) {
        tagMap[name] = tagMap[name]+1
      } else {
        tagMap[name] = 1
      }
    })

    $.each(tagMap, function( name, count ) {
      var newLink = $("<a />", {
          'data-name': name,
          href : "#",
          text : '#'+name+"("+count+")",
          class: 'filter_link'
      });

      $('#allTags').append(newLink).append('<br/>')
    });
  } 

  this.saveNotes = function() {
    var notes = $(this.tinyDom).html()
    api.saveNotes(notes)
  }    

  this.loadNotes = function(filename) {
    var filename = filename || 'notes.html'
    var self = this
    api.loadNotes(filename, function(data) {
      $(self.tinyDom).html(data);
    })
  }

  this.getNotesFiles = function() {
    $('#fileFinder ol').html("");
    api.getNotesFiles(function(files){
      files.forEach(file => {
        var li = $('<li/>')
        var newLink = $("<a />", {
            // onclick : "file_link('"+file.name+"')",
            href : "#",
            class: 'file_link',
            'data-filename': file.name,
            text : util.formatDate(file.modifiedDate)
        }).appendTo(li);
        $('#fileFinder ol').append(li)
      })      
    });

  }
};




var Api = function() {
  this.saveNotes = function(notes) {
    $.get('/saveNotes',{notes:notes}, function(data){
      if(data==='ok') {
        console.log("saved success");
      }
    });
  }

  this.loadNotes = function(filename, done) {
    $.get('/loadNotes',{filename:filename},  function(data){
      if(data) {
        done(data)
        console.log("load success");
      }
    });
  }
    
  this.getNotesFiles = function(done) {
    $.get('/getNotesFiles', function(data){
      if(data) {
        done(JSON.parse(data));
        console.log("get notes success");
      }
    });
  }
}


$( document ).ajaxSuccess(function( event, request, settings ) {
  if ( settings.url.startsWith("/loadNotes") ) {
    app.extractHashtags();
  } else if (settings.url.startsWith("/saveNotes") ) { 
    app.getNotesFiles();
  }
});


var Util = function() {
  this.formatDate = function(date) {
    return date.split('.')[0].replace('T', ' ').replace(/-/g,'/')
  }  
}


$( document ).ready(function() {
  tinymce.init({
    selector: '#editor',
    height: '600px',
    statusbar: false,
    menubar:false,
    plugins: [
      'autolink lists link save'
    ],
    save_enablewhendirty: true,
    save_onsavecallback: function () { app.parseHashtags(); app.saveNotes();  },
    toolbar: 'bullist save',
    setup : function(ed){
      ed.on('init', function() {
        this.getDoc().body.style.fontSize = '14px';
        //load the app, api , utils
        app = new App();
        api = new Api();        
        util = new Util();   
        app.init()     
        app.loadNotes();
        app.getNotesFiles();    
      });
    }
  });
  

});
