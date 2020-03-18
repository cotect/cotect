import React, { useEffect, useState } from 'react';

import auth from '@react-native-firebase/auth';

import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

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
    }
});

export default function PhoneNumberStep(props) {
    const [isVerified, setIsVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [confirmationCode, setConfirmationCode] = useState();
    const [isPhoneNumberEntered, setPhoneNumberEntered] = useState(false);
    const [confirmation, setConfirmation] = useState();

    const onVerifyClick = async () => {
        let confirmationResponse = await auth().signInWithPhoneNumber(phoneNumber);
        setPhoneNumberEntered(true);
        setConfirmation(confirmationResponse);
    }

    const onSignInAnonymously = async () => {
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
            user.getIdToken().then((e)=>console.log(e)).catch((e) => console.log(e));
            setIsVerified(true);
            props.stepItem.onFinish(user.phoneNumber, true);
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
                    <Button
                        style={styles.actionButton}
                        labelStyle={styles.actionButtonLabel} 
                        onPress={() => onSignInAnonymously()}>
                        Continue anonymously
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
