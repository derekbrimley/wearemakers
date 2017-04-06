# Development 

## Architecture

The two main areas of the site where development is done is in the client folder and the server folder.
### Client
The client is primarily in charge of making web calls to the api endpoints, returning data, and displaying the data on the front end. However the client also contains some assets, and it contains several components.  Components are reusable peices of code that are called from code elsewhere in the client.

Navigate to client\app.  Within this folder you will find the folders and file that contain the bulk of the client side code for the website. Everything on the 'admin' side of the website (marking attendance, creating classes, etc), is contained within the clietn\app\admin folder.  Generally, each folder will just contain an index.html, index.js, and style.scss file.  However sections of the site that have modals (such as the student administration pages), will have a modal.html and controller.js file for each modal contained in that section.

### Server
The server is in charge of providing all api endpoints, which includes routing and database calls.  The server also contains much of the configurations, such as the database configurations, etc.

The high level routing starts at server\routes.js.  From there, more specific routes are configured in each folder contained in server\api\.  For example, server\api\class\index.js sets up the routes for the apis for all the class api endpoints.

The high level database schema is set up server\sqldb\index.js.  However each specific table in the database is defined within the specific folders for each api.  For example, server\api\class\class.model.js defines the class table.

Each folder will contain a controller.js file.  This file is the main file that the routes point to, and it is where the api endpoint is configured to handle database requets. 


## Debugging

Debugging most problems on the client side will be done in the console in the browser when you inspect element.

Degugging most api / server problems will be done using the console where you ran 'gulp serve'. 

