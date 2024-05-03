[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13378832&assignment_repo_type=AssignmentRepo)

### Intelligent Wardrobe Management System 
#### Itnurtureden

The project aims to enable efficient wardrobe organization through implementing an Intelligent Wardrobe Management System. Utilizing deep learning, artificial intelligence, and machine learning, the system aims to transform how users engage with their wardrobes. The main objective is to develop a website and a mobile app that efficiently categorizes clothing items and offers personalized outfit suggestions from the clothes in their wardrobe. Considering user preferences, real-time weather data, and contemporary fashion trends, the system strives to enhance the wardrobe management experience.  


**Running the Intelligent Wardrobe Management System**

1. **Install Dependencies:**
   - Run `npm install --check` in the directories `code/app-iwm`, `code/web-iwm` and `code/backend`.

2. **Configure Global IP Address:**
   - Open the `global.js` file located in both the `code/app-iwm` and `code/backend` directories.
   - Replace the placeholder IP address with your machine's global IP address.
   - To find your IP address, run the command `hostname -I` in your terminal.

3. **Creating a Virtual Environment**
   - Create a virtual environment by running the commands `python3 -m venv env` and `source env/bin/activate` in the `code/backend` directory.
   - Run the script `install.sh` to install all the dependencies
   ```bash
   python3 -m venv env
   source env/bin/activate
   bash install.sh
   ```

4. **Running the Mobile App:**
   - Open two terminal windows.
   - In one terminal, navigate to the `code/app-iwm` directory.
   - In the other terminal, navigate to the `code/backend` directory.
   - Run `npm start` in both terminals to start the backend server and the Expo development server for the mobile app.

5. **File watcher error**
   - It might be possible that the backend crashes due to exceeding the number of file watchers allowed by the os
   - To deal with this run the following command
   ```bash
   sudo sysctl fs.inotify.max_user_watches=524288
   ```
   - Restart the backend server by running `npm start`

6. **Running the Website:**
   - Open two terminal windows.
   - In one terminal, navigate to the `code/web-iwm` directory.
   - In the other terminal, navigate to the `code/backend` directory.
   - Run `npm start` in the backend directory to start the backend server.
   - Run `npm run dev` in the `web-iwm` directory to start the website development server.

7. **Accessing the App and Website:**
   - For the mobile app:
     - Open the Expo Go app on your mobile device.
     - On the Expo Go App, scan the QR code displayed in the terminal where `npm start` was run for the `app-iwm`. Alternatively, manually enter the provided IP on the Expo Go App.
   - For the website:
     - Access the website by entering `localhost:3000` in your web browser.

[Link To R1 Class Presentation](https://iiitaphyd-my.sharepoint.com/:p:/g/personal/shaunak_biswas_research_iiit_ac_in/EeRKgibPJtdJnYWF8ZeGlSkBybhB9MISSY7NYCstY0VspA?e=N8qEQf)


<!-- 
 "developer": {
      "tool": "expo-cli",
      "ignoreWarnings": true
} -->
