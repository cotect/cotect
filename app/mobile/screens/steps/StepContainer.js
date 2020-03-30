import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Paragraph, Portal, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import BackNextButton from '../../components/BackNextButton';

const styles = StyleSheet.create({
    stepTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginRight: 60,
    },
    stepTitle: {
        color: 'rgba(59,59,59,0.87)',
        fontSize: 24,
        fontFamily: 'roboto-light',
        marginRight: 4,
    },
    step: {
        width: '90%',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 16,
        alignSelf: 'center',
    },
});

export default function StepContainer(props) {
    const {t} = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);
    const helpText = props.helpText || t('report.help.defaultText');

    //  <Icon name="help-circle-outline" size={17} borderWidth={2} padding={5} onPress={_showDialog}/>
    //
    return (
        <View style={styles.step}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View style={styles.stepTitleWrapper}>
                    <Text style={styles.stepTitle}>{props.title}</Text>
                </View>
                {props.children}
            </View>
            <BackNextButton
                hideBackButton={props.hideBackButton}
                hideNextButton={props.hideNextButton}
                onBack={props.onBack}
                onNext={props.onNext}
            />
            <Portal>
                <Dialog visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{t('report.help.title')}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{helpText}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={_hideDialog}>{t('report.help.primaryAction')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

StepContainer.propTypes = {
    title: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    helpText: PropTypes.string,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
