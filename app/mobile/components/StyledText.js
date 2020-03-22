import * as React from 'react';
import {Text} from 'react-native';

export function MonoText(props) {
    return <Text {...props} style={[props.style, {fontFamily: 'Arial'}]} />;
    // return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}
