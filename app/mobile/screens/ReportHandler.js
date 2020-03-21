import React, {useState} from 'react';

import {connect} from 'react-redux';

import ReportScreen from './ReportScreen';

import {View, StyleSheet} from 'react-native';

import {Button, Paragraph, Portal} from 'react-native-paper';

import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

const styles = StyleSheet.create({
    paragraphContainer: {
        height: '100%',
        margin: 16,
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
    const [isReportStarted, setReportStarted] = useState(false);

    const reportSubmitted = () => {
        setReportStarted(false);
        props.increaseNumberOfReports();
    };

    const reportExited = () => {
        setReportStarted(false);
    };

    const startButtonText = props.numberOfReports === 0 ? 'Start Report!' : 'Update Report';

    return (
        <Portal.Host>
            {isReportStarted ? (
                <ReportScreen
                    onSubmit={reportSubmitted}
                    onExit={reportExited}
                    numberOfReports={props.numberOfReports}
                />
            ) : (
                <View style={styles.paragraphContainer}>
                    <View>
                        <Paragraph style={styles.paragraph}>
                            When starting a report, you are going to be asked a few questions that
                            will help to figure out, on which areas a disease herd might exist and
                            who might be affected. You can exit the report any time without any data
                            stored or sent to our server, but of course for success it is critical
                            to have as many participants as possible.
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                            Each step provides a help icon to explain why we need that information.
                            In case you verify your phone number - which will help to make the data
                            more trustworthy - we will only store a secured hash of it on the server
                            and no other information that could identify you. You can request data
                            deletion any time in the settings screen.
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                            Thanks for supporting the cause against CoVid19 and we hope you will
                            soon be healthy again!
                        </Paragraph>
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
