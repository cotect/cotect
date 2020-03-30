import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet, View} from 'react-native';

import StepContainer from './StepContainer';

import {Calendar} from 'react-native-calendars';

import {format, subDays, parseISO} from 'date-fns';

import {CALENDAR_THEME} from '../../constants/DefaultStyles';

const styles = StyleSheet.create({});

export default function SymptomsDateStep(props) {
    const {t} = useTranslation();

    if (!props.caseReport.symptoms) {
        // ignore step 
        props.onNext(props.caseReport)
    }

    // Initialize Dates
    //alert(JSON.stringify(props.caseReport.symptoms))
    const reportDate = props.caseReport.symptoms[0].report_date
    const existingMarkedDate = {}
    if (reportDate){
        existingMarkedDate[format(reportDate, 'yyyy-MM-dd')] = {selected: true}
    }
    

    const [selectedDate, setSelectedDate] = useState(reportDate);
    const [markedDate, setMarkedDate] = useState(existingMarkedDate);

    const getStateToBeSaved = (date=null) => {
        const caseReport = {...props.caseReport};

        if (date == null){
            date = selectedDate
        }

        if (props.caseReport.symptoms) {
            for (var symptom of props.caseReport.symptoms) {
                symptom.report_date = date
            }
        }

        return caseReport;
    };

    let getMinDate = () => {
        return format(subDays(new Date(), 30), 'yyyy-MM-dd');
    };

    let getMaxDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    let onDayPress = day => {
        if (day && day.dateString){
            var newMarkedDate = {}
            newMarkedDate[day.dateString] = {
                selected: true
            };
            var date = parseISO(day.dateString)
            setSelectedDate(date)
            setMarkedDate(newMarkedDate)
            // jump to next step
            props.onNext(getStateToBeSaved(date))
        }
    };

    return (
        <StepContainer
            title={t('report.symptomsDate.title')}
            helpText={t('report.help.defaultText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <View style={{margin: 12}}>
                <Calendar
                    theme={CALENDAR_THEME}
                    minDate={getMinDate()}
                    maxDate={getMaxDate()}
                    onDayPress={onDayPress}
                    markedDates={markedDate}
                />
            </View>
        </StepContainer>
    );
}

SymptomsDateStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
