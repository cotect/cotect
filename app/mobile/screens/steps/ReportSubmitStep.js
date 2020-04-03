import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation, Trans} from 'react-i18next';

import {StyleSheet, View, ScrollView, Linking} from 'react-native';

import {Checkbox, List, Avatar, Button, Card, Title, Paragraph, Text} from 'react-native-paper';

import {COTECT_PRIVACY_POLICY_URL} from 'react-native-dotenv';

import StepContainer from './StepContainer';

import {CARD_ITEM, ACTION_BUTTON, ACTION_BUTTON_LABEL} from '../../constants/DefaultStyles';

import ReportSummaryCard from '../../components/ReportSummaryCard';

import InfectionRiskCard from '../../components/InfectionRiskCard';

const styles = StyleSheet.create({
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    consentContainer: {
        flexDirection: "row",
        marginTop: 8,
        marginBottom: 8,
        width: "90%"
    }
});

export default function ReportSubmitStep(props) {
    const {t} = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConsentGiven, setConsentGiven] = useState(false);

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        // TODO
        return caseReport;
    };

    const submitReport = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            props.onNext(getStateToBeSaved());
        }, 2000);
    };

    const scrollViewRef = React.createRef();
    return (
        <StepContainer
            title={t('report.submitReport.title')}
            helpText={undefined}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}
            nextButtonLabel="Submit">
            <View style={{justifyContent: 'flex-end'}}>
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    onContentSizeChange={(width, height) => {
                        scrollViewRef.current.scrollToEnd({animated: true});
                    }}
                    ref={scrollViewRef}
                    onLayout={e => scrollViewRef.current.scrollToEnd({animated: true})}>
                    <ReportSummaryCard caseReport={props.caseReport} />
                </ScrollView>
            </View>
            <View style={styles.consentContainer}>
                <Checkbox.Android
                    status={isConsentGiven ? 'checked' : 'unchecked'}
                    onPress={() => setConsentGiven(!isConsentGiven)}
                />
                <Text>
                    <Trans t={t} i18nKey="report.submit.consent">
                        By submitting the report, you accept that your provided information are sent to the Cotect servers for further processing. You can read more in our <Text style={{color: 'blue'}} onPress={() => Linking.openURL(COTECT_PRIVACY_POLICY_URL)}>privacy policy</Text>.
                    </Trans>
                </Text>
            </View>

            <Button
                mode="outlined"
                disabled={!isConsentGiven || isSubmitting}
                loading={isSubmitting}
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => submitReport()}>
                {t('report.submitReport.action')}
            </Button>
        </StepContainer>
    );
}

ReportSubmitStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
