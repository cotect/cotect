import React, { useEffect, useState } from 'react';

import auth from '@react-native-firebase/auth';

import {useTranslation} from 'react-i18next';

import { StyleSheet, View } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
    actionButton: {
        borderRadius: 32,
        borderColor: "rgba(50,20,190,1)",
        borderWidth: 1,
        marginTop: 8,
        padding: 2
    },
    actionButtonLabel: {
        fontSize: 12
    },
    inputField: {
        backgroundColor: "white"
    },
    snackbar: {
        backgroundColor: "red",
        position: "absolute",
        bottom: -48
    }
});

export default function PhoneNumberStep(props) {
    const {t} = useTranslation();

    const [isVerified, setIsVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [confirmationCode, setConfirmationCode] = useState();
    const [isPhoneNumberEntered, setPhoneNumberEntered] = useState(false);
    const [confirmation, setConfirmation] = useState();

    const [isSnackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState();

    const onVerifyClick = async () => {
        let confirmationResponse = await auth().signInWithPhoneNumber(phoneNumber);
        setPhoneNumberEntered(true);
        setConfirmation(confirmationResponse);
    }

    const onSignInAnonymously = async () => {
        if (auth().currentUser === null) {
            try {
                await auth().signInAnonymously();
            } catch (e) {
                switch (e.code) {
                    case 'auth/operation-not-allowed':
                    console.log('Enable anonymous in your firebase console.');
                    break;
                    default:
                    console.error(e);
                    break;
                }
            }
        }
    }

    const onConfirmClick = async () => {
        try {
            await confirmation.confirm(confirmationCode); // User entered code
            // Successful login - onAuthStateChanged is triggered
        } catch (e) {
            setSnackbarText("Confirmation code not valid");
            setSnackbarVisible(true);
        }
    }

    const onAuthStateChanged = (user) => {       
        if (user) {
            // user.delete();
            // user.getIdToken(true).then((e)=>console.log(e)).catch((e) => console.log(e));
            setIsVerified(true);
            let phoneNumber = user.phoneNumber;
            if (user.isAnonymous && user.phoneNumber === null) {
                phoneNumber = "anonymous";
            }
            props.stepItem.onFinish(phoneNumber, user);
        } else {
            setIsVerified(false);
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount 
    }, []);

    useEffect(() => {
        props.registerCleanupCallback(onSignInAnonymously);
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
                        {t('actions.verify')}
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
                                {t('actions.confirm')}
                            </Button>
                        </View>
                        ) : false
                    }
                    </View>) : 
                
                    <Text>{t('report.phoneNumber.numberVerified')}</Text>
                }
            <Snackbar
                style={styles.snackbar}
                visible={isSnackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
            >
                <Text style={styles.snackbarText}>{snackbarText}</Text>
            </Snackbar>
        </View>
    )
}
