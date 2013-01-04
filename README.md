Cross platform mobile app built using Phonegap framework, JQuery Mobile, Backbone.js, Require.js, Underscore.js and HTML 5.

Use: Garden evaluation tool developed for use by <a href="http://www.metroblooms.org">Metro Blooms</a>

Platform: Android

Testing: Start script localHttpServerStart.sh in assets/www folder and connect via URL http://localhost:8000/

To Do: 
*  Add detailed description 
*  Refactor code
*  Add functionality for other types of evaluations
*  Create iOS branch

Note: You will need to configure the global URL variables for the Ajax jsonp call, as well as for the POST to the web server with the completed evaluation object, both in the file assets/www/js/evaluate.it.config.js (not included in this repository). You can also use this file for other sensitive configuration data storage. **Still need to set 'environ' and 'action' variables in index.html.** 

