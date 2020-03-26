import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';

import {RadioButton, Text} from 'react-native-paper';

import StepContainer from './StepContainer';

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

    const [selected, setSelected] = useState(props.caseReport.gender);

    const onSelect = item => {
        setSelected(item);
    };

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.gender = selected;
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.gender.title')}
            helpText={t('report.help.defaultText')}
            onFinish={() => props.onFinish(getStateToBeSaved())}
            onExit={() => props.onExit(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
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
        </StepContainer>
    );
}

GenderStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
