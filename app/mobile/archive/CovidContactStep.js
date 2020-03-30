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

export default function CovidContactStep(props) {
    const {t} = useTranslation();

    const [hadCovidContact, setCovidContact] = useState(props.stepItem.initialProps);
    const hadCovidContactStr = "" + hadCovidContact;

    const onSelect = selectionStr => {
        const selection = (selectionStr === 'true');

        setCovidContact(selection);
        props.stepItem.onFinish(selection);
    };

    return (
        <View>
            <RadioButton.Group onValueChange={onSelect} value={hadCovidContactStr}>
                <View style={styles.radioButtonItem}>
                    <RadioButton.Android value={"true"} color={styles.radioButton.color} />
                    <Text>{t('basics.yes')}</Text>
                </View>
                <View style={styles.radioButtonItem}>
                    <RadioButton.Android value={"false"} color={styles.radioButton.color} />
                    <Text>{t('basics.no')}</Text>
                </View>
            </RadioButton.Group>
        </View>
    );
}
