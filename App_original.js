import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import {MapView, Location, Constants} from 'expo';
import {Permissions} from 'expo-permissions';

class App extends React.Component {
  state = {
    todo: "my todo",
    listItems : ["item1", "item2", "item3"],
      mapRegion: null,
      hasLocationPermissions: false,
      locationResult: null
  }; 
  
  componentDidMount() {
    this._getLocationAsync();
  }

  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion);
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => { 
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }
 
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    
    // Center the map on the location we just fetched.
     this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
  };

  renderListItems =()=>{
    return this.state.listItems.map( item=>{
        return (<Text key={item}>{item}</Text>)
    })
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Hello</Text>
        <Text>{this.state.todo}</Text>
        <TextInput
          style={styles.inputStyle}
          onChangeText={(text)=>this.setState({todo:text})}>
        </TextInput>
        {this.renderListItems()}  
        
        {
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ alignSelf: 'stretch', height: 400 }}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
            />
        }

      </View>
    )
  }
}

const styles = {
  viewStyle: { 
    flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputStyle: {
    height: 40, 
    width:180,
    borderWidth: 1, 
    borderColor: 'orange' 
  }
}
export default App;