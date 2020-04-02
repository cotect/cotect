import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
const styles = StyleSheet.create({
    backButton: {
        justifyContent: 'flex-start',
    },
    nextButton: {
        justifyContent: 'flex-end',
    },
    buttonBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 0,
    },
});
export default function BackNextButton(props) {
    const {t} = useTranslation();
    const backButtonLabel = props.backButtonLabel || t('actions.back');
    const nextButtonLabel = props.nextButtonLabel || t('actions.next');
    return (
        <View style={styles.buttonBar}>
            {props.hideBackButton ? (
                <View></View>
            ) : (
                <Button
                    contentStyle={{height: 50}}
                    style={styles.backButton}
                    // disabled={!isBackButtonEnabled}
                    onPress={() => props.onBack()}>
                    {backButtonLabel}
                </Button>
            )}
            {props.hideNextButton ? (
                <View></View>
            ) : (
                <Button
                    contentStyle={{height: 50}}
                    style={styles.nextButton}
                    // disabled={!isNextButtonEnabled}
                    onPress={() => props.onNext()}>
                    {nextButtonLabel}
                </Button>
            )}
        </View>
    );
}
BackNextButton.propTypes = {
    hideNextButton: PropTypes.bool,
    hideBackButton: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    backButtonLabel: PropTypes.string,
    nextButtonLabel: PropTypes.string,
};
