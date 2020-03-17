import React, { useState, useEffect } from 'react';

import { StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, View } from 'react-native';

import { Button, Card, Chip, Colors, Dialog, IconButton, Modal, Paragraph, Portal, Text, TextInput } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import RNGooglePlaces from 'react-native-google-places';

import auth from '@react-native-firebase/auth';

import { CalendarList } from 'react-native-calendars';

import { selectContactPhone } from 'react-native-select-contact';

import { CONTAINER } from '../assets/DefaultStyles';

// import {PhoneNumberStep} from './steps/PhoneNumberStep';


const styles = StyleSheet.create({
    container: CONTAINER,
    item: {},
    stepTitle: {
        // width: 201,
        color: "rgba(59,59,59,0.87)",
        fontSize: 25,
        fontFamily: "roboto-light",
        marginBottom: 16
    },
    inputField: {
        //width: 150
        // flex: 4
        // width: "75%"
        backgroundColor: "white"
    },
    stepList: {
        // bottom: 50
        // alignSelf: "flex-end"
        width: "100%",
        height: "100%"
        // position: "absolute",
        // bottom: 56,
        // height: "20%"
    },
    listWrapper: {
        width: "75%",
        position: "absolute",
        bottom: 56,
        height: "100%"
    },
    step: {
        marginLeft: 24,
        marginTop: 96,
        width: "90%"
        // position: "absolute",
        // bottom: 48,
        // height: 50
        // alignSelf: "flex-end"
    },
    scrollViewContentContainer: {
        height: "80%"
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: 'space-between',
        flexGrow: 1,
        // height: "80%",
        // width: "100%"
    },
    chip: {
        marginBottom: 8,
        marginRight: 8,
        // width: 100,
        // height: 100
    },
    backButton: {
        position: "absolute",
        bottom: 24,
        left: 24
        // flex: 1
    },
    nextButton: {
        // width: 100
        // flex: 1
        position: "absolute",
        bottom: 24,
        right: 24
        // flex: 1
    },
    row: {
        alignItems: "center",
        flexDirection: "row"
    },
    coloredText: {
        color: "rgba(50,20,190,1)"
    },
    actionButton: {
        // width: "80%",
        borderRadius: 32,
        // borderColor: ACTIVE_COLOR,
        borderColor: "rgba(50,20,190,1)",
        borderWidth: 1,
        marginTop: 8,
        padding: 2
    },
    actionButtonContent: {
        padding: 2
    },
    actionButtonLabel: {
        fontSize: 12
    },
    itemList: {
        width: "90%", alignSelf: "center"
    },
    cardItem: {
        marginBottom: 8
    },
  });

