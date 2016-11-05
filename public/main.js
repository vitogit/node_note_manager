function filter() {
  var current_text = $('#filter_box').val()
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  $(tinyDom).find('li').hide()
  $(tinyDom).find('li').each(function() {
    var li_text = $(this).clone().children('ul').remove().end().html();
    if (li_text.indexOf(current_text) != -1) {
      $(this).show()
      $(this).parents().show()
      $(this).find('li').show()
    } 
  })  
}

  
function file_link(filename) {
  loadNotes(filename);
} 

function filterClear(){
  $('#filter_box').val("")
  filter()
}

function filter_link(hashtag) {
  $('#filter_box').val('#'+hashtag)  
  $('#filter_box').trigger("input")  
}

function parseHashtags(ed) {
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  var initText = $(tinyDom).html()
  parsedText = initText.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hashLink" onclick="parent.filter_link(\'$1\')" href="#">#$1</a>')
  $(tinyDom).html(parsedText)
  extractHashtags()
}

function extractHashtags() {
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  $('#allTags').html("")
  var tagMap = {}
  $(tinyDom).find('.hashLink').each(function(){
    var linkText = $(this).text()
    if (tagMap[linkText]) {
      tagMap[linkText] = tagMap[linkText]+1
    } else {
      tagMap[linkText] = 1
    }
  })

  $.each(tagMap, function( index, value ) {
    var newLink = $("<a />", {
        onclick : "filter_link('"+index.replace('#','')+"')",
        href : "#",
        text : index+"("+value+")"
    });

    $('#allTags').append(newLink).append('<br/>')
  });

} 

function saveNotes() {
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  var notes = $(tinyDom).html()
  $.get('/saveNotes',{notes:notes}, function(data){
    if(data==='ok') {
      console.log("saved success");
    }
  });
}

function loadNotes(filename) {
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  var filename = filename || 'notes.html'
  $.get('/loadNotes',{filename:filename},  function(data){
    if(data) {
      $(tinyDom).html(data);
      console.log("load success");
    }
  });
}
  
function getNotesFiles() {
  $('#fileFinder ol').html("");
  $.get('/getNotesFiles', function(data){
    if(data) {
      var files = JSON.parse(data)
      files.forEach(file => {
        var li = $('<li/>')
        var newLink = $("<a />", {
            onclick : "file_link('"+file.name+"')",
            href : "#",
            text : formatDate(file.modifiedDate)
        }).appendTo(li);
        $('#fileFinder ol').append(li)
      })      
    }
  });
}  


$( document ).ajaxSuccess(function( event, request, settings ) {
  if ( settings.url.startsWith("/loadNotes") ) {
    extractHashtags();
  } else if (settings.url.startsWith("/saveNotes") ) { 
    getNotesFiles();
  }
});



  function formatDate(date) {
    return date.split('.')[0].replace('T', ' ').replace(/-/g,'/')
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
    save_onsavecallback: function () { parseHashtags(); saveNotes();  },
    toolbar: 'bullist save',
    setup : function(ed){
      ed.on('init', function() {
        this.getDoc().body.style.fontSize = '14px';
        loadNotes();
        getNotesFiles();
      });
    }
  });
  
  
  $('.bookmark_link').click(function(){
    var hashtag = $(this).text()
    $('#filter_box').val(hashtag)  
    $('#filter_box').trigger("input")  
  })  
});
