import {DefaultTheme} from 'react-native-paper';

export const PRIMARY_COLOR = '#6200ee';
export const ACCENT_COLOR = '#3214be';
export const INACTIVE_COLOR = '#818181';
export const REPORTING_BACKGROUND = '#FDFDFD';
export const DEFAULT_BACKGROUND = '#FFF';
export const PRIMARY_BACKGROUND_COLOR = 'rgba(98, 0, 238, 0.2)';

export const CONTAINER = {
    //flex: 1,
    backgroundColor: '#fff',
    height: '100%',
};

export const ACTION_BUTTON = {
    borderRadius: 32,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    marginTop: 8,
    width: 170,
    alignSelf: 'center',
};

export const ACTION_BUTTON_LABEL = {
    fontSize: 12,
};

export const CARD_ITEM = {
    elevation: 1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
};

export const CALENDAR_THEME = {
    arrowColor: PRIMARY_COLOR,
    todayTextColor: PRIMARY_COLOR,
    selectedDayBackgroundColor: PRIMARY_COLOR,
    calendarBackground: REPORTING_BACKGROUND,
};

export const APP_THEME = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: PRIMARY_COLOR,
        accent: ACCENT_COLOR,
    },
};
