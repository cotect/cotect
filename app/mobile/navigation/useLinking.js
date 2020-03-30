import {useLinking} from '@react-navigation/native';

export default function(containerRef) {
    return useLinking(containerRef, {
        prefixes: ['cotect://'],
        config: {
            Root: {
                path: 'root',
                screens: {
                    Home: 'home',
                    Report: 'report',
                    Settings: 'settings',
                },
            },
        },
    });
}
