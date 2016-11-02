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
      });
     ed.on('change', function(e) {
       //parseHashtags(ed)
     });
    }
  });
  
  //load the saved notes
  loadNotes(); 
});    

function filter() {
  var current_text = $('#filter_box').val()
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  $(tinyDom).find('li').hide()
  $(tinyDom).find('li').each(function() {
    var li_text = $(this).clone().children('ul').remove().end().html();
    console.log(li_text)
    if (li_text.indexOf(current_text) != -1) {
      $(this).show()
      $(this).parents().show()
      $(this).find('li').show()
    } 
  })  
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
  $(tinyDom).find('.hashLink').each(function(){
    var newClick = $(this).attr("onclick").replace('parent.','');
    $(this).attr("onclick",newClick)
    $('.allTags').append($(this).clone())  
  })
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

function loadNotes() {
  var tinyDom = tinyMCE.activeEditor.dom.getRoot();
  $.get('/loadNotes', function(data){
    if(data) {
      $(tinyDom).html(data)
      console.log("load success");
    }
  });
}
