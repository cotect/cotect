import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: "white"
    }
});

export default function TemperatureStep(props) {
    const [temperature, setTemperature] = useState(props.stepItem.initialProps);

    let onChangeText = (input) => {
        setTemperature(input);
        const nextEnabled = (input && input.length > 0) ? true : false;
        props.stepItem.onFinish(input, nextEnabled);
    }

    return (
        <View>
            <TextInput
                style={styles.inputField}
                label='Temperature'
                value={temperature}
                onChangeText={text => onChangeText(text)}
            />
        </View>
    );
};
