
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Chip } from 'react-native-paper';

const styles = StyleSheet.create({
    chipsContainer: {
        flexDirection: "column",
        flexWrap: "wrap",
        flexGrow: 1,
        height: 150
    },
    chip: {
        marginBottom: 8,
        marginRight: 8,
    },
});

export default function NumberOfContactsStep(props) {
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
};
