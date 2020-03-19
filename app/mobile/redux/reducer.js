
import AsyncStorage from '@react-native-community/async-storage';
import * as redux from "redux";

export const SET_APP_LOADING = "SET_APP_LOADING";
export const SET_SETTINGS_STATE = "SET_SETTINGS_STATE";
export const DELETE_SETTINGS = "DELETE_SETTINGS";
export const SET_PHONE_NUMBER = "SET_PHONE_NUMBER";
export const SET_AGE = "SET_AGE";
export const SET_GENDER = "SET_GENDER";
export const SET_RESIDENCE = "SET_RESIDENCE";
export const INCREASE_NUMBER_OF_REPORTS = "INCREASE_NUMBER_OF_REPORTS";

export const STORAGE_KEY_PREFIX = "@Cotect_";
const STORAGE_PHONE_NUMBER_KEY = STORAGE_KEY_PREFIX + "phoneNumber";
const STORAGE_RESIDENCE_KEY = STORAGE_KEY_PREFIX + "residence";
const STORAGE_GENDER_KEY = STORAGE_KEY_PREFIX + "gender";
const STORAGE_AGE_KEY = STORAGE_KEY_PREFIX + "age";
const INCREASE_NUMBER_OF_REPORTS_KEY = STORAGE_KEY_PREFIX + "numberOfReports";

const initialState = {
    appLoading: false,
    phoneNumber: "",
    residence: "",
    gender: "",
    age: "",
    numberOfReports: 0
}

export default reducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_APP_LOADING:
            return {...state, appLoading: true};
        case SET_SETTINGS_STATE:
            return {...state, ...action.payload.state, appLoading: false};
        case DELETE_SETTINGS:
            return {...action.payload.state};
        case SET_PHONE_NUMBER:
            return {...state, phoneNumber: action.payload.data};
        case SET_AGE:
            return {...state, age: action.payload.data};
        case SET_GENDER:
            return {...state, gender: action.payload.data};
        case SET_RESIDENCE:
            return {...state, residence: action.payload.data};
        case INCREASE_NUMBER_OF_REPORTS:
            const increaseNumberOfReports = parseInt(state.numberOfReports) + 1;
            AsyncStorage.setItem(INCREASE_NUMBER_OF_REPORTS_KEY, "" + increaseNumberOfReports);
            return {...state, numberOfReports: increaseNumberOfReports};
        default:
            return state;
    }
}

export const setAppLoading = () => {
    return {
        type: SET_APP_LOADING
    }
}

export const setSettingsState = (state) => {
    // TODO: add check that state only contains valid fields
    return {
        type: SET_SETTINGS_STATE,
        payload: {state: state}
    }
}

export const setPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
        AsyncStorage.setItem(STORAGE_PHONE_NUMBER_KEY, phoneNumber);
    }

    return {
        type: SET_PHONE_NUMBER,
        payload: {data: phoneNumber}
    }
}

export const setResidence = (residence) => {
    if (residence) {
        AsyncStorage.setItem(STORAGE_RESIDENCE_KEY, residence);
    }

    return {
        type: SET_RESIDENCE,
        payload: {data: residence}
    }
}

export const setAge = (age) => {
    if (age) {
        AsyncStorage.setItem(STORAGE_AGE_KEY, age);
    }

    return {
        type: SET_AGE,
        payload: {data: age}
    }
}

export const setGender = (gender) => {
    if (gender) {
        AsyncStorage.setItem(STORAGE_GENDER_KEY, gender);
    }

    return {
        type: SET_GENDER,
        payload: {data: gender}
    }
}

export const increaseNumberOfReports = () => {
    return {
        type: INCREASE_NUMBER_OF_REPORTS,
        payload: {}
    }
}

export const deleteSettings = () => {
    AsyncStorage.multiRemove([STORAGE_PHONE_NUMBER_KEY, STORAGE_RESIDENCE_KEY, STORAGE_AGE_KEY, STORAGE_GENDER_KEY])
        .then(e => console.log("Error in deleting settings"));

    return {
        type: DELETE_SETTINGS,
        payload: {state: initialState}
    }
}

export const mapStateToProps = state => {
    return {
        phoneNumber: state.phoneNumber,
        residence: state.residence,
        age: state.age,
        gender: state.gender,
        numberOfReports: state.numberOfReports
    }
}

export const mapDispatchToProps = {
    setAppLoading, setSettingsState, 
    setPhoneNumber, setResidence, 
    setAge, setGender, increaseNumberOfReports,
    deleteSettings
}

export const store = redux.createStore(reducer);
