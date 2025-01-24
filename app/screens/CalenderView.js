import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { TasksContext } from "../context/TasksContext";

// Configure locale for the calendar
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const CalenderView = ({ navigation }) => {
  const { tasks } = useContext(TasksContext);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    // Create a new date object set to the start of the day in local timezone
    const localDate = new Date(year, month, day);
    console.log(localDate);
    return localDate;
  });
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      const taskStartDate = new Date(task.startDate).setHours(0, 0, 0, 0);
      const taskEndDate = new Date(task.endDate).setHours(0, 0, 0, 0);
      const selectedDateNormalized = new Date(selectedDate).setHours(0, 0, 0, 0);

      return (
        selectedDateNormalized >= taskStartDate &&
        selectedDateNormalized <= taskEndDate
      );
    });
    setTasksForSelectedDate(filteredTasks);
  }, [selectedDate, tasks]);

  const handleDayPress = (day) => {
    setSelectedDate(new Date(day.dateString));
  };

  const handleMonthChange = (month) => {
    setSelectedDate(new Date(month.dateString));
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("TaskDetails", { task: item })}
      style={[
        styles.taskItem,
        item.priority === "high" && styles.priorityHigh,
        item.priority === "medium" && styles.priorityMedium,
        item.priority === "low" && styles.priorityLow,
      ]}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription} numberOfLines={1}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          Calendar
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddTask", { selectedDate: selectedDate.toISOString().split('T')[0] })}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Calendar
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={{
          [new Date(selectedDate).toISOString().split('T')[0]]: { selected: true, selectedColor: '#0D92F4' }
        }}
        theme={{
          selectedDayBackgroundColor: '#0D92F4',
          selectedDayTextColor: 'white',
          todayTextColor: 'black',
          arrowColor: 'blue',
          dayTextColor: '#000',
          textDayFontFamily: 'ProductSans',
          textMonthFontFamily: 'ProductSans-Bold',
          textDayHeaderFontFamily: 'ProductSans-Bold',
          textDayFontSize: 18,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          'stylesheet.day.basic': {
            base: {
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'black',
              backgroundColor: 'white',
              borderBottomWidth: 4,
            },
            selected: {
              backgroundColor: '#0D92F4',
              borderColor: 'black',
              borderWidth: 1,
              borderBottomWidth: 4,
            },
            today: {
              borderColor: '#0D92F4',
              borderBottomWidth: 4,
              borderWidth: 1,
              backgroundColor: 'white',
            },
            'today.selected': {
              backgroundColor: '#0D92F4',
              borderColor: 'black',
              borderWidth: 1,
              borderBottomWidth: 4,
              color: 'white',
            },
          },
        }}
      />
      <Text style={styles.taskListHeading}>
        Tasks for {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
      </Text>
      <FlatList
        data={tasksForSelectedDate}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  monthText: {
    fontSize: 20,
    fontFamily: "ProductSans-Bold",
  },
  taskListHeading: {
    fontSize: 20,
    fontFamily: "ProductSans-Bold",
    padding: 20,
    paddingBottom: 1,
  },
  taskList: {
    padding: 20,
  },
  taskItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 5,
  },
  taskTitle: {
    fontSize: 20,
    fontFamily: "ProductSans-Bold",
    marginBottom: 10,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: "ProductSans",
    color: "#333",
  },
  priorityHigh: {
    backgroundColor: "#ffcccc",
  },
  priorityMedium: {
    backgroundColor: "#cce5ff",
  },
  priorityLow: {
    backgroundColor: "#d4edda",
  },
});

export default CalenderView;