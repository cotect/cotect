import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View, ScrollView} from 'react-native';

import {List, Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

import StepContainer from './StepContainer';

import {CARD_ITEM, ACTION_BUTTON, ACTION_BUTTON_LABEL} from '../../constants/DefaultStyles';

import ReportSummaryCard from '../../components/ReportSummaryCard';

const styles = StyleSheet.create({
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL
});

export default function ReportSubmitStep(props) {
    const {t} = useTranslation();

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        // TODO
        return caseReport;
    };

    const scrollViewRef = React.createRef();
    return (
        <StepContainer
            title={t('report.submitReport.title')}
            helpText={t('report.help.defaultText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}
            nextButtonLabel="Submit"
        >
            <View style={{justifyContent: 'flex-end'}}>
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    onContentSizeChange={(width, height) => {
                        scrollViewRef.current.scrollToEnd({animated: true});
                    }}
                    ref={scrollViewRef}
                    onLayout={e => scrollViewRef.current.scrollToEnd({animated: true})}>
                <ReportSummaryCard
                    caseReport={props.caseReport}
                />
            </ScrollView>
            </View>
            <Button
                mode="outlined"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => props.onNext(getStateToBeSaved())}
            >
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
