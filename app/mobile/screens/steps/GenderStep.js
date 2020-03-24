import React, {useState} from 'react';

import {StyleSheet, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import {RadioButton, Text} from 'react-native-paper';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        color: '#8c81dd',
    },
});

export default function GenderStep(props) {
    const {t} = useTranslation();
    let genders = [
        {key: 'male', value: t('male')},
        {key: 'female', value: t('female')},
        {key: 'other', value: t('other')},
    ];

    let initialSelected = genders.indexOf(props.stepItem.initialProps);
    const [selected, setSelected] = useState(initialSelected);

    const onSelect = (item) => {
        setSelected(item);
        props.stepItem.onFinish(item, true);
    };

    return (
        <View>
            <RadioButton.Group onValueChange={onSelect} value={selected}>
                {genders.map((item, index) => {
                    return (
                        <View key={index} style={styles.radioButtonItem}>
                            <RadioButton.Android
                                value={item.key}
                                color={styles.radioButton.color}
                            />
                            <Text>{item.value}</Text>
                        </View>
                    );
                })}
            </RadioButton.Group>
        </View>
    );
}
