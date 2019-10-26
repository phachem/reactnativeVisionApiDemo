'use strict';
import React, {Component}  from 'react';
import { Icon, Card, CardItem, Body, Text } from 'native-base';

export class LibCard extends Component {
  constructor(props) {
    super(props);   
  }

  render() {
    return (
        <Card  style={{flex:1}}>
          <CardItem style={{backgroundColor:'#06409e'}} button  onPress={this.props.onPress}>
            <Body>
              <Icon name='images' style={{color:'white'}} />
              <Text style={{color:'white'}}>
                Library
              </Text>
            </Body>
          </CardItem>
        </Card>
    );
  }
}
