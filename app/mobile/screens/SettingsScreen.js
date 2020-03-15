import React, { useState, useEffect } from "react";
import {  StyleSheet, View } from 'react-native';

import { Button, TextInput } from 'react-native-paper';

import auth from '@react-native-firebase/auth';

import { CONTAINER } from '../assets/DefaultStyles';

const styles = StyleSheet.create({
    container: CONTAINER
  });


let confirmation = null;

export default function SettingsScreen() {

    const [phoneNumber, setPhoneNumber] = useState();
    const [confirmationNumber, setConfirmationNumber] = useState();
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
    }
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.log("Authenticate...");
        return subscriber; // unsubscribe on unmount
    }, []);

    async function onVerifyClick() {
        confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    }

    console.log(user);
    return (
        <View style={styles.container}>
            <TextInput
                label='Phone Number'
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
            />
            <Button onPress={() => onVerifyClick()}>
                Verify
            </Button>

            <TextInput
                label='Confirm Number'
                value={confirmationNumber}
                onChangeText={text => setConfirmationNumber(text)}
            />
            <Button onPress={() => confirmation.confirm(confirmationNumber)}>
                Confirm
            </Button>
        </View>
    );
}
