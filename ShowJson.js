import React from 'react';
import {
	StyleSheet, View, ScrollView
} from 'react-native';

import {
	Container, Content, CardItem, Body, Text, Left, Thumbnail, Button, Grid, Col
} from 'native-base';

import JSONTree from 'react-native-json-tree';

export default class ShowJson extends React.Component {

	render() {
		return (
            <View style={{ height: 800 }}>
                <ScrollView >
                    <JSONTree flex="1" data={this.props.navigation.state.params.json} />
                </ScrollView>
            </View>
        );
    }
}
