function App(content) {
  this.content = content || ''
  this.filter_box = ''
  this.section_all_tags = ''
}

App.prototype.init = function() {
  
}

App.prototype.parseHashtags = function() {
  this.content = this.content.replace( /#(\w+)\b(?!<\/a>)/g ,'<a class="hashLink" onclick="parent.filter_link(\'$1\')" href="#">#$1</a>')
}

App.prototype.filter = function() {
  
}

App.prototype.extractHashtags = function() {
  var tinyDom = tinymce.activeEditor.dom.getRoot();
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
    console.log( index + ": " + value );
    var newLink = $("<a />", {
        onclick : "filter_link('"+index.replace('#','')+"')",
        href : "#",
        text : index+"("+value+")"
    });

    $('#allTags').append(newLink).append('<br/>')
  });
  
}

App.prototype.save = function() {
  
}

App.prototype.load = function() {
  
}

module.exports = App;
