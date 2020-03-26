import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

import StepContainer from './StepContainer';

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: 'white',
    },
});

export default function AgeStep(props) {
    const {t} = useTranslation();
    // since the props are used as initial value, we would not necessarily need an own state here, as the initial state is only considered for the first call.
    // However, even if setAge will be called with the same value two times, the component will not re-render again (https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)
    const [age, setAge] = useState(props.caseReport.age);

    let onChangeText = input => {
        setAge(input);
    };

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.age = age;
        return caseReport;
    };

    return (
        <StepContainer
            title={t('report.age.title')}
            helpText={t('report.age.helpText')}
            onFinish={() => props.onFinish(getStateToBeSaved())}
            onExit={() => props.onExit(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <TextInput
                style={styles.inputField}
                label={t('report.age.inputLabel')}
                value={age}
                onChangeText={text => onChangeText(text)}
            />
        </StepContainer>
    );
}

AgeStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
