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

    //alert(props.caseReport.symptoms)
    const [selectedSymptoms, setSelectedSymptoms] = useState(props.caseReport.symptoms || []);

    const [isModalVisible, setModalVisible] = useState(false);
    const [dialogSymptom, setDialogSymptom] = useState({});
    const [dialogTitle, setDialogTitle] = useState();
    const [dialogSeverity, setDialogSeverity] = useState();

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const getSelectedSymptomByName = symptomName => {
        if (symptomName == null) {
            return null;
        }
        
        for (let selectedSymptom of selectedSymptoms) {
            if (selectedSymptom && selectedSymptom.name === symptomName) {
                return selectedSymptom;
            }
        }
        return null;
    };

    const unselectSymptom = symptomName => {
        let symptom = getSelectedSymptomByName(symptomName);
        if (symptom) {
            let modifiedSelectedSymptoms = [];

            if (selectedSymptoms) {
                modifiedSelectedSymptoms = selectedSymptoms;
            }

            var index = modifiedSelectedSymptoms.indexOf(symptom);
            if (index !== -1) {
                modifiedSelectedSymptoms.splice(index, 1);

                setSelectedSymptoms(modifiedSelectedSymptoms);
                // TODO: workaround to reset view -> otherwise card is not removed
                resetSelection();
            }
        }
    };

    const onSelected = (dialogSymptom, dialogSeverity) => {
        let modifiedSelectedSymptoms = [];

        if (selectedSymptoms) {
            modifiedSelectedSymptoms = selectedSymptoms;
        }

        let symptom = getSelectedSymptomByName(dialogSymptom.name);
        if (symptom) {
            unselectSymptom(symptom.name);
        } else {
            symptom = {name: dialogSymptom.name, severity: dialogSeverity}
            modifiedSelectedSymptoms.push(symptom);
            setSelectedSymptoms(modifiedSelectedSymptoms);
            resetSelection();
        }
    };

    const isSymptomSelected = symptomName => {
        var symptom = getSelectedSymptomByName(symptomName);
        
        if (symptom) {
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
        setDialogSymptom({});
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

        onSelected(dialogSymptom, severity);
        _hideDialog();
    };

    const showSymptomDialog = symptom => {
        setDialogSymptom(symptom);
        setDialogTitle(symptom.name + ' - Severity');
        _showDialog();
    };

    const renderSymptomSeverityElement = (dialogSymptom, setValue) => {
        for (let i in symptomsOptions) {
            const symptom = symptomsOptions[i];
            if (symptom.name === dialogSymptom.name && symptom.severityElement) {
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
                                    !isSelected ? showSymptomDialog(symptom) : onSelected(symptom, null);
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
                        {renderSymptomSeverityElement(dialogSymptom, setDialogSeverity)}
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
