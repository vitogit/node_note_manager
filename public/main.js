var App = function() {
  this.tinyDom;
  
  this.init = function() {
    console.log('loading init app')

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

    $('#container').on('click', '#auth_link', function(event){
      console.log('trying to login')
      gapi.auth.authorize(
        {client_id: api.CLIENT_ID, scope: api.SCOPES, immediate: false},
        app.handleAuthResult);
      return false;
    })
    
    if (api.authorized) {
      $('#auth').html('logged')  
    } else {
      $('#auth').html('<a href="#" id="auth_link">Log in</a>');  
    }

    tinymce.init({
      selector: '#editor',
      height: '600px',
      statusbar: false,
      menubar:false,
      content_css : 'simplex.bootstrap.min.css, style.css',    
      plugins: [
        'autolink lists link save'
      ],
      save_enablewhendirty: true,
      save_onsavecallback: function () { /*app.parseHashtags(); app.applyStyles(); app.saveNotes();*/ },
      toolbar: 'bullist save removeformat',
      setup : function(ed){
        ed.on('init', function() {
          console.log('loading init tinymce')
          this.getDoc().body.style.fontSize = '14px';
          app.tinyDom = tinyMCE.activeEditor.dom.getRoot();
          //app.loadNotes();
          //app.listNotes();    
        });
      }
    });            
  }

  this.handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
      $('#auth').html('logged') 
    } else {
      $('#auth').html('<a href="#" id="auth_link">Log in</a>');  
    }
  }
  
  this.filter = function() {
    var current_text = $('#filter_box').val()
    var hashtags = current_text.replace(/  +/g, ' ').split(' ')
    hashtags = hashtags.filter(function(h){ return h != "" }); 
    $(this.tinyDom).find('li').hide()
    $(this.tinyDom).find('li').each(function() {
      var li_text = $(this).clone().children('ul').remove().end().html();
      //filter using OR
      if (new RegExp(hashtags.join("|")).test(li_text)) {
        $(this).show()
        $(this).parents().show()
        $(this).find('li').show()
      } 
    })
  }

  this.parseHashtags = function() {
    var initText = $(this.tinyDom).html()
    var parsedText = initText.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hash_link" data-name="$1" href="#">#$1</a>')
    parsedText = this.parseSmartTags(parsedText);
    $(this.tinyDom).html(parsedText);
    this.extractHashtags();
    console.log('parsedhashtags')
  }
  
  this.parseSmartTags = function(initText) {
    return initText.replace(/\$(\w+)\b(?!<\/a>)/g, function (match, smartTag) {
      var newLink = $("<a />", {
          href : "#",
          class : 'smartTag',
          'data-name': smartTag,
          text : '$'+smartTag
      })
      
      if (smartTag == 'todo') {
        newLink.addClass('todo bg-warning')
          console.log('todo tag')
      } else if (smartTag == 'completed') { 
        newLink.addClass('completed bg-success')
        console.log('journal tag')
      } else if (smartTag == 'journal') { 
        newLink.addClass('journal bg-info')
        console.log('journal tag')        
      } else {
        
      }
      return newLink.prop('outerHTML');      
    });
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
    console.log('savednotes')
  }

  this.loadNotes = function(filename) {
    var filename = filename || 'notes.html'
    var self = this
    api.loadNotes(filename, function(data) {
      $(self.tinyDom).html(data);
    })
  }

  this.listNotes = function() {
    $('#fileFinder ol').html("");
    api.listNotes(function(files){
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
  
  this.applyStyles = function() {
    console.log('applyStyles???')
    $(this.tinyDom).find('a.smartTag').each(function() {      
      var classes = $(this).prop('class')
      $(this).parent().addClass(classes);
    })    
  }
};

var Api = function() {
  this.CLIENT_ID = '';
  this.SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
  this.authorized = false;
  
  this.init= function() {
    var self = this;
    $.get('/getClientId',function(response){
      if(response) {
        self.CLIENT_ID = response;
        self.checkAuth();
      }
    });
  }

  this.checkAuth = function(e) {
    var self= this;
    var useImmdiate = event ? false : true;
    gapi.auth.authorize(
      {
        'client_id': self.CLIENT_ID,
        'scope': self.SCOPES.join(' '),
        'immediate': true
      }, self.handleAuthResult);
  }

  this.handleAuthResult = function(authResult) {
    console.log('check auth handle')
    
    console.log('handle auth')
    if (authResult && !authResult.error) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
  }

  this.saveNotes = function(notes) {
    // $.get('/saveNotes',{notes:notes}, function(data){
    //   if(data==='ok') {
    //     console.log("saved success");
    //   }
    // });
  }

  this.loadNotes = function(filename, done) {
    // $.get('/loadNotes',{filename:filename},  function(data){
    //   if(data) {
    //     done(data)
    //     console.log("load success");
    //   }
    // });
  }
  
  this.listNotes = function() {
    console.log('api listnotes')
    gapi.client.load('drive', 'v3', this._listNotes);    
  }  
    
  this._listNotes = function() {
        console.log('api _listnotes')

    var request = gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
      });
    request.execute(function(resp) {
      var files = resp.files;
      console.log('files____'+JSON.stringify(files))
    });      
  }
}


$( document ).ajaxSuccess(function( event, request, settings ) {
  if ( settings.url.startsWith("/loadNotes") ) {
    //app.extractHashtags();
  } else if (settings.url.startsWith("/saveNotes") ) { 
    //app.getNotesFiles();
  }
});


var Util = function() {
  this.formatDate = function(date) {
    return date.split('.')[0].replace('T', ' ').replace(/-/g,'/')
  }  
}
