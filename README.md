1. Add .gitignore file.
2. Add .env(dev-config.env) file.
3. set up script for using .env file and nodemon ("start-dev": "nodemon --env-file=dev-config.env src/index.js").
4. Add file and directories inside src directory for app (like index.js, app.js, constants.js and directories controller, db, middleware, utils, routes ).

5. Add mongoose and connection with DB.
6. Add express and configure the express like- for cors, handling json data ( body in request) in request, handling urlData( params ) and setUp for serving static files.
7. Add cookie-parser setup for setting and getting the cookies from backend.
8. Add asyncHandler high order fuction.
9. Add AppError Class for error handling.


