import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Button, Portal, Text} from 'react-native-paper';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import Share from 'react-native-share';

import ReportScreen from './ReportScreen';

import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

import {DEFAULT_BACKGROUND, ACTION_BUTTON, ACTION_BUTTON_LABEL} from '../constants/DefaultStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DEFAULT_BACKGROUND,
    },
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    image: {
        width: 180,
        height: 180,
        marginTop: 57,
        alignSelf: 'center',
    },
    cotectLogo: {
        color: 'rgba(59,59,59,0.87)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 45,
        fontFamily: 'roboto-light',
        textAlign: 'center',
        marginTop: 8,
    },
    welcomeMessage: {
        color: 'rgba(59,59,59,0.87)',
        fontSize: 20,
        fontFamily: 'roboto-regular',
        textAlign: 'center',
        marginTop: 60,
        marginRight: 45,
        marginLeft: 45,
        alignSelf: 'center',
    },
});

function ReportHandler(props) {
    const {t} = useTranslation();
    const [isReportStarted, setReportStarted] = useState(false);

    const reportSubmitted = () => {
        setReportStarted(false);
        props.increaseNumberOfReports();
    };

    const reportExited = () => {
        setReportStarted(false);
    };

    const openShare = () => {
            Share.open({
                //subject: "Cotect Subject",
                title: t('sharing.title'),
                message: t('sharing.message'),
                url: t('sharing.url'),
                showAppsToView: true
            })
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    return (
        <Portal.Host>
            {isReportStarted ? (
                <ReportScreen
                    onSubmit={reportSubmitted}
                    onExit={reportExited}
                    numberOfReports={props.numberOfReports}
                />
            ) : (
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/cotect-logo.png')}
                        resizeMode="contain"
                        style={styles.image}></Image>
                    <Text style={styles.cotectLogo}>cotect</Text>
                    <Text style={styles.welcomeMessage}>
                        {t('home.welcomeMessage')}
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 36,}}>
                        <Button
                            mode="outlined"
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            onPress={() => setReportStarted(true)}>
                            {t('home.firstReportAction')}
                        </Button>
                        <Button
                            mode="outlined"
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            onPress={() => openShare()}>
                            {t('sharing.inviteAction')}
                        </Button>
                    </View>
                </View>
            )}
        </Portal.Host>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportHandler);
