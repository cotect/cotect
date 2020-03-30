import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';

import {Button, Card, IconButton, Avatar} from 'react-native-paper';

import RNGooglePlaces from 'react-native-google-places';

import StepContainer from './StepContainer';

import {CasePlace} from '../../client/cotect-backend/index';

import {getPlaceDisplayType} from  '../../utils/PlaceUtils';

import {ACTION_BUTTON, ACTION_BUTTON_LABEL, CARD_ITEM} from '../../constants/DefaultStyles';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
    actionButton: ACTION_BUTTON,
    actionButtonLabel: ACTION_BUTTON_LABEL,
});

export default function ResidenceStep(props) {
    const {t} = useTranslation();

    const [selectedPlace, setSelectedPlace] = useState(props.caseReport.residence || null);

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.residence = selectedPlace;
        return caseReport;
    };

    let openPlacesSearchModal = () => {
        // only allow to choose regions: cities, postal codes, ...
        RNGooglePlaces.openAutocompleteModal({
            type: 'regions',
            useOverlay: true,
        })
            .then(place => {
                let casePlace = new CasePlace(place.placeID);
                casePlace.latitude = place.location.latitude;
                casePlace.longitude = place.location.longitude;
                casePlace.place_name = place.address;
                casePlace.place_types = place.types;
                casePlace.place_area = place.viewport;
                setSelectedPlace(casePlace);
            })
            .catch(error => {
                console.log(error.message);
            }); // error is a Javascript Error object
    };

    return (
        <StepContainer
            title={t('report.residence.title')}
            helpText={t('report.help.defaultText')}
            onNext={() => props.onNext(getStateToBeSaved())}
            onBack={() => props.onBack(getStateToBeSaved())}
            hideNextButton={props.hideNextButton}
            hideBackButton={props.hideBackButton}>
            {selectedPlace && selectedPlace.place_id ? (
                <Card style={styles.cardItem}>
                    <Card.Title
                        title={selectedPlace.place_name}
                        subtitle={getPlaceDisplayType(selectedPlace.place_types, t)[0]}
                        left={props => (
                            <Avatar.Icon
                                {...props}
                                icon={getPlaceDisplayType(selectedPlace.place_types, t)[1]}
                            />
                        )}
                    />
                    <IconButton
                        {...props}
                        style={{position: 'absolute', right: 0, top: 0, bottom: 0}}
                        icon="close"
                        size={17}
                        onPress={() => {
                            // just set selecte place to empty
                            setSelectedPlace(null);
                        }}
                    />
                </Card>
            ) : (
                false
            )}
            <Button
                mode="outlined"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => openPlacesSearchModal()}>
                {t('report.residence.pickPlace')}
            </Button>
        </StepContainer>
    );
}

ResidenceStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
