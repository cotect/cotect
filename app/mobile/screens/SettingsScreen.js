import React from 'react';

import {connect} from 'react-redux';

import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {mapStateToProps, mapDispatchToProps} from '../redux/reducer';
import {useTranslation} from 'react-i18next';

import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
    contentContainer: {
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
});

function SettingsScreen(props) {
    const {t} = useTranslation();
    const deleteData = () => {
        let user = auth().currentUser;
        if (user) {
            user.delete();
        }
        props.deleteSettings();
    };

    return (
        <View style={styles.contentContainer}>
            <Text>{t('settings.title')}</Text>
            <Text>
                {t('settings.phoneNumberLabel')} {props.phoneNumber}
            </Text>
            <Text>
                {t('settings.locationLabel')} {props.residence}
            </Text>
            <Text>
                {t('settings.ageLabel')} {props.age}
            </Text>
            <Text>
                {t('settings.genderLabel')} {props.gender}
            </Text>

            <Button
                // style={styles.deleteButton}
                onPress={deleteData}>
                {t('settings.deleteDataAction')}
            </Button>
        </View>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsScreen);
