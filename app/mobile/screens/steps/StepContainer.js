import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        left: 24,
        top: 24,
    },
    stepTitle: {
        color: 'rgba(59,59,59,0.87)',
        fontSize: 25,
        fontFamily: 'roboto-light',
        marginBottom: 16,
    },
    step: {
        marginLeft: 24,
        marginTop: 96,
        width: '90%',
        position: 'absolute',
        bottom: 90,
    },
    secondaryAction: {
        position: 'absolute',
        bottom: 24,
        left: 24,
    },
    primaryAction: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
});

/**
 * Renders the outer wrapper of a step in the report form.
 * Contains the title incl. help modal, exit action as well as
 * the previous, next, skip or submit actions
 * (aka primary & secondary actions of each step)
 */
function StepContainer({
    children,
    title,
    helpText,
    primaryAction,
    onPrimaryActionPress,
    secondaryAction,
    onSecondaryActionPress,
    onExitPress,
}) {
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [isExitConfirmationVisible, setIsExitConfirmationVisible] = useState(false);

    function showHelp() {
        setIsHelpVisible(true);
    }

    function hideHelp() {
        setIsHelpVisible(false);
    }

    function showExitConfirmation() {
        setIsExitConfirmationVisible(true);
    }

    function hideExitConfirmation() {
        setIsExitConfirmationVisible(false);
    }

    return (
        <View style={{...styles.step}}>
            <Icon
                name="close"
                size={25}
                borderWidth={2}
                padding={5}
                style={styles.closeButton}
                onPress={showExitConfirmation}
            />
            <View>
                <Text style={styles.stepTitle}>
                    {title}
                    <Icon
                        name="help-circle-outline"
                        size={25}
                        borderWidth={2}
                        padding={5}
                        onPress={showHelp}
                    />
                </Text>
            </View>

            {children}

            {onSecondaryActionPress ? (
                <Button style={styles.secondaryAction} onPress={onSecondaryActionPress}>
                    {secondaryAction}
                </Button>
            ) : null}

            {onPrimaryActionPress ? (
                <Button style={styles.primaryAction} onPress={onPrimaryActionPress}>
                    {primaryAction}
                </Button>
            ) : null}

            <Portal>
                <Dialog visible={isHelpVisible} onDismiss={hideHelp}>
                    <Dialog.Title>{t('report.help.title')}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{helpText}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideHelp}>Got it!</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog visible={isExitConfirmationVisible} onDismiss={hideExitConfirmation}>
                    <Dialog.Title>{t('report.exit.title')}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{t('report.exit.text')}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onExitPress}>{t('report.exit.primaryAction')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

export default StepContainer;
