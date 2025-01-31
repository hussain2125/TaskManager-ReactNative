// Import necessary modules and components
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from 'react-native-toast-message';
import { TasksContext } from "../context/TasksContext";
import { firebase } from "../../firebaseConfig";
import toastConfig from "../../toastconfig";

const AddTask = ({ navigation, route }) => {
  // Get setTasks function from context
  const { setTasks } = useContext(TasksContext);
  // State variables for task details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [priority, setPriority] = useState("medium");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.selectedDate) {
      const selectedDate = new Date(route.params.selectedDate);
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  }, [route.params?.selectedDate]);

  // Function to handle adding a new task
  const handleAddTask = async () => {
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
    setLoading(true);
    const user = firebase.auth().currentUser;
    if (user) {
      const newTask = {
        title,
        description,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        priority,
        userId: user.uid,
      };
      try {
        const taskRef = await firebase.firestore().collection('tasks').add(newTask);
        setTasks((prevTasks) => [...prevTasks, { id: taskRef.id, ...newTask }]);
        setLoading(false);
        navigation.navigate("Tasks");
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add task. Please try again.',
        });
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title input */}
          <Text style={styles.heading}>Title</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, styles.inputNeobrutalism]}
            maxLength={50} // Added max length of 50 characters
          />

          {/* Description input */}
          <Text style={styles.heading}>Description</Text>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[
              styles.input,
              styles.descriptionInput,
              styles.inputNeobrutalism,
            ]}
            multiline
          />

          {/* Start date picker */}
          <Text style={styles.heading}>Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={[styles.dateButton, styles.inputNeobrutalism]}
          >
            <Text style={styles.dateButtonText}>
              {startDate.toDateString()}
            </Text>
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

          {/* End date picker */}
          <Text style={styles.heading}>Due Date</Text>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={[styles.dateButton, styles.inputNeobrutalism]}
          >
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

          {/* Priority selection */}
          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === "high" && styles.priorityButtonSelectedHigh,
                ]}
                onPress={() => setPriority("high")}
              >
                <Text style={styles.priorityButtonText}>High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === "medium" && styles.priorityButtonSelectedMedium,
                ]}
                onPress={() => setPriority("medium")}
              >
                <Text style={styles.priorityButtonText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  priority === "low" && styles.priorityButtonSelectedLow,
                ]}
                onPress={() => setPriority("low")}
              >
                <Text style={styles.priorityButtonText}>Low</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Add task button */}
        <Pressable
          onPress={handleAddTask}
          style={({ pressed }) => [
            {
              borderBottomWidth: pressed ? 1 : 4, // Change bottom border width when pressed
              borderRightWidth: pressed ? 1 : 4, // Change right border width when pressed
              backgroundColor: pressed ? "#f2f2f2" : "white", // Change background color when pressed
              transform: pressed ? [{ translateX: 3 }, { translateY: 3 }] : [], // Move button 2 pixels right and downward when pressed
            },
            styles.button,
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Set Task</Text>
          )}
        </Pressable>
        <Toast  config={toastConfig}/>
      </View>
    </ScrollView>
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
    fontSize: 25,
    fontFamily: "ProductSans-Bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontFamily: "ProductSans",
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 12, // Increased top and bottom padding
  },
  descriptionInput: {
    height: 200,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: "ProductSans",
  },
  priorityContainer: {
    marginVertical: 10,
  },
  priorityLabel: {
    fontSize: 20,
    fontFamily: "ProductSans-Bold",
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
    fontFamily: "ProductSans-Bold",
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
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white", // Changed text color to black
    fontSize: 18,
    fontFamily: "ProductSans-Bold",
  },
  inputNeobrutalism: {
    borderBottomWidth: 5, // Bolder bottom border for neobrutalism effect
  },
});

export default AddTask;
