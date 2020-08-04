import React from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { config } from './config';

const firebaseContext = React.createContext();

// Provider hook that initializes firebase, creates firebase object and handles state
function useProvideFirebase() {
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    if (!firebase.apps.length) {
      // console.log("I am initializing new firebase app");
      firebase.initializeApp(config);
    }

    const unsubscribeFunction = firebase.auth().onAuthStateChanged((user) => {
      // console.log("got new user", user);
      setUser(user);
    });

    firebase
      .database()
      .ref('/posts')
      .on('value', function (snapshot) {
        // console.log("value is ", Object.values(snapshot.val()));
        let posts = [];
        for (let key in snapshot.val()) {
          posts.push({ ...snapshot.val()[key], id: key });
        }
        setPosts(posts);
      });

    return function cleanup() {
      // looks like you don't need to do any clean up, but if you do, do it here
      unsubscribeFunction();
      firebase.database().ref('/posts').off();
    };
  }, []);

  const register = async (email, password) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const login = async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const signout = async () => {
    await firebase.auth().signOut();
  };

  const post = async (values) => {
    if (!values.url) {
      values.url = '';
    }
    // console.log(firebase.auth().currentUser);
    const { uid, email, displayName } = firebase.auth().currentUser;
    await firebase
      .database()
      .ref('posts')
      .push({
        ...values,
        uid,
        displayName,
        email,
      });
  };

  const deletePostById = async (postId) => {
    // console.log('deleting post by id: ', postId);
    await firebase
      .database()
      .ref('/posts/' + postId)
      .remove();
  };

  return {
    posts,
    user,
    register,
    login,
    signout,
    post,
    deletePostById,
  };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useFirebase().
export function ProvideFirebase({ children }) {
  const firebaseHook = useProvideFirebase();
  return (
    <firebaseContext.Provider value={firebaseHook}>
      {children}
    </firebaseContext.Provider>
  );
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useFirebase = () => {
  return React.useContext(firebaseContext);
};
