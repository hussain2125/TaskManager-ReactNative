import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import React from 'react';
import { View, Text } from 'react-native';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15,
        color: 'gray'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', paddingVertical: 10 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15,
        color: 'gray'
      }}
    />
  ),
};

export default toastConfig;