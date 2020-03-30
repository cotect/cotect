import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Paragraph, Portal} from 'react-native-paper';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import ReportScreen from '../screens/ReportScreen';

import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

const styles = StyleSheet.create({
    homeView: {
        backgroundColor: '#fff'
    },
    paragraphContainer: {
        height: '100%',
        margin: 16
    },
    paragraph: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
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

    const startButtonText =
        props.numberOfReports === 0 ? t('start.startReportAction') : t('start.updateReportAction');

    return (
        <Portal.Host>
            {isReportStarted ? (
                <ReportScreen
                    onSubmit={reportSubmitted}
                    onExit={reportExited}
                    numberOfReports={props.numberOfReports}
                />
            ) : (
                <View style={styles.homeView}>
                    <View style={styles.paragraphContainer}>
                        <Paragraph style={styles.paragraph}>{t('start.paragraph1')}</Paragraph>
                        <Paragraph style={styles.paragraph}>{t('start.paragraph2')}</Paragraph>
                        <Paragraph style={styles.paragraph}>{t('start.paragraph3')}</Paragraph>
                    </View>
                    <Button
                        style={{position: 'absolute', bottom: 16, alignSelf: 'center'}}
                        onPress={() => setReportStarted(true)}>
                        {startButtonText}
                    </Button>
                </View>
            )}
        </Portal.Host>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReportHandler);
