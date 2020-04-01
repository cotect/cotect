import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {min, max} from 'date-fns';

import {List, Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

import {getRangeDate} from '../utils/PlaceUtils';

import {CARD_ITEM} from '../constants/DefaultStyles';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
    listElement: {
        fontSize: 14,
    },
    expandableElement: {
        padding: 0,
        margin: 0,
    },
});

export default function ReportSummaryCard(props) {
    const {t} = useTranslation();

    let subtitle = t('report.summaryCard.notSubmitted');

    let symptoms = [];
    if (props.caseReport.symptoms) {
        symptoms = props.caseReport.symptoms;
    }

    let places = [];
    if (props.caseReport.places) {
        places = props.caseReport.places;
    }

    let contacts = [];
    if (props.caseReport.contacts) {
        contacts = props.caseReport.contacts;
    }

    return (
        <Card style={{...styles.cardItem, ...props.style}}>
            <Card.Title
                title={t('report.summaryCard.reportTitle')}
                subtitle={subtitle}
                left={props => <Avatar.Icon {...props} icon="file-table" />}
            />
            <Card.Content>
                <List.Accordion
                    style={styles.expandableElement}
                    title={t('report.summaryCard.basicInfoSection')}
                    left={props => <List.Icon {...props} icon="account-card-details" />}>
                    {props.caseReport.age ? (
                        <List.Item
                            titleStyle={styles.listElement}
                            title={t('report.summaryCard.ageInfo', {age: props.caseReport.age})}
                        />
                    ) : (
                        false
                    )}
                    {props.caseReport.gender ? (
                        <List.Item
                            titleStyle={styles.listElement}
                            title={t('report.summaryCard.genderInfo', {
                                gender: props.caseReport.gender,
                            })}
                        />
                    ) : (
                        false
                    )}
                    {props.caseReport.covid_contact !== undefined &&
                    props.caseReport.covid_contact !== null ? (
                        <List.Item
                            titleStyle={styles.listElement}
                            title={t('report.summaryCard.covidContact', {
                                covidContact: props.caseReport.covid_contact,
                            })}
                        />
                    ) : (
                        false
                    )}
                    {props.caseReport.covid_test ? (
                        <List.Item
                            titleStyle={styles.listElement}
                            title={t('report.summaryCard.covidTest', {
                                covidTest: props.caseReport.covid_test,
                            })}
                        />
                    ) : (
                        false
                    )}
                </List.Accordion>
                <List.Accordion
                    style={styles.expandableElement}
                    title={t('report.summaryCard.symptomsSection', {count: symptoms.length})}
                    left={props => <List.Icon {...props} icon="heart-pulse" />}>
                    {symptoms.map((symptom, index) => {
                        let severityInfo = '';

                        if (symptom.severity) {
                            severityInfo = ' (' + symptom.severity + ')';
                        }

                        return (
                            <List.Item
                                key={'symptoms-' + index}
                                titleStyle={styles.listElement}
                                title={symptom.symptom_name + severityInfo}
                            />
                        );
                    })}
                </List.Accordion>
                <List.Accordion
                    style={styles.expandableElement}
                    title={t('report.summaryCard.placesSection', {count: places.length})}
                    left={props => <List.Icon {...props} icon="map-marker-radius" />}>
                    {places.map((place, index) => {
                        let visitCount = 0;
                        let earliestDate = null;
                        let latestDate = null;
                        if (place && place.visit_dates && place.visit_dates.length > 0) {
                            visitCount = place.visit_dates.length;
                            earliestDate = min(place.visit_dates);
                            latestDate = max(place.visit_dates);
                        }

                        return (
                            <List.Item
                                key={'palces-' + index}
                                titleStyle={styles.listElement}
                                title={
                                    place.place_name +
                                    ' (' +
                                    getRangeDate(visitCount, earliestDate, latestDate, t) +
                                    ')'
                                }
                            />
                        );
                    })}
                </List.Accordion>
                <List.Accordion
                    style={styles.expandableElement}
                    title={t('report.summaryCard.contactsSection', {count: contacts.length})}
                    left={props => <List.Icon {...props} icon="account-group" />}>
                    {contacts.map((contact, index) => {
                        let contactInfo = '';

                        if (contact.contact_name) {
                            contactInfo = ' (' + contact.contact_name + ')';
                        }

                        return (
                            <List.Item
                                key={'contacts-' + index}
                                titleStyle={styles.listElement}
                                title={contact.phone_number + contactInfo}
                            />
                        );
                    })}
                </List.Accordion>
            </Card.Content>
            {props.showActions ? (
                <Card.Actions>
                    <Button onPress={() => props.onUpdateAction(props.caseReport)}>
                        {t('actions.update')}
                    </Button>
                    <Button onPress={() => props.onDeleteAction(props.caseReport)}>
                        {t('actions.delete')}
                    </Button>
                </Card.Actions>
            ) : (
                false
            )}
        </Card>
    );
}
ReportSummaryCard.propTypes = {
    caseReport: PropTypes.object.isRequired,
    style: PropTypes.object,
    showActions: PropTypes.bool,
    onDeleteAction: PropTypes.func,
    onUpdateAction: PropTypes.func,
};
