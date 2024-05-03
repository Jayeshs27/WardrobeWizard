import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WardrobeScreen  from './Screens/wardrobe';
import  CameraScreen  from './camera'
import RecommendationsScreen from './Screens/recommendations';
import TrendsScreen from './Screens/trends';
import HomeScreen from './Screens/home';
import SignInScreen from './Screens/signin'
import SignUpScreen from './Screens/signup';
import UserProfileScreen from './Screens/userprofile';
import ChangePassword from './Screens/changePassword';

const Stack = createNativeStackNavigator();

const App = ({ navigation }) => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Dynamically set initialRouteName
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trends"
          component={TrendsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="App"
          component={App}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown:false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
