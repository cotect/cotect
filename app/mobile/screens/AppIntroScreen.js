import React, {useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView} from 'react-native';
import {IconButton, Paragraph, Headline} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import PropTypes from 'prop-types';

import {DEFAULT_BACKGROUND} from '../constants/DefaultStyles';

import AppIntroSlider from 'react-native-app-intro-slider';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: DEFAULT_BACKGROUND
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'space-around',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: -70,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 60,
        marginTop: 4,
        //position: 'absolute',
        //top: 0,
        alignSelf: 'center',
    },
});

export default function AppIntroScreen(props) {
    const {t} = useTranslation();

    const slides = [
        {
            key: 'landing',
            title: 'cotect',
            text: t('intro.landingText'),
            image: require('../assets/images/cotect-logo.png'),
            showLogo: false,
        },
        {
            key: 'reporting',
            title: t('intro.reportingTitle'),
            text: t('intro.reportingText'),
            image: require('../assets/images/reporting.png'),
            showLogo: true,
        },
        {
            key: 'assessments',
            title: t('intro.assessmentTitle'),
            text: t('intro.assessmentText'),
            image: require('../assets/images/assessments.png'),
            showLogo: true,
        },
        {
            key: 'privacy',
            title: t('intro.privacyTitle'),
            text: t('intro.privacyText'),
            image: require('../assets/images/privacy.png'),
            showLogo: true,
        },
    ];

    let _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <IconButton
                    color="rgba(255, 255, 255, .9)"
                    icon="arrow-right"
                    size={24}
                    style={{backgroundColor: 'transparent'}}
                />
            </View>
        );
    };

    let _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <IconButton
                    color="rgba(255, 255, 255, .9)"
                    icon="check"
                    size={24}
                    style={{backgroundColor: 'transparent'}}
                />
            </View>
        );
    };

    let _renderItem = ({item}) => {
        return (
            <SafeAreaView style={styles.container}>
                {item.showLogo ? (
                    <Image
                        source={require('../assets/images/cotect-banner.png')}
                        resizeMode="contain"
                        style={styles.logo}></Image>
                ) : (
                    <View style={{height: 60}}></View>
                )}
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        marginRight: 50,
                        marginLeft: 50,
                        backgroundColor: DEFAULT_BACKGROUND,
                        justifyContent: 'center',
                    }}>
                        
                    <Image style={styles.image} source={item.image} />
                    <Headline style={{fontSize: 32}}>{item.title}</Headline>
                    <Paragraph style={{fontSize: 17, marginTop: 15, textAlign: 'center'}}>
                        {item.text}
                    </Paragraph>
                </View>
            </SafeAreaView>
        );
    };

    return (
        <AppIntroSlider
            activeDotStyle={{backgroundColor: '#707070'}}
            renderItem={_renderItem}
            slides={slides}
            renderDoneButton={_renderDoneButton}
            renderNextButton={_renderNextButton}
            onDone={() => props.onFinish()}
        />
    );
}

AppIntroScreen.propTypes = {
    onFinish: PropTypes.func.isRequired,
};
