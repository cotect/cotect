import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, ScrollView, View} from 'react-native';

import {
    Button,
    Chip,
    Dialog,
    Portal,
    RadioButton,
    Text,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';

import StepContainer from './StepContainer';

import {PRIMARY_COLOR, PRIMARY_BACKGROUND_COLOR} from '../../constants/DefaultStyles';

const styles = StyleSheet.create({
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flexGrow: 1,
        width: '100%',
    },
    chip: {
        marginBottom: 8,
        marginRight: 8,
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
            style={{backgroundColor: 'white'}}
            label={props.label}
            value={value}
            onChangeText={onChangeText}></TextInput>
    );
};

const SelectionElement = props => {
    const {t} = useTranslation();
    const selectionOptions = props.selections;

    const [selection, setSelection] = useState();

    const onSelect = selection => {
        setSelection(selection);
        props.setValue(selection);
        // directly close dialog after selection
        props.onDialogPress(selection);
    };

    // <Text>{t('report.symptoms.severity')}</Text>
    return (
        <View>
            <RadioButton.Group onValueChange={onSelect} value={selection}>
                {selectionOptions.map((item, index) => {
                    return (
                        <TouchableRipple key={index} onPress={() => onSelect(item)}>
                            <View style={styles.radioButtonItem}>
                                <RadioButton.Android value={item} />
                                <Text>{item}</Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </RadioButton.Group>
        </View>
    );
};

export default function SymptomsStep(props) {
    const {t} = useTranslation();

    const symptomsOptions = [
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
        {
            name: 'Runny Nose',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Tiredness',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Diarrhea',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Shortness of Breath',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Chills or Night Sweats',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Aches and Pains',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Loss of smell',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
        {
            name: 'Pain in throat',
            severityElement: props => (
                <SelectionElement selections={['mild', 'moderate', 'severe']} {...props} />
            ),
        },
    ];

    const symptomState = {};
    if (props.caseReport.symptoms) {
        for (var symptom in props.caseReport.symptoms) {
            symptomState[symptom.name] = symptom;
        }
    }

    const [selectedSymptoms, setSelectedSymptoms] = useState(symptomState);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState({});
    const [dialogTitle, setDialogTitle] = useState();
    const [dialogSeverity, setDialogSeverity] = useState();

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const onSelected = (symptom, dialogSeverity) => {
        let modifiedSelectedSymptoms = {};
        if (selectedSymptoms) {
            modifiedSelectedSymptoms = selectedSymptoms;
        }
        if (symptom.name in modifiedSelectedSymptoms) {
            delete modifiedSelectedSymptoms[symptom.name];
        } else {
            modifiedSelectedSymptoms[symptom.name] = {name: symptom.name, severity: dialogSeverity};
        }

        setSelectedSymptoms(modifiedSelectedSymptoms);
        resetSelection();
    };

    const isSymptomSelected = symptomName => {
        if (selectedSymptoms == null || selectedSymptoms == undefined) {
            return false;
        }

        if (symptomName in selectedSymptoms) {
            return true;
        }

        return false;
    };

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.symptoms = [];
        if (selectedSymptoms) {
            var symptoms = [];
            for (var key in selectedSymptoms) {
                symptoms.push(selectedSymptoms[key]);
            }
            caseReport.symptoms = symptoms;
        }

        return caseReport;
    };

    const resetSelection = () => {
        setSelectedSymptom({});
        setDialogSeverity();
    };

    const cancelSelectionDialog = () => {
        _hideDialog();
        resetSelection();
    };

    const onDialogPress = (severity = null) => {
        if (severity == null) {
            severity = dialogSeverity;
        }

        onSelected(selectedSymptom, severity);
        _hideDialog();
    };

    const showSymptomDialog = symptom => {
        setSelectedSymptom(symptom);
        setDialogTitle(symptom.name + ' - Severity');
        _showDialog();
    };

    const renderSymptomSeverityElement = (selectedSymptom, setValue) => {
        for (let i in symptomsOptions) {
            const symptom = symptomsOptions[i];
            if (symptom.name === selectedSymptom.name && symptom.severityElement) {
                return symptom.severityElement({setValue: setValue, onDialogPress: onDialogPress});
            }
        }

        return <View></View>;
    };

    return (
        <StepContainer
            title={t('report.symptoms.title')}
            helpText={t('report.help.defaultText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <View style={{justifyContent: 'flex-end'}}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}>
                    {symptomsOptions.map((symptom, key) => {
                        const isSelected = isSymptomSelected(symptom.name);
                        return (
                            <Chip
                                style={[
                                    styles.chip,
                                    isSelected ? {backgroundColor: PRIMARY_BACKGROUND_COLOR} : {},
                                ]}
                                key={key}
                                selectedColor={isSelected ? PRIMARY_COLOR : undefined}
                                onPress={() => {
                                    !isSelected ? showSymptomDialog(symptom) : onSelected(symptom);
                                }} // when the symptom is already selected, deselect it on press
                                //selected={isSelected} -> adds check mark -> not needed
                            >
                                {symptom.name}
                            </Chip>
                        );
                    })}
                </ScrollView>
            </View>
            <Portal>
                <Dialog visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{dialogTitle}</Dialog.Title>
                    <Dialog.Content>
                        {renderSymptomSeverityElement(selectedSymptom, setDialogSeverity)}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={cancelSelectionDialog}>{t('actions.cancel')}</Button>
                        <Button
                            onPress={() => {
                                onDialogPress();
                            }}>
                            {t('actions.add')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </StepContainer>
    );
}

SymptomsStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
