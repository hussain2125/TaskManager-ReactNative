// This file defines the context and provider for managing tasks in the application.
// It uses React's Context API to create a TasksContext and a TasksProvider component.
// The TasksProvider component handles loading and saving tasks to Firebase,
// and provides the tasks state and setTasks function to its children.

// Import necessary modules and components
import React, { createContext, useState, useEffect } from "react";
import { firebase } from "../../firebaseConfig";

// Create a context for tasks
export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // State to store tasks
  const [tasks, setTasks] = useState([]);

  // Load tasks from Firebase when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const tasksSnapshot = await firebase.firestore().collection('tasks').where('userId', '==', user.uid).get();
        const loadedTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(loadedTasks);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to Firebase whenever tasks state changes
  useEffect(() => {
    const saveTasks = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const batch = firebase.firestore().batch();
        tasks.forEach(task => {
          const taskRef = firebase.firestore().collection('tasks').doc(task.id);
          batch.set(taskRef, { ...task, userId: user.uid });
        });
        await batch.commit();
      }
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