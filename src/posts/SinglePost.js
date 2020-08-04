import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, message, Button } from 'antd';
import { useFirebase } from '../firebase/useFirebase';

import { DeleteOutlined } from '@ant-design/icons';

import moment from 'moment';

const MyCard = styled(Card)`
  margin-top: 50px;
  width: 800px;
`;

function SinglePost({ post }) {
  const { deletePostById } = useFirebase();

  const placeholderImageUrl =
    'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg';

  const onDeleteClick = async (post) => {
    try {
      await deletePostById(post.id);
      message.success('Post deleted!');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <MyCard title={post.title}>
      <Row>
        <Col flex="120px">
          <img
            style={{ width: '120px' }}
            alt="Post"
            src={post.url || placeholderImageUrl}
          />
        </Col>
        <Col flex="auto" style={{ marginLeft: '32px' }}>
          <div>{post.content}</div>
          <div style={{ marginTop: '16px' }}>
            <i>
              Created at:&nbsp;
              {moment(post.createdAt).format('DD MMM YYYY HH:SS')}
            </i>
          </div>
        </Col>
        <Col flex="100px">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              // console.log(post);
              onDeleteClick(post);
            }}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </MyCard>
  );
}

export default SinglePost;
