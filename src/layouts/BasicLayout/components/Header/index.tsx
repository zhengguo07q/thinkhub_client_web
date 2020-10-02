import React from 'react';
import Logo from './components/Logo';
import { Nav ,Grid, Search} from '@alifd/next';

const Item = Nav.Item;

export default function Header() {
  return (
    <div role="grid">
      <Grid.Row>
        <Grid.Col fixedSpan="4">
          <Logo 
          image="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
          text="Logo"
          />
      </Grid.Col>
      <Grid.Col fixedSpan="16">
        <Search style={{lineHeight: '51px'}} shape="simple" type="dark" placeholder="" size="medium"/>
      </Grid.Col>
      <Grid.Col fixedSpan="16">    
        <Nav style={{lineHeight: '49px', backgroundColor:'#18263C'}} direction="hoz" type="primary" defaultSelectedKeys={['home']} triggerType="hover">
          <Item key="home">探索</Item>
          <Item key="document">知识</Item>
        </Nav></Grid.Col> 
      </Grid.Row>
    </div>
  );
}