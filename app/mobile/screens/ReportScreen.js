import React, {useState} from 'react';

import {StyleSheet, View} from 'react-native';

import {connect} from 'react-redux';

import {Button, Dialog, Paragraph, Portal, Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {CONTAINER} from '../constants/DefaultStyles';
import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';

import { DefaultApi as CotectApi, CaseReport, CaseSymptom, CasePlace, CaseContact } from '../client/cotect-backend/index';

import {
    AgeStep,
    ContactsStep,
    CurrentLocationStep,
    GenderStep,
    LocationsStep,
    NumberOfContactsStep,
    PhoneNumberStep,
    SymptomsStep,
    TemperatureStep,
} from './steps/index';

const styles = StyleSheet.create({
    container: CONTAINER,
    closeButton: {
        position: 'absolute',
        left: 24,
        top: 24,
    },
    stepTitle: {
        // width: 201,
        color: 'rgba(59,59,59,0.87)',
        fontSize: 25,
        fontFamily: 'roboto-light',
        marginBottom: 16,
    },
    step: {
        marginLeft: 24,
        marginTop: 96,
        width: '90%',
    },
    backButton: {
        position: 'absolute',
        bottom: 24,
        left: 24,
    },
    nextButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});

function Step(props) {
    const [isModalVisible, setModalVisible] = useState(false);

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    props.stepItem.helpText = props.stepItem.helpText || 'Lorem ipsum';

    return (
        <View style={{...styles.step, position: 'absolute', bottom: 90}}>
            <View>
                <Text style={styles.stepTitle}>
                    {props.stepItem.title}
                    <Icon
                        name="help-circle-outline"
                        size={25}
                        borderWidth={2}
                        padding={5}
                        onPress={_showDialog}
                    />
                </Text>
            </View>

            {<props.stepItem.element {...props} />}

            <Portal>
                <Dialog visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>Help</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{props.stepItem.helpText}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={_hideDialog}>Got it!</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

function ReportScreen(props) {
    const [stepIndex, setStepIndex] = useState(0);
    //const [isNextButtonEnabled, setNextButtonEnabled] = useState(false);
    // const [isBackButtonEnabled, setBackButtonEnabled] = useState(false);

    // set a Promise that, when called, directly resolves as default.
    // a component can register a callback here that is called when clicking on next to execute logic before the next logic is called
    // the function cleanupStep must return a promise
    const [cleanupStepCallback, setCleanupStepCallback] = useState(() => () =>
        new Promise(resolve => resolve()),
    );

    const [user, setUserPhoneNumber] = useState(props.phoneNumber);
    const [age, setAge] = useState(props.age);
    // TODO: add question for gender
    const [gender, setGender] = useState(props.gender);
    const [currentLocation, setCurrentLocation] = useState(props.residence);
    const [temperature, setTemperature] = useState();
    // symptoms: {symptomName: { symptomName, reportDate, severity }}
    const [symptoms, setSymptoms] = useState();

    // locations: [{ placeId, visitDates, latitude, longitude, placeName, placeTypes }]
    const [locations, setLocations] = useState();
    const [numberOfContacts, setNumberOfContacts] = useState();

    // contacts: [{ phoneNumber, contactDate }]
    const [contacts, setContacts] = useState();

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState();
    const [modalText, setModalText] = useState();
    const [modalButtonText, setModalButtonText] = useState('Ok');
    const [onModalClick, setOnModalClick] = useState(() => () => {}); // a function in useState must return the function, otherwise it is directly executed (https://stackoverflow.com/a/55621325/5379273)
    const _hideDialog = () => setModalVisible(false);

    const availableSteps = [
        {
            title: 'What is your phone number?',
            element: PhoneNumberStep,
            onFinish: user => {
                setUserPhoneNumber(user);
            },
            initialProps: user,
            isPermanentSetting: true,
        },
        {
            title: 'What is your age?',
            helpText: 'We need the age to...',
            element: AgeStep,
            onFinish: age => {
                setAge(age);
            },
            initialProps: age,
            isPermanentSetting: true,
        },
        {
            title: 'What is your biological gender?',
            helpText: undefined,
            element: GenderStep,
            onFinish: gender => {
                setGender(gender);
            },
            initialProps: gender,
            isPermanentSetting: true,
        },
        {
            title: 'What is your current location?',
            element: CurrentLocationStep,
            onFinish: location => {
                setCurrentLocation(location);
            },
            initialProps: currentLocation,
            isPermanentSetting: true,
        },
        {
            title: 'What are your symptoms?',
            element: SymptomsStep,
            onFinish: symptoms => {
                setSymptoms(symptoms);
            },
            initialProps: symptoms,
        },
        {
            title: 'What is your temperature?',
            element: TemperatureStep,
            onFinish: temperature => {
                setTemperature(temperature);
            },
            initialProps: temperature,
        },
        {
            title: 'Where have you been?',
            element: LocationsStep,
            onFinish: locations => {
                setLocations(locations);
            },
            initialProps: locations,
        },
        {
            title: 'With how many persons did you have contact?',
            element: NumberOfContactsStep,
            onFinish: numberOfContacts => {
                setNumberOfContacts(numberOfContacts);
            },
            initialProps: numberOfContacts,
        },
        {
            title: 'Who had you contact with?',
            element: ContactsStep,
            onFinish: contacts => {
                setContacts(contacts);
            },
            initialProps: contacts,
        },
    ];

    const getSelectedSteps = () => {
        let selectedSteps = [];
        for (let step in availableSteps) {
            let selectedStep = availableSteps[step];
            if (props.numberOfReports > 0 && selectedStep.isPermanentSetting) {
                continue;
            }
            selectedSteps.push(selectedStep);
        }

        return selectedSteps;
    };

    const nextStepItem = () => {
        const newStepIndex = stepIndex + 1;

        cleanupStepCallback().then(() => {
            setStepIndex(newStepIndex);
            setCleanupStepCallback(() => () => new Promise(resolve => resolve()));
        });

        // if (!stepItem[newStepIndex].initialProps) {
        //     setNextButtonEnabled(false);
        // }
    };

    const prevStepItem = () => {
        const newStepIndex = stepIndex - 1;
        setStepIndex(newStepIndex);

        // if the input of the new view is not empty, keep the input text
        // if (!stepItem[newStepIndex].initialProps) {
        //     setNextButtonEnabled(false);
        // }
    };

    const submitReport = () => {
        // TODO: save permanent entries only if changed
        props.setPhoneNumber(user);
        props.setResidence(currentLocation);
        props.setAge(age);
        props.setGender(gender);

        // show a dialog with more information about the submitted report
        setModalTitle('Report Submission');
        setModalText('We are submitting the report...'); // replace text upon answer of the server
        setModalButtonText('Submit');
        setModalVisible(true);

        // TODO: execute call to firebase
        
        let createCaseReport = () => {
            let caseReport = new  CaseReport();
            caseReport.age = age;
            caseReport.gender = gender;
            caseReport.residence = currentLocation;
            caseReport.covid_test = ""; // not asked yet
            caseReport.covid_contact = null; // not asked yet

            let transformedSymptoms = [];
            for (let i in symptoms) {
                transformedSymptoms.push(symptoms[i]);
            }

            caseReport.symptoms = transformedSymptoms;
            caseReport.places = locations;
            caseReport.contacts = contacts;

            return caseReport;
        }


         // simulate call to backend
        //  setTimeout(() => {
        //     setModalText('We submitted the report! Thanks for your help fighting CoVid!');
        //     setOnModalClick(() => () => props.onSubmit());
        // }, 1000);

        let caseReport = createCaseReport();
        new CotectApi().updateReportReportsPost(caseReport, (error, data, response) => {
            if (error) {
                console.log(error);
            } else {
                setModalText('We submitted the report! Thanks for your help fighting CoVid!');
                setOnModalClick(() => () => props.onSubmit());
            }
        });


    };

    const exitReport = () => {
        setModalTitle('Exit Report');
        setModalText('Do you really want to exit the report? It will not be saved.');
        setModalButtonText('Exit');
        setOnModalClick(() => () => props.onExit());
        setModalVisible(true);
    };

    // wrap the to-be-registered cleanupStepCallback in a promise so that
    // the child component can execute async code.
    const registerCleanupCallback = cleanupStepCallback => {
        setCleanupStepCallback(() => () =>
            new Promise(resolve => {
                resolve(cleanupStepCallback());
            }),
        );
    };

    const steps = getSelectedSteps();
    let isBackButtonEnabled = stepIndex > 0 ? true : false;
    let isNextButtonEnabled = steps[stepIndex].initialProps ? true : false;
    return (
        // Portal.Host is used so that the dialogs appear correctly on top of the screen
        <Portal.Host>
            <View style={styles.container}>
                {
                    <Step
                        stepItem={steps[stepIndex]}
                        registerCleanupCallback={registerCleanupCallback}
                    />
                }

                {/* Don't show the previous button for the first step */}
                {isBackButtonEnabled ? (
                    <Button
                        style={styles.backButton}
                        // disabled={!isBackButtonEnabled}
                        onPress={() => prevStepItem()}>
                        Previous
                    </Button>
                ) : (
                    false
                )}

                {stepIndex < steps.length - 1 ? (
                    <Button
                        style={styles.nextButton}
                        // disabled={!isNextButtonEnabled}
                        onPress={() => nextStepItem()}>
                        {isNextButtonEnabled ? 'Next' : 'Skip'}
                    </Button>
                ) : (
                    <Button
                        style={styles.nextButton}
                        disabled={false}
                        onPress={() => submitReport()}>
                        Submit Report
                    </Button>
                )}

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
