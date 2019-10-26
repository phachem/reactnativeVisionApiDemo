import React from 'react';
import {
	Container, Content, Text, Button
} from 'native-base';

import {
	StyleSheet,
    View,
    Image,
} from 'react-native';


export default class ImageConfirmationPage extends React.Component {
    static navigationOptions = {
		headerTintColor: '#fff',
		headerStyle: {
			backgroundColor: '#595BD4',
			borderBottomColor: '#778BEB'
		 }
      };
      
  render() {
    const { navigation } = this.props;
    return (
        <Container style={{ backgroundColor: '#595BD4'}}>
            <Content>
                <View>

                    <Text style={{ fontWeight: 'bold', marginTop: 25, alignSelf:'center', color:'white'}}>
                        {JSON.stringify(navigation.getParam('landmarkName', 'NO-ID'))}
                    </Text>

                    <Image
							style = {{ height: 300, width: 300 ,alignSelf:'center', marginTop: 5, resizeMode: 'center'}}
							source={JSON.stringify(navigation.getParam('imageUri'))}/>

                    <View style={{ flexDirection: "row" , marginTop: "5%" ,justifyContent: "space-evenly"}  }>
                        <Button style={styles.buttonCorrect} onPress={this._confirmImage}>
                            <Text style={{ fontWeight: 'bold'}}>Cool, Thanks!</Text>
                        </Button>

                        <Button style={styles.buttonWrong  } onPress={this._rejectImage}>                       
                            <Text style={{ fontWeight: 'bold'}}>Umm.. What?</Text>
                        </Button>
                    </View>

                </View>
            </Content>
        </Container>

    );
  }

  _confirmImage = async () => {
    this.props.navigation.navigate('Home')
    }

  _rejectImage = async () => {
    this.props.navigation.navigate('Home')
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#595BD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCorrect: {
    height: 50,
    width: '46%',
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#53D86A',
    justifyContent: 'center',
    padding: 4,
},

buttonWrong: {
    height: 50,
    width: '46%',
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: '#FD3D39',
    justifyContent: 'center',
    padding: 4,
}
});
