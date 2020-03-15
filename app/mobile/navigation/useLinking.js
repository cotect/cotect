import { useLinking } from '@react-navigation/native';

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: ['covect://'],
    config: {
      Root: {
        path: 'root',
        screens: {
          Home: 'home',
          Links: 'links',
          Settings: 'settings',
        },
      },
    },
  });
}
