import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';

import {RadioButton, Text, TouchableRipple} from 'react-native-paper';

import {CaseReport} from '../../client/cotect-backend/index';

import {AUTO_NEXT_ENABLED} from '../../constants/Configuration';

import StepContainer from './StepContainer';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default function CovidTestedStep(props) {
    const {t} = useTranslation();

    const selectionOptions = [
        {key: CaseReport.CovidTestEnum['not-tested'], value: t('report.covidTest.notTested')},
        {
            key: CaseReport.CovidTestEnum['tested-negative'],
            value: t('report.covidTest.testedNegative'),
        },
        {
            key: CaseReport.CovidTestEnum['tested-positive'],
            value: t('report.covidTest.testedPositive'),
        },
        {
            key: CaseReport.CovidTestEnum['tested-pending'],
            value: t('report.covidTest.testedPending'),
        },
    ];

    const [selection, setSelection] = useState(props.caseReport.covid_test);

    const onSelect = item => {
        setSelection(item);

        if (AUTO_NEXT_ENABLED) {
            // onNext is triggered faster then the state change?
            props.onNext(getStateToBeSaved(item));
        }
    };

    const getStateToBeSaved = (status = null) => {
        const caseReport = {...props.caseReport};
        if (status) {
            // set test status from parameter (optional)
            caseReport.covid_test = status;
        } else {
            caseReport.covid_test = selection;
        }
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.covidTest.title')}
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

CovidTestedStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
