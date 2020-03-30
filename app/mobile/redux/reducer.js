import AsyncStorage from '@react-native-community/async-storage';
import * as redux from 'redux';

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_APP_LOADING = 'SET_APP_LOADING';
export const SET_SETTINGS_STATE = 'SET_SETTINGS_STATE';
export const DELETE_SETTINGS = 'DELETE_SETTINGS';
export const SET_RESIDENCE = 'SET_RESIDENCE';
export const INCREASE_NUMBER_OF_REPORTS = 'INCREASE_NUMBER_OF_REPORTS';
export const SET_CASE_REPORT = 'SET_CASE_REPORT';

export const STORAGE_KEY_PREFIX = '@Cotect_';
// The key should be the same as the key in the initialState variable (without the prefix)
export const STORAGE_INCREASE_NUMBER_OF_REPORTS_KEY = STORAGE_KEY_PREFIX + 'numberOfReports';
export const STORAGE_CASE_REPORT_KEY = STORAGE_KEY_PREFIX + 'caseReport';

const initialState = {
    appLoading: false,
    authToken: '',
    numberOfReports: 0,
    caseReport: {},
};

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {...state, authToken: action.payload.data};
        case SET_APP_LOADING:
            return {...state, appLoading: true};
        case SET_SETTINGS_STATE:
            return {...state, ...action.payload.state, appLoading: false};
        case DELETE_SETTINGS:
            return {...action.payload.state};
        case INCREASE_NUMBER_OF_REPORTS:
            const increaseNumberOfReports = parseInt(state.numberOfReports) + 1;
            AsyncStorage.setItem(
                STORAGE_INCREASE_NUMBER_OF_REPORTS_KEY,
                '' + increaseNumberOfReports,
            );
            return {...state, numberOfReports: increaseNumberOfReports};
        case SET_CASE_REPORT:
            const caseReport = action.payload.data;
            if (caseReport) {
                AsyncStorage.setItem(STORAGE_CASE_REPORT_KEY, JSON.stringify(caseReport));
            }
            
            return {...state, caseReport: caseReport};
        default:
            return state;
    }
};

export const setAuthToken = authToken => {
    return {
        type: SET_AUTH_TOKEN,
        payload: {data: authToken},
    };
};

export const setAppLoading = () => {
    return {
        type: SET_APP_LOADING,
    };
};

export const setSettingsState = state => {
    // TODO: add check that state only contains valid fields
    return {
        type: SET_SETTINGS_STATE,
        payload: {state: state},
    };
};

export const increaseNumberOfReports = () => {
    return {
        type: INCREASE_NUMBER_OF_REPORTS,
        payload: {},
    };
};

export const setCaseReport = caseReport => {
    return {
        type: SET_CASE_REPORT,
        payload: {data: caseReport},
    };
};

export const deleteSettings = () => {
    AsyncStorage.multiRemove([
        STORAGE_INCREASE_NUMBER_OF_REPORTS_KEY,
        STORAGE_CASE_REPORT_KEY,
    ]).then(e => console.log('Error in deleting settings'));

    return {
        type: DELETE_SETTINGS,
        payload: {state: initialState},
    };
};

export const mapStateToProps = state => {
    return {
        authToken: state.authToken,
        numberOfReports: state.numberOfReports,
        caseReport: state.caseReport,
    };
};

export const mapDispatchToProps = {
    setAuthToken,
    setAppLoading,
    setSettingsState,
    increaseNumberOfReports,
    setCaseReport,
    deleteSettings,
};

export const store = redux.createStore(reducer);
