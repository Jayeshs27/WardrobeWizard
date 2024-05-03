# Documentation about the backend
This is a brief description about all the files and directories in the directory 'backend'
## db directory
### connectDB.js
This file defines a function to connect to the mongoose database
### operations.js
In this file, there are class definitions containing methods of the operations we have utilized in the backend. These classes are:
1. validateEmail : checks whether a provided string is a valid email
2. userProfileControl.getAllUsers : returns the details of all users in the database
3. userProfileControl.addUser : adds a new profile to the database
4. userProfileControl.checkUser : deals with the signing in of users. Checks if email is registered, and whether the encoded password matches the encoding of the provided password.
5. userProfileControl.UpdateProfile : Deals with when users want to change their profile details like phone number, name etc
6. userProfileControl.UpdatePassword : Checks whether the old password matches the user's password stored in the database, and updates this to be the new password
7. userProfileControl.DeleteAccount : Deletes a profile from the database
8. getRecomendations : runs the python script 'randomGen.py' to get the image paths of a top and a bottom wear.
### schema.js
Defines the schemas of how data is stored in the mongoose database. 
### wardrobe_operations.js
Similar to the 'operations.js', we have defined functions for various database related tasks, but this file deals with the functions related to the wardrobe only. These are:
1. wardrobe.addItem : Adds an item to the wardrobe, and also runs the script 'classify.py' to generate tags for the image
2. wardrobe.deleteItem : Removes a cloth from the database
3. wardrobe.getAllItems: Returns all the clothes of the user
4. wardrobe.toggleLikeOption : Deals with toggling of like option for clothes.

## routes directory
### routes.js
This file defines an Express router that handles various HTTP routes for user authentication, profile management, wardrobe operations, and recommendations. It imports controller functions from operations and wardrobe_operations.

## images directory
Contains all the images scraped by the script 'new_scrapper.py'

## Python files
### classifier_main.py
This script is used to build the keras model which is used for image classification. This model is saved as 'fashion_mnist_mode.keras'
### classify.py
This is the actual script that takes in the image source and generates tags such as ['Casualwear', 'blue', 'Trouser'] for the image.
### new_scrapper.py
This is used to scrape images from a webpage related to fashion trends. The images are then downloaded, cropped and converted to JPEG format. 
### randomGen.py
This script takes in the user input (which is the occasion), and the tags for every image in user's wardrobe, and returns 2 image paths (if both exist): one for the top matching the occasion, and one for the top.
## Other files
### package.json

Manifest file for the project, containing metadata and dependencies required by the application.

  

### package-lock.json

 
Automatically generated file by npm, specifying the exact version of each installed package in the node_modules directory.

### server.js
Sets up the backend express server, which is also connected to the mongoose database. The server also includes middleware for handling CORS headers. 


