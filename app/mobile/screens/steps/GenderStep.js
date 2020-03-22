
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

export default function GenderStep(props) {

    let genders = ["male", "female", "other"];

    let initialSelected = genders.indexOf(props.stepItem.initialProps);
    const [selected, setSelected] = useState(initialSelected);
    const onSelect = (item, index) => {
        setSelected(index);
        props.stepItem.onFinish(genders[index], true);
    }

    return (
        <View>
            <View style={styles.chipsContainer}>
                {genders.map((item, key) => (
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
