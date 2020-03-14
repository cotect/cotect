import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import PropTypes from 'prop-types';

import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { ACTIVE_COLOR, INACTIVE_COLOR } from '../assets/DefaultStyles';

const styles = StyleSheet.create({
    icon: {
        backgroundColor: "transparent",
        color: INACTIVE_COLOR,
        fontSize: 24,
        opacity: 0.8,
    },
    //        paddingBottom: 22
    activeIcon: {
        backgroundColor: "transparent",
        color: ACTIVE_COLOR,
        fontSize: 24,
        opacity: 0.8
    },
});


export default function TabBarMaterialIcon(props) {
    return (
        <MaterialCommunityIconsIcon
          name={props.name}
          style={props.focused ? styles.activeIcon : styles.icon}
        ></MaterialCommunityIconsIcon>
    );
}

TabBarMaterialIcon.propTypes = {
    name: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired
}
