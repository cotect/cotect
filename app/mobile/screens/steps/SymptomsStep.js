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

    let symptoms = [
        {name: "Fever", severitySettings: {minimumValue: 0, maximumValue: 10, step: 1}}, 
        {name: "Headache", severitySettings: ["mild", "moderate", "severe"]}, 
        {name: "Cough", severitySettings: ["mild", "moderate", "severe"]}
    ];

    // selectedSymptoms: [{ name, severity, reportDate }]
    const [selectedSymptoms, setSelectedSymptoms] = useState(props.stepItem.initialProps || {});
    const [firstOccuredDate, setFirstOccuredDate] = useState();

    const onSelect = (symptom, index) => {
        let modifiedSelectedSymptoms = {...selectedSymptoms};
        if (symptom.name in modifiedSelectedSymptoms) {
            delete modifiedSelectedSymptoms[symptom.name];
        } else {
            // TODO: set severity
            modifiedSelectedSymptoms[symptom.name] = { name: symptom.name, severity: "" }
        }

        for (let i in modifiedSelectedSymptoms) {
            modifiedSelectedSymptoms[i].reportDate = firstOccuredDate;            
        }

        setSelectedSymptoms(modifiedSelectedSymptoms);
        props.stepItem.onFinish(modifiedSelectedSymptoms);
    }

    // TODO: implement field where first occurrence can be set
    const onChangeFirstOccured = (firstOccuredDate) => {
        setFirstOccuredDate(input);
    }

    return (
        <View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}>
                {symptoms.map((symptom, key) => (
                    <Chip
                        style={styles.chip}
                        key={key} 
                        onPress={() => onSelect(symptom, key)}
                        selected={symptom.name in selectedSymptoms ? true : false}>
                            {symptom.name}
                    </Chip>
                ))}
            </ScrollView>
        </View>
    );
};
