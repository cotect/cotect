import React, {useState, useMemo} from 'react';

import {StyleSheet, View, SafeAreaView, BackHandler} from 'react-native';

import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Button, Dialog, Paragraph, Portal, Text, ProgressBar} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {COTECT_BACKEND_URL} from 'react-native-dotenv';

import {CONTAINER, REPORTING_BACKGROUND} from '../constants/DefaultStyles';
import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

import {ApiClient as CotectApiClient, ReportsApi, CaseReport} from '../client/cotect-backend/index';

import {
    AgeStep,
    PhoneNumberStep,
    PlacesStep,
    ContactsStep,
    ResidenceStep,
    GenderStep,
    CovidTestedStep,
    CovidContactStep,
    SymptomsDateStep,
    SymptomsStep,
    ReportSubmitStep
} from './steps/index';

const styles = StyleSheet.create({
    container: CONTAINER,
    closeButton: {
        left: 24,
        top: 24,
    },
});

function ReportScreen(props) {
    const {t} = useTranslation();
    const [stepIndex, setStepIndex] = useState(0);

    const [caseReport, setCaseReport] = useState(new CaseReport());

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState();
    const [modalText, setModalText] = useState();
    const [modalButtonText, setModalButtonText] = useState('Ok');
    // a function in useState must return the function, otherwise it is directly executed (https://stackoverflow.com/a/55621325/5379273):
    const [onModalClick, setOnModalClick] = useState(() => () => {});
    const _hideDialog = () => setModalVisible(false);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
        handleBackCallback(caseReport);
        return true;
    });

    const handleNextCallback = caseReport => {
        let newStepIndex = stepIndex;
        newStepIndex = newStepIndex + 1;
        setCaseReport(caseReport);
        setStepIndex(newStepIndex);
    };

    const handleBackCallback = caseReport => {
        if (stepIndex === 0) {
            // This is the first step, exit the report
            exitReport();
        } else {
            let newStepIndex = stepIndex;
            newStepIndex = newStepIndex - 1;
            setCaseReport(caseReport);
            setStepIndex(newStepIndex);
        }
    };

    const availableSteps = [
        <SymptomsStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
            hideBackButton={true}
        />,
        <SymptomsDateStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <CovidTestedStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <CovidContactStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <ResidenceStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <PlacesStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <ContactsStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <AgeStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <GenderStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <PhoneNumberStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
        />,
        <ReportSubmitStep
            caseReport={caseReport}
            onNext={caseReport => handleNextCallback(caseReport)}
            onBack={caseReport => handleBackCallback(caseReport)}
            hideNextButton={true}
        />
    ];

    const steps = useMemo(() => {
        return availableSteps.filter(step => {
            return props.numberOfReports === 0 || !step.isPermanentSetting;
        });
    });

    const submitReport = () => {
        // TODO refactor!
        props.setPhoneNumber(user);
        props.setResidence(currentLocation);
        props.setAge(age);
        props.setGender(gender);

        // show a dialog with more information about the submitted report
        setModalTitle(t('report.submit.title'));
        setModalText(t('report.submit.text')); // replace text upon answer of the server
        setModalButtonText(t('report.submit.primaryAction'));
        setModalVisible(true);

        let createCaseReport = () => {
            let caseReport = new CaseReport();
            caseReport.age = age;
            if (!age) {
                caseReport.age = 0;
            } else {
                caseReport.age = parseInt(age);
            }

            caseReport.gender = gender;
            // gender must not be empty
            if (!caseReport.gender || caseReport.gender === '') {
                caseReport.gender = 'other';
            }

            caseReport.residence = currentLocation;
            caseReport.residence.place_id = caseReport.residence.placeId;
            // place_id must exist, otherwise whole residence cannot be set
            if (!caseReport.residence.place_id) {
                caseReport.residence = undefined;
            }

            caseReport.covid_test = covidTestStatus || 'not-tested';
            caseReport.covid_contact = hadCovidContact || false;

            let transformedSymptoms = [];
            for (let i in symptoms) {
                transformedSymptoms.push(symptoms[i]);
            }

            caseReport.symptoms = transformedSymptoms;
            if (caseReport.symptoms) {
                caseReport.symptoms = caseReport.symptoms.map(symptom => {
                    symptom.symptom_name = symptom.name;
                    return symptom;
                });
            }

            caseReport.places = locations;
            if (caseReport.places) {
                caseReport.places = caseReport.places.map(place => {
                    place.place_id = place.placeId;
                    return place;
                });
            }

            caseReport.contacts = contacts;
            if (caseReport.contacts) {
                caseReport.contacts = caseReport.contacts.map(contact => {
                    contact.phone_number = contact.phoneNumber;
                    contact.contact_date = contact.contactDate;
                    return contact;
                });
            }

            return caseReport;
        };

        // simulate call to backend
        // setTimeout(() => {
        //     setModalText(t('report.submit.successText'));
        //     setModalButtonText(t('report.submit.exitAction'));
        //     // TODO: button text should not be "Submit" here
        //     setOnModalClick(() => () => props.onSubmit());
        // }, 1000);

        let caseReport = createCaseReport();

        const cotectApiClient = new CotectApiClient();
        // cotectApiClient.authentications['APIKeyHeader'].apiKey = props.authToken;
        cotectApiClient.authentications['HTTPBearer'].accessToken = props.authToken;
        //cotectApiClient.authentications['APIKeyQuery'].apiKey = props.authToken;
        cotectApiClient.basePath = COTECT_BACKEND_URL;
        new ReportsApi(cotectApiClient).updateReport(caseReport, (error, data, response) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Sending report was successful!');
                setModalText(t('report.submit.successText'));
                setModalButtonText(t('report.submit.exitAction'));
                setOnModalClick(() => () => props.onSubmit());
            }
        });
    };

    const exitReport = () => {
        setModalTitle(t('report.exit.title'));
        setModalText(t('report.exit.text'));
        setModalButtonText(t('report.exit.primaryAction'));
        setOnModalClick(() => () => props.onExit());
        setModalVisible(true);
    };

    let step = steps[stepIndex];
    return (
        // Portal.Host is used so that the dialogs appear correctly on top of the screen
        <SafeAreaView style={{height: '100%', flex: 1, backgroundColor: REPORTING_BACKGROUND}}>
            <View style={{justifyContent: 'flex-start', flexDirection: 'column', flexGrow: 0.25}}>
                <ProgressBar progress={(stepIndex + 1) / steps.length} />
                <Icon
                    name="close"
                    size={25}
                    borderWidth={2}
                    padding={5}
                    style={styles.closeButton}
                    onPress={exitReport}
                />
            </View>
            <View style={{justifyContent: 'flex-end', flexDirection: 'column', flex: 1}}>
                {step}
            </View>
            <Portal>
                <Dialog visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{modalTitle}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{modalText}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => {
                                onModalClick();
                            }}>
                            {modalButtonText}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
