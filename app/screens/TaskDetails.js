// Import necessary modules and components
import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { TasksContext } from "../context/TasksContext";

// External Libraries that are used in the file:
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../firebaseConfig";
import Toast from 'react-native-toast-message';

const TaskDetails = ({ route, navigation }) => {
  // Get task details from route parameters
  const { task } = route.params;
  
  // Get tasks and setTasks function from context
  const { tasks, setTasks } = useContext(TasksContext);
  
  // State variables for task details
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [startDate, setStartDate] = useState(new Date(task.startDate));
  const [endDate, setEndDate] = useState(new Date(task.endDate));
  const [priority, setPriority] = useState(task.priority);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle saving the updated task
  const handleSaveTask = async () => {
    if (title.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Task title cannot be empty.',
      });
      return;
    }
    if (endDate < startDate) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Due date cannot be earlier than start date.',
      });
      return;
    }
    const updatedTask = { ...task, title, description, startDate: startDate.toString(), endDate: endDate.toString(), priority };
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    setTasks(updatedTasks);
    try {
      await firebase.firestore().collection('tasks').doc(task.id).update(updatedTask);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Task updated successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update task. Please try again.',
      });
    }
    setIsEditing(false);
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Title input */}
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, styles.titleInput, !isEditing && styles.uneditable]}
            maxLength={35}
            multiline
            editable={isEditing}
          />
        </TouchableOpacity>
        
        {/* Display due date when not editing */}
        {!isEditing && (
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#333" />
            <Text style={styles.dateText}>
              Due: {endDate.toDateString()}
            </Text>
          </View>
        )}
        <View style={styles.separator} />
        
        {/* Description input */}
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descriptionInput, !isEditing && styles.uneditable]}
            multiline
            editable={isEditing}
          />
        </TouchableOpacity>
        
        {/* Date pickers for editing */}
        {isEditing && (
          <View style={styles.dateContainer}>
            <View style={styles.datePicker}>
              <Text style={styles.heading}>Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setStartDate(selectedDate);
                      if (selectedDate > endDate) {
                        setEndDate(selectedDate);
                      }
                    }
                  }}
                />
              )}
            </View>
            <View style={styles.datePicker}>
              <Text style={styles.heading}>Due Date</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{endDate.toDateString()}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEndDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>
        )}
        
        {/* Priority selection for editing */}
        {isEditing && (
          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[styles.priorityButton, priority === "high" && styles.priorityButtonSelectedHigh]}
                onPress={() => setPriority("high")}
              >
                <Text style={styles.priorityButtonText}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priorityButton, priority === "medium" && styles.priorityButtonSelectedMedium]}
                onPress={() => setPriority("medium")}
              >
                <Text style={styles.priorityButtonText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priorityButton, priority === "low" && styles.priorityButtonSelectedLow]}
                onPress={() => setPriority("low")}
              >
                <Text style={styles.priorityButtonText}>Low</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
      {/* Save button for editing */}
      {isEditing && (
        <TouchableOpacity onPress={handleSaveTask} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'ProductSans-Bold',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'ProductSans',
    fontSize: 16,
    marginBottom: 20,
    color: "#000", // Ensure text color is always visible
  },
  titleInput: {
    fontSize: 24,
    fontFamily: 'ProductSans-Bold',
  },
  descriptionInput: {
    height: 430, // Increased height for more space
    textAlignVertical: 'top',
  },
  uneditable: {
    borderWidth: 0,
    backgroundColor: "transparent",
    opacity: 1, // Ensure consistent opacity
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "ProductSans",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  datePicker: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'ProductSans',
  },
  priorityContainer: {
    marginVertical: 10,
  },
  priorityLabel: {
    fontSize: 20,
    fontFamily: 'ProductSans-Bold',
    marginBottom: 10,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  priorityButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderBottomWidth: 4, // Bolder bottom border for neobrutalism effect
  },
  priorityButtonSelectedHigh: {
    backgroundColor: "#ff7e5a", // Darker red
  },
  priorityButtonSelectedMedium: {
    backgroundColor: "#5694f2", // Darker blue
  },
  priorityButtonSelectedLow: {
    backgroundColor: "#53c2c5", // Darker green
  },
  priorityButtonText: {
    fontSize: 16,
    fontFamily: 'ProductSans-Bold',
    lineHeight: 20, // Ensure the tails of letters are visible
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12, // Decreased top and bottom padding
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: "white", // Changed text color to black
    fontSize: 18,
    fontFamily: 'ProductSans-Bold',
  },
});

export default TaskDetails;
