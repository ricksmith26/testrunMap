import { Container, Header, Title, Button, Icon } from 'native-base';
import React, { Component } from 'react-native';

export default class CITHeader extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Button transparent>
            <Icon size={30} color={'#fff'} name={'ios-arrow-left'} />
          </Button>

          <Title>CITeTours</Title>

          <Button transparent>
            <Icon size={30} color={'#fff'} name={'navicon'} />
          </Button>
        </Header>
      </Container>
    );
  }
}
