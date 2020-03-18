import React, { useState } from 'react';

import { StyleSheet, ScrollView, View } from 'react-native';

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

export default function SymptomsStep(props) {
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
                horizontal={true}
                showsHorizontalScrollIndicator={false}
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
};
