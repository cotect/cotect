import {AppRegistry, Platform} from 'react-native';
import App from './App';

import './i18n';

console.disableYellowBox = true;

AppRegistry.registerComponent('Cotect', () => App);

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication('Cotect', {rootTag});
}
