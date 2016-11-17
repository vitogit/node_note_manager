#Notes manager [STOPPED]

##Info
It uses tinymce as the text editor, Jquery to perform dom and event handling and Node.js as backend

##Intro
Add notes using the bullets points
Filter notes using the filter input
Save and load notes.

##Node
Node.js is the backend where the save, load and list happens using a simple file. This was really easy to setup and it works pretty well.

##Installation
```
npm install 
npm run start 
```

##STOPPED
The Node backend with files worked like a charm but the problem is that I wanted to deploy to heroku that doesn´t persist files, so I changed the approach. I choose for a more lightweigh approach and build the app using javascript, tinymce and google drive for persistence https://github.com/vitogit/sorter
