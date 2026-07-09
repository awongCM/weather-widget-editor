'use strict';
/*globals document, console, XMLHttpRequest*/

console.log('Public Widget JS loaded...');


//Credit goes to this solution: - http://alexmarandon.com/articles/web_widget_jquery/
(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    //can be other jquery version above 1.4.2
    script_tag.setAttribute("src",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else { // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main(); 
}

function checkDocumentLoaded(){
    console.log(document.querySelector('#widget-content'));    
}

/******** Our main function ********/
function main() { 
    jQuery(document).ready(function($) { 
        
        //Great method to etract dynamic IP/domain name from script's url
        var urlParser = document.createElement('a');

        urlParser.href = $('#script-loader').attr('src');
        
        var serverHostURL = urlParser.protocol + '//'+ urlParser.hostname + ':' + urlParser.port;

        //Load external style sheet
        var css_link = $("<link>", { 
            rel: "stylesheet", 
            type: "text/css",
            href: serverHostURL + "/css/main.css" 
        });
        css_link.appendTo('head');

        var urlEndPoint = serverHostURL +  '/weather-widget/api/';
    
        $.ajax({
            type: 'POST',
            url: urlEndPoint,
            data: {
                title: $('#script-loader').attr("data-0"),
                units: $('#script-loader').attr("data-1"),
                showWind: $('#script-loader').attr("data-2"),
                lat: $('#script-loader').attr("data-3"),
                lon: $('#script-loader').attr("data-4")
            },
            success: function(data){
                $('#widget-content').html(data);    
            },
            error: function(error){
                console.log(error);
            }
        });
    });
}



})(); // We call our anonymous function immediately