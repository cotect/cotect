import {AppRegistry, Platform} from 'react-native';
import App from './App';

import './i18n';

// uncomment if you want to hide the yellow boxes for demo purposes
// console.disableYellowBox = true;

AppRegistry.registerComponent('Cotect', () => App);

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication('Cotect', {rootTag});
}
