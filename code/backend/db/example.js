import Bcrypt from 'react-native-bcrypt';

// Function to generate a hash of a password
const generateHash = (password) => {
  return Bcrypt.hashSync(password, 10);
};

// Password to hash
const password = 'newpass';

// Generate two hashes of the password
const hash1 = generateHash(password);
const hash2 = generateHash(password);

// Compare the two hashes
if (Bcrypt.compareSync(hash1, hash2)) {
  console.log('Hurray! The passwords match.');
} else {
  console.log('The passwords do not match.');
}

