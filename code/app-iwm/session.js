import AsyncStorage from '@react-native-async-storage/async-storage';

const saveSessionToken = async (token) => {
  try {
    await AsyncStorage.setItem('sessionToken', token);
  } catch (error) {
    console.error('Error saving session token:', error);
  }
};

const getSessionToken = async () => {
  try {
    const token = await AsyncStorage.getItem('sessionToken');
    return token;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

const clearSessionToken = async () => {
  try {
    await AsyncStorage.removeItem('sessionToken');
  } catch (error) {
    console.error('Error clearing session token:', error);
  }
};

const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('sessionToken');
      return !!token;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false; 
    }
};
  
//   // Example usage:
//   // Call the isLoggedIn function to check if the user is logged in
//   const userLoggedIn = await isLoggedIn();
//   console.log('User logged in:', userLoggedIn);
  
export {saveSessionToken as saveSessionToken,
        getSessionToken as getSessionToken,
        clearSessionToken as clearSessionToken,
        isLoggedIn as isLoggedIn
    }