import React, {useState} from 'react';

import {StyleSheet, View} from 'react-native';

import {Text, RadioButton} from 'react-native-paper';

import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        color: '#8c81dd',
    },
});

const notTestedKey = "not-tested";

export default function CovidTestStep(props) {
    const {t} = useTranslation();

    const testStatuses = [
        {key: notTestedKey, value: t('report.covidTest.notTested')},
        {key: 'tested-negative', value: t('report.covidTest.testedNegative')},
        {key: 'tested-positive', value: t('report.covidTest.testedPositive')},
        {key: 'tested-pending', value: t('report.covidTest.testedPending')},
    ];

    // value corresponds to 'key' of testStatuses
    const [value, setValue] = useState(props.stepItem.initialProps);

    const onSelect = selection => {
        setValue(selection);
        props.stepItem.onFinish(selection);
    };

    return (
        <View>
            <RadioButton.Group onValueChange={onSelect} value={value}>
                {testStatuses.map((testStatus, index) => {
                    console.log(index);
                    return (
                        <View key={index} style={styles.radioButtonItem}>
                            <RadioButton.Android
                                value={testStatus.key}
                                color={styles.radioButton.color}
                            />
                            <Text>{testStatus.value}</Text>
                        </View>
                    );
                })}
            </RadioButton.Group>
        </View>
    );
}
