
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Home from './Home';
import ShowJson from './ShowJson'

const RootStack = createStackNavigator({
  Home: {
    screen: Home
  },
  ShowJson: {
    screen: ShowJson
  },
});

const AppNavigator = createAppContainer(RootStack);

export default AppNavigator;