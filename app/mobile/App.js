import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';

import AsyncStorage from '@react-native-community/async-storage';

import {
    store,
    setSettingsState,
    setAuthToken,
    STORAGE_KEY_PREFIX,
    STORAGE_CASE_REPORT_KEY,
} from './redux/reducer';

import {APP_THEME} from './constants/DefaultStyles';

import ErrorBoundary from './components/ErrorBoundary';
import HomeScreen from './screens/HomeScreen';
import useLinking from './navigation/useLinking';

import {CaseReport} from './client/cotect-backend/index';

import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

const loadSavedSettings = () => {
    // TODO: Instead of doing it manually here, have a look at 'redux-persist' (https://itnext.io/react-native-why-you-should-be-using-redux-persist-8ad1d68fa48b)
    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {
            let settingsState = {};
            stores.map((result, i, store) => {
                let key = result[0];
                let value = result[1];

                if (key === STORAGE_CASE_REPORT_KEY) {
                    value = JSON.parse(value);
                    value = CaseReport.constructFromObject(value);
                }
                settingsState[key.replace(STORAGE_KEY_PREFIX, '')] = value;
            });
            store.dispatch(setSettingsState(settingsState));
        });
    });
};

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);
    const [initialNavigationState, setInitialNavigationState] = React.useState();
    const containerRef = React.useRef();
    const {getInitialState} = useLinking(containerRef);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                // Load our initial navigation state
                setInitialNavigationState(await getInitialState());
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    React.useEffect(() => {
        loadSavedSettings();
    }, []);

    React.useEffect(() => {
        let user = auth().currentUser;
        if (user) {
            user.getIdToken().then(authToken => {
                store.dispatch(setAuthToken(authToken));
            });
        }
    }, []);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return null;
    } else {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <PaperProvider theme={APP_THEME}>
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={Platform.Os == 'ios' ? 'padding' : 'height'}>
                            <NavigationContainer
                                ref={containerRef}
                                initialState={initialNavigationState}>
                                <Stack.Navigator headerMode="none">
                                    <Stack.Screen name="Root" component={HomeScreen} />
                                </Stack.Navigator>
                            </NavigationContainer>
                        </KeyboardAvoidingView>
                    </PaperProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