function Step(props) {

    const [isModalVisible, setModalVisible] = useState(false);

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    props.stepItem.helpText = props.stepItem.helpText || "Lorem ipsum";
    
    return (
        <View style={{...styles.step}}>
            <View>
                <Text style={styles.stepTitle}>
                    {props.stepItem.title}
                    {/* <TouchableOpacity> */}
                    <Icon name="help-circle-outline" 
                        size={25} 
                        borderWidth={2}
                        padding={5}
                        onPress={_showDialog}
                    />
                    {/* </TouchableOpacity> */}
                    {/* <IconButton icon="camera" size={25} color={Colors.red500}/> */}
                </Text>

            </View>
            {/* <View style={styles.row}> */}
            {<props.stepItem.element {...props} />}
            {/* </View> */}

            <Portal>
                <Dialog
                    visible={isModalVisible}
                    onDismiss={_hideDialog}>
                    <Dialog.Title>Help</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{props.stepItem.helpText}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={_hideDialog}
                        >
                            Got it!
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

function PhoneNumberStep(props) {
    const [isVerified, setIsVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [confirmationCode, setConfirmationCode] = useState();
    const [isPhoneNumberEntered, setPhoneNumberEntered] = useState(false);
    const [confirmation, setConfirmation] = useState();

    //let confirmation = null;
    const onVerifyClick = async () => {
        let confirmationResponse = await auth().signInWithPhoneNumber(phoneNumber);
        setPhoneNumberEntered(true);
        setConfirmation(confirmationResponse);
    }

    const onConfirmClick = async () => {
        try {
            await confirmation.confirm(confirmationCode); // User entered code
            // Successful login - onAuthStateChanged is triggered
        } catch (e) {
            console.error(e); // Invalid code
        }
    }

    const onAuthStateChanged = (user) => {
        console.log(user);
        if (user) {
            user.getIdToken().then(token => console.log("token", token));
            setIsVerified(true);
            props.stepItem.onFinish(user, true);
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount 
    }, []);

    return (
        <View>
            {!isVerified ? (
                <View>
                    <TextInput
                        style={styles.inputField}
                        label='Phone Number'
                        value={phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                    />
                    <Button
                        style={styles.actionButton}
                        labelStyle={styles.actionButtonLabel} 
                        onPress={() => onVerifyClick()}>
                        Verify
                    </Button>

                    {isPhoneNumberEntered ? (
                        <View>
                            <TextInput
                                style={styles.inputField}
                                label='Confirmation Code'
                                value={confirmationCode}
                                onChangeText={text => setConfirmationCode(text)}
                            />
                            <Button
                                style={styles.actionButton}
                                labelStyle={styles.actionButtonLabel} 
                                onPress={() => onConfirmClick()}>
                                Confirm
                            </Button>
                        </View>
                        ) : false
                    }
                    </View>) : 
               
                    <Text>Phone Number is verified!</Text>
                }
        </View>
    )
}

function AgeStep(props) {
    // since the props are used as initial value, we would not necessarily need an own state here, as the initial state is only considered for the first call.
    // However, even if setAge will be called with the same value two times, the component will not re-render again (https://reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)
    const [age, setAge] = useState(props.stepItem.initialProps);

    let onChangeText = (input) => {
        setAge(input);
        const nextEnabled = (input && input.length > 0) ? true : false;
        props.stepItem.onFinish(input, nextEnabled);
    }

    return (
        <View>
            <TextInput
                style={styles.inputField}
                label='Age'
                value={age}
                onChangeText={text => onChangeText(text)}
            />
        </View>
    )
}

function TemperatureStep(props) {
    const [temperature, setTemperature] = useState(props.stepItem.initialProps);

    let onChangeText = (input) => {
        setTemperature(input);
        const nextEnabled = (input && input.length > 0) ? true : false;
        props.stepItem.onFinish(input, nextEnabled);
    }

    return (
        <View>
            <TextInput
                style={styles.inputField}
                label='Temperature'
                value={temperature}
                onChangeText={text => onChangeText(text)}
            />
        </View>
    );
}

function SymptomsStep(props) {
    let symptoms = ["Fever", "Headache", "Cough", "Fever", "Headache", "Cough", "Fever", "Headache", "Cough", "Fever", "Headache", "Cough", "Fever", "Headache", "Cough"];
    symptoms = [...symptoms, ...symptoms, ...symptoms, ...symptoms];
    const [selectedSymptoms, setSelectedSymptoms] = useState(props.stepItem.initialProps || []);

    const onSelect = (item, index) => {
        let modifiedSelectedSymptoms = [...selectedSymptoms];
        let elementIndex = modifiedSelectedSymptoms.indexOf(index);
        if (elementIndex > -1) {
            modifiedSelectedSymptoms.splice(elementIndex, 1);
        } else {
            modifiedSelectedSymptoms.push(index);
        }
        setSelectedSymptoms([...modifiedSelectedSymptoms]);

        const nextEnabled = (modifiedSelectedSymptoms.length > 0) ? true : false;
        props.stepItem.onFinish(modifiedSelectedSymptoms, nextEnabled);
    }

    return (
        <View>
            <ScrollView
                style={styles.scrollViewContentContainer} 
                contentContainerStyle={styles.chipsContainer}>
                {symptoms.map((item, key) => (
                    <Chip
                        style={styles.chip}
                        key={key} 
                        onPress={() => onSelect(item, key)}
                        selected={selectedSymptoms.indexOf(key) > -1 ? true : false}>
                            {item}
                    </Chip>
                ))}
            </ScrollView>
        </View>
    );
}

function CurrentLocationStep(props) {
    console.log("currentlocationstep", props);
    const [currentLocation, setCurrentLocation] = useState(props.stepItem.initialProps || {});
    console.log(currentLocation);
    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            setCurrentLocation(place);

            props.stepItem.onFinish(place, true);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => {
            setCurrentLocation({});
            props.stepItem.onFinish(currentLocation, false);
            console.log(error.message);
        });  // error is a Javascript Error object
    }

    return (
        <View>
            {/* <Text>{currentLocation.address}</Text> */}
            {currentLocation.address ?
                <Card 
                    style={styles.cardItem}
                >
                    <Card.Content>
                        <Paragraph>{currentLocation.address}</Paragraph>
                    </Card.Content> 
                </Card>
                : false 
            }
            <Button 
                mode="outlined"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => openPlacesSearchModal()}>
                Pick current location
            </Button>
        </View>
    )
}

function LocationsStep(props) {

    let localStyles = StyleSheet.create({
        
        dialogContent: {
            // height: "70%"
        },
        dialogLocation: {
            marginBottom: 16
        }
    });

    const [locationsAndDates, setLocationsAndDates] = useState(props.stepItem.initialProps || []);
    const [isModalVisible, setModalVisible] = useState(false);

    const [dialogLocation, setDialogLocation] = useState({});
    const [dialogSelectedDates, setDialogSelectedDates] = useState({});

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            setDialogLocation(place);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    let onDayPress = (day) => {
        let modifiedDialogSelectedDays = {...dialogSelectedDates};
        if (day.dateString in modifiedDialogSelectedDays) {
            delete modifiedDialogSelectedDays[day.dateString ];
        }
        else {
            modifiedDialogSelectedDays[day.dateString] = {
                selected: true,
                disableTouchEvent: false,
                selectedDotColor: 'orange',
                // set both to true so that it is marked correctly
                startingDate: true,
                endingDate: true,
                timestamp: day.timestamp
            }
        }
        setDialogSelectedDates(modifiedDialogSelectedDays);
    }

    let onAddPlace = (location, dates) => {
        let locationAndDates = {
            location: location,
            dates: dates
        }

        setDialogLocation({});
        setDialogSelectedDates({});
        locationAndDates = [...locationsAndDates, locationAndDates];
        setLocationsAndDates(locationAndDates);
        _hideDialog();

        const nextEnabled = (locationAndDates.length > 0) ? true : false;
        props.stepItem.onFinish(locationAndDates, nextEnabled);
    }

    return (
        <View>
            <View style={styles.itemList}>
                {locationsAndDates.map((item, index) => {
                    
                    let earliestDateKey;
                    let latestDateKey;
                    for (let key in item.dates) {
                        let date = item.dates[key];
                        if (earliestDateKey === undefined || date.timestamp < item.dates[earliestDateKey].timestamp) {
                            earliestDateKey = key; 
                        }
                        if (latestDateKey === undefined || date.timestamp > item.dates[latestDateKey].timestamp) {
                            latestDateKey = key;
                        }
                    }

                    return (
                        <Card 
                            key={index}
                            style={styles.cardItem}
                        >
                            <Card.Title 
                                title={item.location.address}
                                subtitle={earliestDateKey + " to " + latestDateKey}
                            />
                            {/* {Object.entries(item.dates).map(([key, value]) => (
                                <Text>{key}</Text>
                            ))} */}
                        </Card>
                    )
                })}

                <Button 
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => _showDialog()}>
                    Add a location
                </Button>
            </View>

            <Portal>
                <Dialog
                    style={{height: "80%"}}
                    visible={isModalVisible}
                    onDismiss={_hideDialog}>
                    <Dialog.Title>Location and Time</Dialog.Title>
                    {/* <Dialog.Content> */}
                        {/* <Paragraph>This is simple dialog</Paragraph> */}
                        <Dialog.ScrollArea>
                        <ScrollView style={localStyles.dialogContent}>
                            <View style={localStyles.dialogLocation}>
                                <Text>
                                    Location:  
                                    
                                </Text>
                                <Text 
                                        style={styles.coloredText}
                                        onPress={() => openPlacesSearchModal()}>
                                        {dialogLocation.address || "Click to pick a location"}
                                    </Text>
                                
                                {/* <Button
                                    style={styles.actionButton}
                                    labelStyle={styles.actionButtonLabel}
                                    onPress={() => openPlacesSearchModal()}>
                                    Pick a location
                                </Button> */}
                            </View>  
                            <View>
                                <Text>Select the dates on which you have been here:</Text>
                                <CalendarList
                                    // Max amount of months allowed to scroll to the past. Default = 50
                                    pastScrollRange={50}
                                    // Max amount of months allowed to scroll to the future. Default = 50
                                    futureScrollRange={50}
                                    // Enable or disable scrolling of calendar list
                                    scrollEnabled={true}
                                    
                                    horizontal={true}

                                    pagingEnabled={true}

                                    // Enable or disable vertical scroll indicator. Default = false
                                    showScrollIndicator={true}
                                    
                                    onDayPress={onDayPress}
                                    markedDates={dialogSelectedDates}
                                />
                            </View>
                        </ScrollView>
                        </Dialog.ScrollArea>
                        {/* <Text>Dates: {dialogDates}</Text>
                        <Button onPress={() => openCalendarModal()}>
                            Pick dates
                        </Button> */}
                    {/* </Dialog.Content> */}
                    <Dialog.Actions>
                        <Button
                            disabled={Object.keys(dialogLocation).length === 0}
                            onPress={() => onAddPlace(dialogLocation, dialogSelectedDates)}
                        >
                            Add
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

function NumberOfContactsStep(props) {
    let numberOfContacts = ["10", "10-50", ">50"];

    let initialSelected = numberOfContacts.indexOf(props.stepItem.initialProps);
    const [selected, setSelected] = useState(initialSelected);
    const onSelect = (item, index) => {
        setSelected(index);
        props.stepItem.onFinish(numberOfContacts[index], true);
    }

    return (
        <View>
            <View style={styles.chipsContainer}>
                {numberOfContacts.map((item, key) => (
                    <Chip
                        style={styles.chip}
                        key={key} 
                        onPress={() => onSelect(item, key)}
                        selected={key === selected}>
                            {item}
                    </Chip>
                ))}
            </View>
        </View>
    );
}


function ContactsStep(props) {

    const [selectedContacts, setSelectedContacts] = useState(props.stepItem.initialProps || []);

    let selectPhoneNumber = (number) => {
        const newSelectedContacts = [...selectedContacts, number];
        setSelectedContacts(newSelectedContacts);

        const nextEnabled = (selectedContacts.length > 0) ? true : false;
        props.stepItem.onFinish(newSelectedContacts, nextEnabled);
    }

    let getPhoneNumber = () => {
        return selectContactPhone()
            .then(selection => {
                if (!selection) {
                    return null;
                }
                
                let { contact, selectedPhone } = selection;
                // console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
                // return selectedPhone.number;
                selectPhoneNumber(selectedPhone.number);
            });  
    }

    return (
        <View>
            {/* <ScrollView>
                {selectedContacts.map((item, index) => (
                    <Text key={index}>{item}</Text>
                ))}
            </ScrollView> */}
            <View style={styles.itemList}>
                {selectedContacts.map((item, index) => {
                    return (
                        <Card 
                            key={index}
                            style={styles.cardItem}
                        >
                             <Card.Content>
                                <Paragraph>{item}</Paragraph>
                            </Card.Content> 
                        </Card>
                    )
                })}

                <Button
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    // contentStyle={styles.actionButtonContent}
                    onPress={() => getPhoneNumber()}
                >
                    Pick a Contact's Phone Number
                </Button>
            </View>
           
        </View>
    ); 
}

export default function ReportScreen() {
    // const [listItems, setListItems] = useState([{id: "1", title: "foo"}]);

    // let addItem = () => {
    //     setListItems([...listItems, {id: new String(listItems.length + 1), title: "foobar"}]);
    //     console.log(listItems);
    // }

    // function Item({ title }) {
    //     return (
    //       <View style={styles.item}>
    //         <Text style={styles.title}>{title}</Text>
    //       </View>
    //     );
    // }

    // const [stepItems, setStepItem] = useState([]);

    // let addStepItem = () => {
    //     console.log("foo", stepItems);
    //     setStepItem([{
    //         id: stepItems.length + 1, 
    //         item: <AgeStep />, 
    //         title: "What is your body temperature?",
    //         nextClick: () => {console.log("click"); addStepItem();}
    //     }, ...stepItems])
    // }
    
    // let removeStepItem = () => {
    //     stepItems.pop();
    //     setStepItem([...stepItems]);
    // }

    // // useEffect(() => {
    // //     addStepItem();
    // // }, []);

    // let listRef = null;

    const [stepIndex, setStepIndex] = useState(5);
    //const [isNextButtonEnabled, setNextButtonEnabled] = useState(false);
    // const [isBackButtonEnabled, setBackButtonEnabled] = useState(false);
    const [user, setUserPhoneNumber] = useState();
    const [age, setAge] = useState();
    const [temperature, setTemperature] = useState();

    const [symptoms, setSymptoms] = useState();
    const [currentLocation, setCurrentLocation] = useState();
    const [locations, setLocations] = useState();
    const [numberOfContacts, setNumberOfContacts] = useState();
    const [contacts, setContacts] = useState();

    const steps = [
        {
            title: "What is your phone number?",
            element: PhoneNumberStep,
            onFinish: (user, nextEnabled) => { setUserPhoneNumber(user); }, // setNextButtonEnabled(nextEnabled); },
            initialProps: user
        },
        {
            title: "What is your age?",
            helpText: "We need the age to...",
            element: AgeStep,
            onFinish: (age, nextEnabled) => { setAge(age);}, // setNextButtonEnabled(nextEnabled); },
            initialProps: age
        },
        {
            title: "What are your symptoms?",
            element: SymptomsStep,
            onFinish: (symptoms, nextEnabled) => { setSymptoms(symptoms); }, //setNextButtonEnabled(nextEnabled); },
            initialProps: symptoms
        },
        {
            title: "What is your temperature?",
            element: TemperatureStep,
            onFinish: (temperature, nextEnabled) => { setTemperature(temperature);}, // setNextButtonEnabled(nextEnabled); },
            initialProps: temperature
        },
        {
            title: "What is your current location?",
            element: CurrentLocationStep,
            onFinish: (location, nextEnabled) => { setCurrentLocation(location);}, // setNextButtonEnabled(nextEnabled); },
            initialProps: currentLocation
        },
        {
            title: "Where have you been?",
            element: LocationsStep,
            onFinish: (locations, nextEnabled) => { setLocations(locations);}, // setNextButtonEnabled(nextEnabled); },
            initialProps: locations
        },
        {
            title: "With how many persons did you have contact?",
            element: NumberOfContactsStep,
            onFinish: (numberOfContacts, nextEnabled) => { setNumberOfContacts(numberOfContacts); }, //setNextButtonEnabled(nextEnabled); },
            initialProps: numberOfContacts
        },
        {
            title: "Who had you contact with?",
            element: ContactsStep,
            onFinish: (contacts, nextEnabled) => { setContacts(contacts);}, // setNextButtonEnabled(nextEnabled); },
            initialProps: contacts
        },
    ];

    const nextStepItem = () => {
        const newStepIndex = stepIndex + 1;
        setStepIndex(newStepIndex);
        
        // if (!stepItem[newStepIndex].initialProps) {
        //     setNextButtonEnabled(false);
        // }
    }

    const prevStepItem = () => {
        const newStepIndex = stepIndex - 1;
        setStepIndex(newStepIndex);

        // if the input of the new view is not empty, keep the input text
        // if (!stepItem[newStepIndex].initialProps) {
        //     setNextButtonEnabled(false);
        // }
    }

    const submitReport = () => {
        // execute call to firebase
    }

    let isBackButtonEnabled = (stepIndex > 0) ? true : false;
    let isNextButtonEnabled = (steps[stepIndex].initialProps) ? true : false;
    console.log(stepIndex, steps.length);
    return (
        // Portal.Host is used so that the dialogs appear correctly on top of the screen
        <Portal.Host>
            <View style={styles.container}>
                {
                    <Step
                        stepItem={steps[stepIndex]}
                    />
                }

                <Button
                        style={styles.backButton}
                        disabled={!isBackButtonEnabled}
                        onPress={() => prevStepItem()}
                    >
                        Previous
                </Button>

                {(stepIndex < steps.length - 1) ?
                    <Button
                            style={styles.nextButton}
                            // disabled={!isNextButtonEnabled}
                            onPress={() => nextStepItem()}
                        >
                            {isNextButtonEnabled ? "Next" : "Skip"}
                    </Button>
                : 
                    <Button
                        style={styles.nextButton}
                        disabled={false}
                        onPress={() => submitReport()}
                    >
                        Submit Report
                    </Button>
                }
                {/* </View> */}
            </View>
        </Portal.Host>      
    );
}
