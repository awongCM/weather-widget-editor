# weather-widget-editor
Coding Assignment Challenge by Viocorp

This following technologies are used in this assignment

* Node/Express(Backend API)
* Sass
* Bootstrap
* Gulp
* BrowserSync
* Unit Test(Mocha)
* Jquery/Javascript
* AJAX
* Handlerbars
* Font-icons ie [weather icons](http://erikflowers.github.io/weather-icons) 

##To get started
1. Clone this git repo onto your machine.
2. Navigate to the folder.
3. Run `bower install && npm install`.

##To start Node/Express
* `node server.js`

##Available Gulp commands
* `gulp clean` to manually clean up public viewing folder.
* `gulp dev` to startup the app. BrowserSync will load browser.  It also instantiates and proxies Express API server in the background.
* `gulp build` to build all assets files into one public viewing folder.
* `gulp test` to run basic unit tests coverage for the editor and widget generation through API.

##To test weather widget display
1. Either you create a blank static html page on your local machine and paste the widget code.
2. Or, use my `public.html` file if you want to test my gulp build locally.
3. Or - lastly - use public online code publishing sites such as [CodePen](http://codepen.io). (only for HTTP support though).
