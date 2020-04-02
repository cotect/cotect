import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';

import auth from '@react-native-firebase/auth';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text, TextInput, Caption} from 'react-native-paper';

import PhoneInput from 'react-native-phone-input';

import StepContainer from './StepContainer';

import * as RNLocalize from 'react-native-localize';

import {DEFAULT_COUNTRY_CODE} from '../../constants/Configuration';

import {
    ACTION_BUTTON,
    ACTION_BUTTON_LABEL,
    PRIMARY_COLOR,
    REPORTING_BACKGROUND,
} from '../../constants/DefaultStyles';

const styles = StyleSheet.create({
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    inputField: {
        backgroundColor: REPORTING_BACKGROUND,
    },
    snackbar: {
        //backgroundColor: 'red',
        position: 'absolute',
        bottom: -24,
    },
});

export default function PhoneNumberStep(props) {
    const {t} = useTranslation();

    const [isVerified, setIsVerified] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState();
    const [isPhoneNumberEntered, setPhoneNumberEntered] = useState(false);
    const [confirmation, setConfirmation] = useState();

    const [isSnackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState();

    const onVerifyClick = async () => {
        try {
            if (phoneRef.current && phoneRef.current.isValidNumber() == true) {
                var phoneNumber = phoneRef.current.getValue();

                let confirmationResponse = await auth().signInWithPhoneNumber(phoneNumber);
                setPhoneNumberEntered(true);
                setConfirmation(confirmationResponse);
            } else {
                setSnackbarText(t('report.phoneNumber.invalidNumber'));
                setSnackbarVisible(true);
            }
        } catch (error) {
            alert(error);
            console.log(error);
            setSnackbarText(t('report.phoneNumber.verificationFailed'));
            setSnackbarVisible(true);
        }
    };

    const onSignInAnonymously = async () => {
        if (auth().currentUser === null) {
            try {
                await auth().signInAnonymously();
            } catch (e) {
                switch (e.code) {
                    case 'auth/operation-not-allowed':
                        console.log('Enable anonymous in your firebase console.');
                        break;
                    default:
                        console.error(e);
                        break;
                }
            }
        }
    };

    const onConfirmClick = async () => {
        try {
            await confirmation.confirm(confirmationCode); // User entered code
            // Successful login - onAuthStateChanged is triggered
        } catch (e) {
            setSnackbarText(t('report.phoneNumber.invalidConfirmation'));
            setSnackbarVisible(true);
            setPhoneNumberEntered(false);
        }
    };

    const onAuthStateChanged = async user => {
        if (user) {
            // user.delete();
            // user.getIdToken(true).then((e)=>console.log(e)).catch((e) => console.log(e));
            setIsVerified(true);
            let phoneNumber = user.phoneNumber;
            if (user.isAnonymous && user.phoneNumber === null) {
                phoneNumber = 'anonymous';
            }
            // Phone number is deleted from firebase, after
            // successful validation. Account is online anonymous then.
            if (user.isAnonymous === false && user.phoneNumber !== null) {
                phoneNumber = (' ' + user.phoneNumber).slice(1); // Save phone number locally
                try {
                    await user.unlink(auth.PhoneAuthProvider.PROVIDER_ID);
                } catch (e) {
                    switch (e.code) {
                        case 'auth/unknown':
                            console.log('Number deleted from Firebase already.');
                            break;
                        default:
                            console.error(e);
                            break;
                    }
                }
                try {
                    // reload so local user is updated
                    await auth().currentUser.reload();
                } catch (e) {
                    console.error(e);
                }
            }
            props.onNext(getStateToBeSaved(phoneNumber));
        } else {
            setIsVerified(false);
        }
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const getStateToBeSaved = (phone_number = null) => {
        const caseReport = {...props.caseReport};
        // TODO: fill caseReport?
        return caseReport;
    };

    const getCountryCode = () => {
        var countryCode = null;

        try {
            countryCode = props.caseReport.residence.region;
        } catch {
            // do nothiing
        }

        if (!countryCode) {
            try {
                countryCode = RNLocalize.getCountry();
            } catch {
                countryCode = DEFAULT_COUNTRY_CODE;
            }

            if (countryCode == null) {
                countryCode = DEFAULT_COUNTRY_CODE;
            }
        }
        
        return countryCode.toLowerCase();
    };

    const phoneRef = React.createRef();

    return (
        <StepContainer
            title={t('report.phoneNumber.title')}
            helpText={t('report.phoneNumber.helpText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <View>
                <Caption style={{fontSize: 13, marginTop: -10, marginBottom: 10}}>
                    {t('report.phoneNumber.helpText')}
                </Caption>
                {!isVerified ? (
                    <View>
                        {!isPhoneNumberEntered ? (
                            <View>
                                <PhoneInput
                                    style={{marginLeft: 8, marginRight: 32}}
                                    ref={phoneRef}
                                    pickerButtonColor={PRIMARY_COLOR}
                                    initialCountry={getCountryCode()}
                                    autoFormat={true}
                                    autoCorrect={true}
                                    allowZeroAfterCountryCode={false}
                                    textComponent={props => <TextInput {...props} />}
                                    textStyle={{...styles.inputField, fontSize: 14, height: 64}}
                                    textProps={{
                                        label: t('report.phoneNumber.inputLabelPhoneNumber'),
                                    }}
                                />
                                <Button
                                    mode="outlined"
                                    style={{...styles.actionButton, marginTop: 24}}
                                    labelStyle={styles.actionButtonLabel}
                                    onPress={() => onVerifyClick()}>
                                    {t('actions.verify')}
                                </Button>
                            </View>
                        ) : (
                            <View>
                                <TextInput
                                    mode="outlined"
                                    style={{
                                        ...styles.inputField,
                                        marginTop: 8,
                                        marginLeft: 32,
                                        marginRight: 32,
                                    }}
                                    label={t('report.phoneNumber.inputLabelConfirmation')}
                                    value={confirmationCode}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    onChangeText={text => setConfirmationCode(text)}
                                />
                                <Button
                                    mode="outlined"
                                    style={styles.actionButton}
                                    labelStyle={styles.actionButtonLabel}
                                    onPress={() => onConfirmClick()}>
                                    {t('actions.confirm')}
                                </Button>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text>{t('report.phoneNumber.numberVerified')}</Text>
                )}

                <Snackbar
                    style={styles.snackbar}
                    visible={isSnackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    action={{
                        label: t('actions.dismiss'),
                        onPress: () => {
                            setSnackbarVisible(false);
                        },
                    }}>
                    {snackbarText}
                </Snackbar>
            </View>
        </StepContainer>
    );
}

PhoneNumberStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
