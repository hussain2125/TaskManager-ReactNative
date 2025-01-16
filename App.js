// Import necessary modules and components
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';
import Welcome from "./app/screens/Welcome";
import Tasks from "./app/screens/Tasks";
import AddTask from "./app/screens/AddTask";
import TaskDetails from "./app/screens/TaskDetails";
import CalenderView from "./app/screens/CalenderView";
import { TasksProvider } from "./app/context/TasksContext";
import { useState, useEffect } from 'react';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Function to load custom fonts
const loadFonts = async () => {
  await Font.loadAsync({
    'ProductSans': require('./app/fonts/ProductSans.ttf'),
    'ProductSans-Bold': require('./app/fonts/ProductSansBold.ttf'),
  });
};

export default function App() {
  // State to track if fonts are loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts when the component mounts
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  // Show a loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render the app with navigation and context providers
  return (
    <TasksProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tasks"
            component={Tasks}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTask}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CalenderView"
            component={CalenderView}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
