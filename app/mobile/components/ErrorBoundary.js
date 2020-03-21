import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Headline, Subheading} from 'react-native-paper';
import crashlytics from '@react-native-firebase/crashlytics';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
});

function FallbackUI({onReset}) {
    const {t} = useTranslation();
    return (
        <View style={styles.container}>
            <Headline>{t('error.title')}</Headline>
            <Subheading>{t('error.text')}</Subheading>
            <Button onPress={onReset}>{t('error.primaryAction')}</Button>
        </View>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showError: false};
    }

    static getDerivedStateFromError() {
        return {showError: true};
    }

    componentDidCatch(error) {
        crashlytics().recordError(error);
        this.setState(() => ({showError: true}));
    }

    _handleResetClick = () => {
        this.setState(() => ({showError: false}));
    };

    render() {
        if (this.state.showError) {
            return <FallbackUI onReset={this._handleResetClick} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
