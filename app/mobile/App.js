import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from "react-redux";

import AsyncStorage from '@react-native-community/async-storage';

import { store, setSettingsState, STORAGE_KEY_PREFIX } from "./redux/reducer";

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

const Stack = createStackNavigator();

const loadSavedSettings = () => {
  // TODO: Instead of doing it manually here, have a look at 'redux-persist' (https://itnext.io/react-native-why-you-should-be-using-redux-persist-8ad1d68fa48b)
  AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        let settingsState = {};
        stores.map((result, i, store) => {
          let key = result[0];
          let value = result[1];
          
          settingsState[key.replace(STORAGE_KEY_PREFIX, "")] = value;
        });
        store.dispatch(setSettingsState(settingsState));
      })
    })
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

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
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
