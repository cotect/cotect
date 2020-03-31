import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, Portal, Text} from 'react-native-paper';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import ReportScreen from './ReportScreen';
import NewUserScreen from './NewUserScreen';
import AssesmentScreen from './AssesmentScreen';

import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

const styles = StyleSheet.create({});

function HomeScreen(props) {
    const {t} = useTranslation();
    const [isReportStarted, setReportStarted] = useState(false);
    const [caseReport, setCaseReport] = useState(props.caseReport);

    const reportSubmitted = () => {
        setReportStarted(false);
        props.increaseNumberOfReports();
    };

    const reportExited = () => {
        setReportStarted(false);
    };

    return (
        <Portal.Host>
            {isReportStarted ? (
                <ReportScreen
                    onSubmit={reportSubmitted}
                    onExit={reportExited}
                    numberOfReports={props.numberOfReports}
                />
            ) : (
                <View style={{flex: 1}}>
                    {caseReport ? (
                        <AssesmentScreen onUpdateReport={() => setReportStarted(true)} caseReport={props.caseReport} />
                    ) : (
                        <NewUserScreen onFinish={() => setReportStarted(true)} />
                    )}
                </View>
            )}
        </Portal.Host>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
