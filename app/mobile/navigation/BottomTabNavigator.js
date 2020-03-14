import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import TabBarIcon from '../components/TabBarIcon';
import TabBarMaterialIcon from '../components/TabBarMaterialIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabBarMaterialLabel from '../components/TabBarMaterialLabel';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Report"
        component={HomeScreen}
        options={{
          //title: 'Report',
          tabBarLabel: ({ focused }) => <TabBarMaterialLabel focused={focused} text="Report" />,
          tabBarIcon: ({ focused }) => <TabBarMaterialIcon focused={focused} name="shield-plus" />,
        }}
      />
      <BottomTab.Screen
        name="Assessment"
        component={LinksScreen}
        options={{
          title: 'Assessment',
          tabBarIcon: ({ focused }) => <TabBarMaterialIcon focused={focused} name="chart-bar-stacked" />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabBarMaterialIcon focused={focused} name="settings-outline" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
    case 'Settings':
      return "Foo";
    default:
      return '';
  }
}
