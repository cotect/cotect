import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import PropTypes from 'prop-types';

import { ACTIVE_COLOR, INACTIVE_COLOR } from '../assets/DefaultStyles';

const styles = StyleSheet.create({
    activeLabel: {
        backgroundColor: "transparent",
        color: ACTIVE_COLOR,
        paddingTop: 2,
        fontSize: 12,
        marginBottom: 3,
        fontFamily: "roboto-regular"
    },
    label: {
        backgroundColor: "transparent",
        color: INACTIVE_COLOR,
        paddingTop: 2,
        fontSize: 12,
        marginBottom: 3,
       fontFamily: "roboto-regular"
    }
});

export default function TabBarMaterialLabel(props) {
    return (
        <Text style={props.focused ? styles.activeLabel : styles.label}>
            {props.text}
        </Text>
    )
}

TabBarMaterialLabel.propTypes = {
    text: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired
}
