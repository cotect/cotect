import React, {useState, useMemo} from 'react';

import {StyleSheet, View} from 'react-native';

import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Button, Dialog, Paragraph, Portal, Text, ProgressBar} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {COTECT_BACKEND_URL} from 'react-native-dotenv';

import {CONTAINER} from '../constants/DefaultStyles';
import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

import {NEXT_ACTION, BACK_ACTION} from '../components/BackNextButton';

import {
    ApiClient as CotectApiClient,
    ReportsApi,
    CaseReport,
    CaseSymptom,
    CasePlace,
    CaseContact,
    AdministrationApi,
} from '../client/cotect-backend/index';

import {
    AgeStep,
    ContactsStep,
    CurrentLocationStep,
    GenderStep,
    LocationsStep,
    PhoneNumberStep,
    SymptomsStep,
    CovidContactStep,
    CovidTestStep,
} from './steps/index';

import BackNextButton from '../components/BackNextButton';

const styles = StyleSheet.create({
    container: CONTAINER,
    closeButton: {
        position: 'absolute',
        left: 24,
        top: 24,
    },
});

function ReportScreen(props) {
    const {t} = useTranslation();
    const [stepIndex, setStepIndex] = useState(0);
    //const [isNextButtonEnabled, setNextButtonEnabled] = useState(false);
    // const [isBackButtonEnabled, setBackButtonEnabled] = useState(false);

    // const [user, setUserPhoneNumber] = useState(props.phoneNumber);
    // const [age, setAge] = useState(props.age);
    // const [gender, setGender] = useState(props.gender);
    // const [currentLocation, setCurrentLocation] = useState(props.residence);

    // symptoms: {symptomName: { symptomName, reportDate, severity }}
    // const [symptoms, setSymptoms] = useState();

    // locations: [{ placeId, visitDates, latitude, longitude, placeName, placeTypes }]
    // const [locations, setLocations] = useState();

    // const [hadCovidContact, setCovidContact] = useState();

    // const [covidTestStatus, setCovidTestStatus] = useState();

    // contacts: [{ phoneNumber, contactDate }]
    // const [contacts, setContacts] = useState();

    const [caseReport, setCaseReport] = useState(new CaseReport());

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState();
    const [modalText, setModalText] = useState();
    const [modalButtonText, setModalButtonText] = useState('Ok');
    const [onModalClick, setOnModalClick] = useState(() => () => {}); // a function in useState must return the function, otherwise it is directly executed (https://stackoverflow.com/a/55621325/5379273)
    const _hideDialog = () => setModalVisible(false);

    const NEXT_ACTION = 'next';
    const EXIT_ACTION = 'exit';

    const handleStepCallback = (caseReport, action) => {
        let newStepIndex = stepIndex;
        if (action === NEXT_ACTION) {
            newStepIndex = newStepIndex + 1;
        } else if (action === EXIT_ACTION) {
            newStepIndex = newStepIndex - 1;
        }
        setCaseReport(caseReport);
        setStepIndex(newStepIndex);
    };

    const availableSteps = [
        <PhoneNumberStep
            caseReport={caseReport}
            hideBackButton={true}
            onFinish={caseReport => handleStepCallback(caseReport, NEXT_ACTION)}
            onExit={caseReport => handleStepCallback(caseReport, EXIT_ACTION)}
        />,
        <AgeStep
            caseReport={caseReport}
            onFinish={caseReport => handleStepCallback(caseReport, NEXT_ACTION)}
            onExit={caseReport => handleStepCallback(caseReport, EXIT_ACTION)}
        />,
    ];

    const steps = useMemo(() => {
        return availableSteps.filter(step => {
            return props.numberOfReports === 0 || !step.isPermanentSetting;
        });
    }); //, []);

    const submitReport = () => {
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
        <Portal.Host>
            <View style={styles.container}>
                <ProgressBar progress={(stepIndex + 1) / steps.length} />

                {step}

                <Icon
                    name="close"
                    size={25}
                    borderWidth={2}
                    padding={5}
                    style={styles.closeButton}
                    onPress={exitReport}
                />

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
            </View>
        </Portal.Host>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
