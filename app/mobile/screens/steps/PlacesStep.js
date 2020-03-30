import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {ScrollView, StyleSheet, View} from 'react-native';

import {Button, Card, Dialog, Portal, Paragraph, IconButton, Avatar} from 'react-native-paper';

import StepContainer from './StepContainer';

import {Calendar} from 'react-native-calendars';

import {format, subDays, parseISO, isSameDay, isSameMonth, min, max} from 'date-fns';

import RNGooglePlaces from 'react-native-google-places';

import {CasePlace} from '../../client/cotect-backend/index';

import {getPlaceDisplayType, getRangeDate} from '../../utils/PlaceUtils';

import {
    ACTION_BUTTON,
    ACTION_BUTTON_LABEL,
    CARD_ITEM,
    CALENDAR_THEME,
} from '../../constants/DefaultStyles';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
});

export default function PlacesStep(props) {
    const {t} = useTranslation();

    const [visitedPlaces, setVisitedPlaces] = useState(props.caseReport.places || []);
    const [isModalVisible, setModalVisible] = useState(false);
    const [dialogSelectedPlace, setDialogSelectedPlace] = useState({});
    const [dialogSelectedDates, setDialogSelectedDates] = useState({});

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.places = visitedPlaces;
        return caseReport;
    };

    let getMinDate = () => {
        return format(subDays(new Date(), 14), 'yyyy-MM-dd');
    };

    let getMaxDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    let openPlacesSearchModal = () => {
        var autocompleteModalOptions = {useOverlay: true}
        if (props.caseReport.residence && props.caseReport.residence.place_area) {
            // if residence is set with place_area boundaries -> use it as location bias
            locationBias = props.caseReport.residence.place_area;
            autocompleteModalOptions = {useOverlay: true, locationBias: locationBias}
        }

        RNGooglePlaces.openAutocompleteModal(autocompleteModalOptions)
            .then(place => {
                setDialogSelectedPlace(place);
                _showDialog();
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)); // error is a Javascript Error object
    };

    let onDayPress = day => {
        let modifiedDialogSelectedDays = {...dialogSelectedDates};
        if (day.dateString in modifiedDialogSelectedDays) {
            delete modifiedDialogSelectedDays[day.dateString];
        } else {
            modifiedDialogSelectedDays[day.dateString] = {
                selected: true,
                disableTouchEvent: false,
                // set both to true so that it is marked correctly
                startingDate: true,
                endingDate: true,
                timestamp: day.timestamp,
            };
        }
        setDialogSelectedDates(modifiedDialogSelectedDays);
    };

    let getVisitedPlaceByID = placeID => {
        if (visitedPlaces == null) {
            return null;
        }

        for (let visitedPlace of visitedPlaces) {
            if (visitedPlace && visitedPlace.place_id === placeID) {
                return visitedPlace;
            }
        }
        return null;
    };

    let removePlace = placeID => {
        let place = getVisitedPlaceByID(placeID);
        if (place) {
            var index = visitedPlaces.indexOf(place);
            if (index !== -1) {
                visitedPlaces.splice(index, 1);

                // TODO: workaround to reset view -> otherwise card is not removed
                setDialogSelectedPlace({});
                setDialogSelectedDates({});
            }
        }
    };

    let onAddPlace = (place, markedDates) => {
        let dates = [];
        if (markedDates) {
            for (let date of markedDates) {
                dates.push(parseISO(date));
            }
        }

        // sometimes this is null or undefined
        if (place && place.placeID) {
            let visitedPlace = getVisitedPlaceByID(place.placeID);
            if (visitedPlace && dates) {
                // place was already added -> update dates
                if (visitedPlace.visit_dates) {
                    visitedPlace.visit_dates = visitedPlace.visit_dates.concat(dates);
                } else {
                    visitedPlace.visit_dates = dates;
                }
            } else {
                let casePlace = new CasePlace(place.placeID);
                casePlace.latitude = place.location.latitude;
                casePlace.longitude = place.location.longitude;
                casePlace.place_name = place.name;
                casePlace.place_types = place.types;
                casePlace.visit_dates = dates;

                let modifiedVisitedPlaces = [...visitedPlaces, casePlace];
                setVisitedPlaces(modifiedVisitedPlaces);
            }
        }

        setDialogSelectedPlace({});
        setDialogSelectedDates({});
        _hideDialog();
    };

    const scrollViewRef = React.createRef();
    return (
        <StepContainer
            title={t('report.places.title')}
            helpText={t('report.help.defaultText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            <View style={{justifyContent: 'flex-end'}}>
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    onContentSizeChange={(width, height) => {
                        scrollViewRef.current.scrollToEnd({animated: true});
                    }}
                    ref={scrollViewRef}
                    onLayout={e => scrollViewRef.current.scrollToEnd({animated: true})}>
                    {visitedPlaces.map((item, index) => {
                        let visitCount = 0;
                        let earliestDate = null;
                        let latestDate = null;
                        if (item && item.visit_dates && item.visit_dates.length > 0) {
                            visitCount = item.visit_dates.length;
                            earliestDate = min(item.visit_dates);
                            latestDate = max(item.visit_dates);
                        }

                        return (
                            <Card key={index} style={styles.cardItem}>
                                <Card.Title
                                    title={item.place_name}
                                    subtitle={getPlaceDisplayType(item.place_types, t)[0]}
                                    left={props => (
                                        <Avatar.Icon
                                            {...props}
                                            icon={getPlaceDisplayType(item.place_types, t)[1]}
                                        />
                                    )}
                                />
                                <IconButton
                                    {...props}
                                    style={{position: 'absolute', right: 0, top: 0, bottom: 0}}
                                    icon="close"
                                    size={17}
                                    onPress={() => {
                                        removePlace(item.place_id);
                                    }}
                                />
                                <Card.Content>
                                    <Paragraph>
                                        {getRangeDate(visitCount, earliestDate, latestDate, t)}
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        );
                    })}
                </ScrollView>

                <Button
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => openPlacesSearchModal()}>
                    {t('report.places.addPlace')}
                </Button>
            </View>
            <Portal>
                <Dialog style={{height: '70%'}} visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{t('report.places.dialogTitle')}</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            <View>
                                <Calendar
                                    theme={CALENDAR_THEME}
                                    minDate={getMinDate()}
                                    maxDate={getMaxDate()}
                                    onDayPress={onDayPress}
                                    markedDates={dialogSelectedDates}
                                />
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button
                            onPress={() =>
                                onAddPlace(dialogSelectedPlace, Object.keys(dialogSelectedDates))
                            }>
                            {t('actions.add')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </StepContainer>
    );
}

PlacesStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
