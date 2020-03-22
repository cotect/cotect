import React, {useState} from 'react';

import {StyleSheet, ScrollView, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import {Button, Chip, Dialog, Portal, RadioButton, Text, TextInput} from 'react-native-paper';

import {CalendarList} from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    chipsContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        flexGrow: 1,
        height: 150,
    },
    chip: {
        marginBottom: 8,
        marginRight: 8,
    },
    inputField: {
        backgroundColor: 'white',
    },
});

const InputElement = props => {
    const [value, setValue] = useState();

    const onChangeText = input => {
        setValue(input);
        props.setValue(input);
    };

    return (
        <TextInput
            style={styles.inputField}
            label={props.label}
            value={value}
            onChangeText={onChangeText}></TextInput>
    );
};

const SelectionElement = props => {
    const {t} = useTranslation();
    const selections = props.selections;

    const [selected, setSelected] = useState();

    const onSelect = selection => {
        setSelected(selection);
        props.setValue(selection);
    };

    return (
        <View>
            <Text>{t('report.symptoms.severity')}</Text>
            <RadioButton.Group
                onValueChange={onSelect}
                value={selected}
                style={styles.chipsContainer}>
                {selections.map((selection, index) => {
                    return (

                        <RadioButton.Item
                            key={index}
                            label={selection}
                            value={selection}
                            // status={selected === {selection} ? 'checked' : 'unchecked'}
                            // onPress={() => onSelect(selection)}
                        />
                    );
                })}
            </RadioButton.Group>
        </View>
    );
};

export default function SymptomsStep(props) {
    const {t} = useTranslation();

    let symptoms = [
        {name: 'Fever', severityElement: props => <InputElement label="Temperature" {...props} />},
        {
            name: 'Headache',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Cough',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
    ];

    // selectedSymptoms: {name: { name, severity, reportDate }}
    const [selectedSymptoms, setSelectedSymptoms] = useState(props.stepItem.initialProps || {});
    const [firstOccuredDate, setFirstOccuredDate] = useState({});

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState({});
    const [dialogType, setDialogType] = useState();
    const [dialogTitle, setDialogTitle] = useState();
    const [dialogSeverity, setDialogSeverity] = useState();

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const onAdd = (symptom, dialogSeverity) => {
        let modifiedSelectedSymptoms = {...selectedSymptoms};
        if (symptom.name in modifiedSelectedSymptoms) {
            delete modifiedSelectedSymptoms[symptom.name];
        } else {
            modifiedSelectedSymptoms[symptom.name] = {name: symptom.name, severity: dialogSeverity};
        }

        for (let i in modifiedSelectedSymptoms) {
            modifiedSelectedSymptoms[i].reportDate = firstOccuredDate.timestamp;
        }

        setSelectedSymptoms(modifiedSelectedSymptoms);
        props.stepItem.onFinish(modifiedSelectedSymptoms);

        resetSelection();
    };

    const resetSelection = () => {
        setSelectedSymptom({});
        setDialogSeverity();
        setDialogType();
    };

    const cancelSelectionDialog = () => {
        _hideDialog();
        resetSelection();
    };

    const onDialogPress = () => {
        if (dialogType === 'severity') {
            onAdd(selectedSymptom, dialogSeverity)
        }
    }

    const showSymptomDialog = symptom => {
        setSelectedSymptom(symptom);
        setDialogType('severity');
        setDialogTitle(symptom.name);
        _showDialog();
    };

    const showCalendarDialog = () => {
        setDialogType('calendar');
        setDialogTitle('Day of First Occurence');
        _showDialog();
    }

    const renderSymptomSeverityElement = (selectedSymptom, setValue) => {
        for (let i in symptoms) {
            const symptom = symptoms[i];
            if (symptom.name === selectedSymptom.name && symptom.severityElement) {
                return symptom.severityElement({setValue: setValue});
            }
        }

        return <View></View>;
    };

    const renderCalendar = () => {
        const onDayPress = (day) => {
            setFirstOccuredDate(day);
            _hideDialog();
        }

        return (
            <CalendarList
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={1}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={0}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                horizontal={true}
                // pagingEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
                onDayPress={onDayPress}
                // markedDates={dialogDay}
            />
        );
    };

    return (
        <View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}>
                {symptoms.map((symptom, key) => {
                    const isSelected = symptom.name in selectedSymptoms ? true : false;
                    return (
                        <Chip
                            style={styles.chip}
                            key={key}
                            onPress={() => {
                                !isSelected ? showSymptomDialog(symptom) : onAdd(symptom);
                            }} // when the symptom is already selected, deselect it on press
                            selected={isSelected}>
                            {symptom.name}
                        </Chip>
                    );
                })}
            </ScrollView>

            <View>
                <TouchableOpacity
                     onPress={() => showCalendarDialog()}
                >
                    <TextInput 
                        style={styles.inputField}
                        label="First Occurence"
                        value={firstOccuredDate && firstOccuredDate.dateString}
                        editable={false}
                        mode="outlined"
                    />
                </TouchableOpacity>
            </View>

            <Portal>
                <Dialog visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{dialogTitle}</Dialog.Title>
                    <Dialog.Content>
                        {(dialogType === 'severity') ? 
                            renderSymptomSeverityElement(selectedSymptom, severity => setDialogSeverity(severity))
                            : renderCalendar()
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={cancelSelectionDialog}>Cancel</Button>
                        {(dialogType === 'severity') ? 
                            <Button
                                onPress={() => {
                                    onDialogPress();
                                    _hideDialog();
                                }}>
                                Add
                            </Button>
                            : false
                        }
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
