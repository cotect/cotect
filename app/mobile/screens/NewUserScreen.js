import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {Button} from 'react-native-paper';

import {APP_NAME} from '../constants/Configuration';

import {DEFAULT_BACKGROUND, ACTION_BUTTON, ACTION_BUTTON_LABEL} from '../constants/DefaultStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DEFAULT_BACKGROUND,
    },
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    image: {
        width: 180,
        height: 180,
        marginTop: 150,
        alignItems: 'center',
        alignSelf: 'center',
    },
    cotectLogo: {
        color: 'rgba(59,59,59,0.87)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 45,
        fontFamily: 'roboto-light',
        textAlign: 'center',
        marginTop: 8,
    },
    welcomeMessage: {
        color: 'rgba(59,59,59,0.87)',
        fontSize: 20,
        fontFamily: 'roboto-regular',
        textAlign: 'center',
        marginTop: 60,
        marginRight: 45,
        marginLeft: 45,
        alignSelf: 'center',
    }
});

export default function NewUserScreen(props) {
    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/cotect-logo.png')}
                resizeMode="contain"
                style={styles.image}></Image>
            <Text style={styles.cotectLogo}>{APP_NAME}</Text>
            <Text style={styles.welcomeMessage}>{t('home.welcomeMessage')}</Text>
            <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 36}}>
                <Button
                    mode="outlined"
                    style={{...styles.actionButton, marginBottom: 24}}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => props.onFinish()}>
                    {t('home.firstReportAction')}
                </Button>
            </View>
        </View>
    );
}

NewUserScreen.propTypes = {
    onFinish: PropTypes.func.isRequired,
};
