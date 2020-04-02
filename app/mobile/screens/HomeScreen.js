import React, {useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView} from 'react-native';
import {Button, Portal, Text, IconButton, Title, Paragraph, Headline} from 'react-native-paper';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import ReportScreen from './ReportScreen';
import NewUserScreen from './NewUserScreen';
import AssesmentScreen from './AssesmentScreen';
import AppIntroScreen from './AppIntroScreen';

import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

import {
    DEFAULT_BACKGROUND,
    PRIMARY_BACKGROUND_COLOR,
    PRIMARY_COLOR
} from '../constants/DefaultStyles';

const styles = StyleSheet.create({
});

export function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
}


function HomeScreen(props) {
    const {t} = useTranslation();
    const [isReportStarted, setReportStarted] = useState(false);
    const [hideAppIntro, setHideAppIntro] = useState(false);

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
                    {!isEmpty(props.caseReport) ? (
                        <AssesmentScreen
                            onUpdateReport={() => setReportStarted(true)}
                            caseReport={props.caseReport}
                        />
                    ) : (
                        <View style={{flex: 1}}>
                            {!hideAppIntro ? (
                                <AppIntroScreen
                                    onFinish={() => setHideAppIntro(true)}
                                />
                            ) : (
                                <NewUserScreen onFinish={() => setReportStarted(true)} />
                            )}
                        </View>
                    )}
                </View>
            )}
        </Portal.Host>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
