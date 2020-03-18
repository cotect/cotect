
import React from 'react';

import { connect } from "react-redux";

import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { mapStateToProps, mapDispatchToProps } from '../redux/reducer';

const styles = StyleSheet.create({
    contentContainer: {
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    }
});

function SettingsScreen(props) {

    const deleteData = () => {
        props.deleteSettings();
    }

    return (
        <View style={styles.contentContainer}>
            <Text>Your data:</Text>
            <Text>Phone Number: {props.phoneNumber}</Text>
            <Text>Location: {props.residence}</Text>
            <Text>Age: {props.age}</Text>
            <Text>Gender: {props.gender}</Text>

            <Button
                // style={styles.deleteButton}
                onPress={deleteData}    
            >
                Delete my data!
            </Button>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
