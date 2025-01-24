import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDErgFbxSriFyOzj7UmzYuIWK_neTF5SeY",
    authDomain: "taskmanagerreactnative-5990b.firebaseapp.com",
    projectId: "taskmanagerreactnative-5990b",
    storageBucket: "taskmanagerreactnative-5990b.firebasestorage.app",
    messagingSenderId: "753960820958",
    appId: "1:753960820958:web:6039e86fc9239956aaa24f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
