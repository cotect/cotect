import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';

import StepContainer from './StepContainer';

const styles = StyleSheet.create({});

export default function AgeStep(props) {
    const {t} = useTranslation();
    // since the props are used as initial value, we would not necessarily need an own state here, as the initial state is only considered for the first call.
    // However, even if setAge will be called with the same value two times, the component will not re-render again (https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)
    const [age, setAge] = useState(props.caseReport.age);
    const [isValid, setIsValid] = useState(true);

    let onChangeText = input => {
        if (input) {
            var ageNumber = parseInt(input);
            if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 130) {
                setIsValid(false);
            } else {
                setIsValid(true);
                setAge(ageNumber);
            }
        } else {
            // empty text field is also valid
            setIsValid(true);
            setAge(undefined);
        }
    };

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.age = age;
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.age.title')}
            helpText={undefined}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <TextInput
                mode="outlined"
                label={t('report.age.inputLabel')}
                value={age != undefined ? String(age) : ''}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={text => onChangeText(text)}
            />
            <HelperText type="error" visible={!isValid}>
                {t('report.age.validationText')}
            </HelperText>
        </StepContainer>
    );
}

AgeStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
