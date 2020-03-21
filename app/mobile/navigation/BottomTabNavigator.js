import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarMaterialIcon from '../components/TabBarMaterialIcon';
import SettingsScreen from '../screens/SettingsScreen';
import ReportHandler from '../screens/ReportHandler';
import TabBarMaterialLabel from '../components/TabBarMaterialLabel';
import {useTranslation} from 'react-i18next';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
    const {t} = useTranslation();

    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({headerTitle: getHeaderTitle(route, t)});

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Report"
                component={ReportHandler}
                options={{
                    title: t('navigation.reportTitle'),
                    tabBarLabel: ({focused}) => (
                        <TabBarMaterialLabel
                            focused={focused}
                            text={t('navigation.reportTabLabel')}
                        />
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
                    title: t('navigation.settingsTitle'),
                    tabBarLabel: ({focused}) => (
                        <TabBarMaterialLabel
                            focused={focused}
                            text={t('navigation.settingsTabLabel')}
                        />
                    ),
                    tabBarIcon: ({focused}) => (
                        <TabBarMaterialIcon focused={focused} name="settings-outline" />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route, t) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Report':
            return t('navigation.reportTitle');
        case 'Settings':
            return t('navigation.settingsTitle');
        default:
            return t('navigation.homeTitle');
    }
}
