import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';

import {RadioButton, Text, TouchableRipple} from 'react-native-paper';

import {CaseReport} from '../../client/cotect-backend/index';

import StepContainer from './StepContainer';

import {AUTO_NEXT_ENABLED, AUTO_NEXT_TIMEOUT} from '../../constants/Configuration';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default function GenderStep(props) {
    const {t} = useTranslation();
    let selectionOptions = [
        {key: CaseReport.GenderEnum.male, value: t('report.gender.male')},
        {key: CaseReport.GenderEnum.female, value: t('report.gender.female')},
        {key: CaseReport.GenderEnum.other, value: t('report.gender.other')},
    ];

    const [selection, setSelection] = useState(props.caseReport.gender);

    const onSelect = item => {
        setSelection(item);
        if (AUTO_NEXT_ENABLED) {
            setTimeout(() => {
                // onNext is triggered faster then the state change?
                props.onNext(getStateToBeSaved(item));
           }, AUTO_NEXT_TIMEOUT);
        }
    };

    const getStateToBeSaved = (gender = null) => {
        const caseReport = {...props.caseReport};
        if (gender) {
            // set gender from parameter (optional)
            caseReport.gender = gender;
        } else {
            caseReport.gender = selection;
        }
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.gender.title')}
            helpText={undefined}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <RadioButton.Group onValueChange={onSelect} value={selection}>
                {selectionOptions.map((item, index) => {
                    return (
                        <TouchableRipple key={index} onPress={() => onSelect(item.key)}>
                            <View style={styles.radioButtonItem}>
                                <RadioButton.Android value={item.key} />
                                <Text>{item.value}</Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </RadioButton.Group>
        </StepContainer>
    );
}

GenderStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
