1. Add .gitignore file.
2. Add .env(dev-config.env) file.
3. set up script for using .env file and nodemon ("start-dev": "nodemon --env-file=dev-config.env src/index.js").
4. Add file and directories inside src directory for app (like index.js, app.js, constants.js and directories controller, db, middleware, utils, routes ).

5. Add mongoose and connection with DB.
6. Add express and configure the express like- for cors, handling json data ( body in request) in request, handling urlData( params ) and setUp for serving static files.
7. Add cookie-parser setup for setting and getting the cookies from backend.
8. Add asyncHandler high order fuction.
9. Add AppError Class for error handling.


10. For modeling of data I am refering [this link](https://app.eraser.io/workspace/WJQbjEo62445lVNP8umM?origin=share)

11. Add bcrypt to encyrpt the password
12. Add jsonwebtoken to get access and refresh token

13. configure cloudinary servise for file uploads
14. configure multer as file handling middleware 

15. configure multer middleware in 'api/v1/users/register' route.
16. configure cloudinary servise in 'api/v1/users/register' route.
17. data validation on req object both for body and files for 'api/v1/users/register' route.
18. save the user into dataBase for 'api/v1/users/register' route.

19. created an api for log in (i.e. api/v1/users/login).
20. created an api for log out (i.e. api/v1/users/logout).
21. created an api for refresh token (i.e. api/v1/users/refresh-token). 
 
22. created an api for changing password (i.e. api/v1/users/change-user-password).
23. created an api for changing user info(only for fullName, email and username) (i.e. api/v1/users/edit-user-info).
24. created an api for changing avatar image (i.e. api/v1/users/edit-user-avatar).
25. created an api for changing cover image (i.e. api/v1/users/edit-user-cover-image).





