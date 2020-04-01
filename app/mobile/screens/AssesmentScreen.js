import React from 'react';
import {StyleSheet, View, Image, Text, ScrollView, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import Share from 'react-native-share';

import {Avatar, Button, Surface, Card, IconButton, Paragraph, Appbar} from 'react-native-paper';

import {
    DEFAULT_BACKGROUND,
    ACTION_BUTTON,
    ACTION_BUTTON_LABEL,
    REPORTING_BACKGROUND,
} from '../constants/DefaultStyles';

import InfectionRiskCard from '../components/InfectionRiskCard';
import ReportSummaryCard from '../components/ReportSummaryCard';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: REPORTING_BACKGROUND,
    },
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    image: {
        width: 160,
        height: 60,
        marginTop: 14,
        alignSelf: 'center',
        justifyContent: 'flex-start',
    },
    scrollContainers: {
        //width: '95%',
        flex: 1,
        //justifyContent: 'flex-end',
        //marginBottom: 16,
        alignSelf: 'center',
    },
});

export default function AssesmentScreen(props) {
    const {t} = useTranslation();

    const openShare = () => {
        Share.open({
            //subject: "Cotect Subject",
            title: t('sharing.title'),
            message: t('sharing.message'),
            url: t('sharing.url'),
            showAppsToView: true,
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                err && console.log(err);
            });
    };

    const scrollViewRef = React.createRef();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.scrollContainers}>
                <ScrollView
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'column'}}>
                        <Image
                            source={require('../assets/images/cotect-banner.png')}
                            resizeMode="contain"
                            style={styles.image}></Image>
                    </View>
                    <ReportSummaryCard 
                    style={{marginRight: 14, marginLeft: 14}}
                    showActions={true} 
                    onUpdateAction={() => props.onUpdateReport()}
                    //onDeleteAction={}
                    caseReport={props.caseReport} />
                    <InfectionRiskCard 
                    style={{marginRight: 14, marginLeft: 14}}
                    />
                    <ScrollView
                        contentContainerStyle={{
                            alignItems: 'center',
                            flexGrow: 1,
                            justifyContent: 'center',
                            marginLeft: 8,
                            marginRight: 8,
                        }}
                        style={{marginBottom: 16}}
                        horizontal={true}
                        alwaysBounceHorizontal={false}
                        showsHorizontalScrollIndicator={false}>
                        <Button
                            mode="outlined"
                            style={{...styles.actionButton, marginLeft: 4, marginRight: 4}}
                            labelStyle={styles.actionButtonLabel}
                            onPress={() => props.onUpdateReport()}>
                            {t('home.updateReportAction')}
                        </Button>
                        <Button
                            mode="outlined"
                            style={{...styles.actionButton, marginLeft: 4, marginRight: 4}}
                            labelStyle={styles.actionButtonLabel}
                            onPress={() => openShare()}>
                            {t('sharing.inviteAction')}
                        </Button>
                    </ScrollView>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

AssesmentScreen.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onUpdateReport: PropTypes.func.isRequired
};
