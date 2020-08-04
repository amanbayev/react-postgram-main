import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Button, Layout, PageHeader } from 'antd';
import 'firebase/database';
import 'firebase/auth';
import { config } from '../firebase/config';
import { Link } from '@reach/router';
import styled from 'styled-components';
import SinglePost from './SinglePost';

const MainLayout = styled(Layout)`
  width: 100vw;
  height: 100vh;
  align-items: center;
`;

const Header = styled(PageHeader)`
  width: 1000px;
`;

const UserPosts = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const userId = props.uid;

  useEffect(() => {
    if (!firebase.apps.length) {
      console.log('I am initializing new firebase app');
      firebase.initializeApp(config);
    }
    console.log('uid is ', userId);
    firebase
      .database()
      .ref('/posts')
      // .child('uid')
      .orderByChild('uid')
      .equalTo(userId)
      .on('value', function (snapshot) {
        console.log('value is ', snapshot.val());
        let posts = [];
        for (let key in snapshot.val()) {
          posts.push({ ...snapshot.val()[key], id: key });
        }
        setUserPosts(posts);
      });

    return function cleanup() {
      // looks like you don't need to do any clean up, but if you do, do it here
      firebase.database().ref('/posts').off();
    };
  }, []);

  return (
    <MainLayout>
      <Header
        title="Postgram"
        extra={[
          <Button type="primary">
            <Link to="/">Main page</Link>
          </Button>,
        ]}
      />
      {userPosts.map((post, index) => (
        <SinglePost post={post} key={index + ' post2'} />
      ))}
    </MainLayout>
  );
};

export default UserPosts;
