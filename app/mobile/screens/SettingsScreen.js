import React, { useState } from "react";
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

    return (
        <View style={styles.container}>
            <TextInput
                label='Phone Number'
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
            />
            <Button onPress={() => confirmation = auth().signInWithPhoneNumber(phoneNumber)}>
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
