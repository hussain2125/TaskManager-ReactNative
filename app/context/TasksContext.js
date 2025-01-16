// This file defines the context and provider for managing tasks in the application.
// It uses React's Context API to create a TasksContext and a TasksProvider component.
// The TasksProvider component handles loading and saving tasks to AsyncStorage,
// and provides the tasks state and setTasks function to its children.

// Import necessary modules and components
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for tasks
export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // State to store tasks
  const [tasks, setTasks] = useState([]);

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever tasks state changes
  useEffect(() => {
    const saveTasks = async () => {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks]);

  // Provide tasks and setTasks to the context
  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};