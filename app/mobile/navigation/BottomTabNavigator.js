import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarMaterialIcon from '../components/TabBarMaterialIcon';
import SettingsScreen from '../screens/SettingsScreen';
import ReportHandler from '../screens/ReportHandler';
import TabBarMaterialLabel from '../components/TabBarMaterialLabel';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({headerTitle: getHeaderTitle(route)});

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Report"
                component={ReportHandler}
                options={{
                    //title: 'Report',
                    tabBarLabel: ({focused}) => (
                        <TabBarMaterialLabel focused={focused} text="Report" />
                    ),
                    tabBarIcon: ({focused}) => (
                        <TabBarMaterialIcon focused={focused} name="shield-plus" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({focused}) => (
                        <TabBarMaterialIcon focused={focused} name="settings-outline" />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Report':
            return 'Report';
        case 'Settings':
            return 'Settings';
        default:
            return '';
    }
}
