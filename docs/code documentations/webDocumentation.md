# Documentation about the website
This is a brief description about the different files and directories in the directory 'web-iwm'
## styles directory
This directory contains the stylesheet files (CSS) used in the web pages
## public directory
This directory contains the images that we have used in the web pages
### scrapped_images directory
This directory contains the images that were scrapped from another webpage. This is done using the 'new_scrapper.py' file in the backend
## src
This is the folder that contains all of the code for the web pages
### components directory
In this directory, we have defined components that are used in multiple places, and hence, it is better to define them in one place, and use them whenever required, instead of defining them multiple times. The components are
1. checkbox.js : Defines a checkbox
2. navbar.js : Defines the navigation bar which is at the top of every webpage
3. wardrobecard.js : Defines a card containing image of the cloth, tags, and buttons to like, delete etc. These cards are displyed in the wardrobe page.
### app directory 
The following are the different codes in this directory
1. wardrobe: Front end for the wardrobe page in which the user can see and update his wardrobe
2. trends : Front end for the trends page, which displays all the scraped images
3. recommendations : Front end for the recommendations page, in which user gives an occasion, and the app displays appropriate clothes,
4. profile : Page to display a user's profile
5. notLogged : Displayed when the user is not logged in. Prompt user to log in
6. signin  : Page for the sign in/ sign up page
7. page.js : The home screen of the website
