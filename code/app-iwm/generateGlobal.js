const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to get the first IP address of the host
function getIPAddress() {
  try {
    const output = execSync('hostname -I').toString().trim();
    return output.split(' ')[0];
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for port input
rl.question('Enter port to link backend with: ', (port) => {
  const ip = getIPAddress();
  const content = `const ip = '${ip}';\nconst port = '${port}';\n\nexport { ip as ip, port as port }`;

  // Write the content to global.js file in the current directory
  const currentGlobalFilePath = path.join(__dirname, 'global.js');
  fs.writeFileSync(currentGlobalFilePath, content);

  // Check if the backend directory exists and create global.js there as well
  const backendGlobalFilePath = path.join(__dirname, '..', 'backend', 'global.js');
  if (fs.existsSync(path.join(__dirname, '..', 'backend'))) {
    fs.writeFileSync(backendGlobalFilePath, content);
  }

  // Close readline interface
  rl.close();
});

