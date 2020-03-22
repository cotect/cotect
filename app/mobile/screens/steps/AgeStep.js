
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import {useTranslation} from 'react-i18next';
import { TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: "white"
    }
});

export default function AgeStep(props) {
    const {t} = useTranslation();
    // since the props are used as initial value, we would not necessarily need an own state here, as the initial state is only considered for the first call.
    // However, even if setAge will be called with the same value two times, the component will not re-render again (https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)
    const [age, setAge] = useState(props.stepItem.initialProps);

    let onChangeText = (input) => {
        setAge(input);
        const nextEnabled = (input && input.length > 0) ? true : false;
        props.stepItem.onFinish(input, nextEnabled);
    }

    return (
        <View>
            <TextInput
                style={styles.inputField}
                label={t('report.age.inputLabel')}
                value={age}
                onChangeText={text => onChangeText(text)}
            />
        </View>
    )
}
