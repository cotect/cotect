import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';

import {RadioButton, Text, TouchableRipple} from 'react-native-paper';

import StepContainer from './StepContainer';

import {AUTO_NEXT_ENABLED, AUTO_NEXT_TIMEOUT} from '../../constants/Configuration';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default function CovidContactStep(props) {
    const {t} = useTranslation();

    const selectionOptions = [
        {key: 'true', value: t('basics.yes')},
        {key: 'false', value: t('basics.no')},
    ];

    const [selection, setSelection] = useState(props.caseReport.covid_contact !== undefined && props.caseReport.covid_contact !== null ? String(props.caseReport.covid_contact) : undefined);

    const onSelect = item => {
        setSelection(item);
        if (AUTO_NEXT_ENABLED) {
            setTimeout(() => {
                 // onNext is triggers faster then the state change?
                props.onNext(getStateToBeSaved(item));
            }, AUTO_NEXT_TIMEOUT);
        }
    };

    const getStateToBeSaved = (status = null) => {
        const caseReport = {...props.caseReport};

        if (status == null) {
            status = selection;
        }

        if (status === 'true') {
            caseReport.covid_contact = true; 
        }

        if (status === 'false') {
            caseReport.covid_contact = false; 
        }

        caseReport.covid_contact = status;
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.covidContact.title')}
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

CovidContactStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
