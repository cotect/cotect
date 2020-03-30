
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import {useTranslation} from 'react-i18next';

import { Button, Card, Dialog, Portal, Text, Title, Paragraph, IconButton, Avatar } from 'react-native-paper';

import RNGooglePlaces from 'react-native-google-places';


const styles = StyleSheet.create({
    actionButton: {
        borderRadius: 32,
        borderColor: "rgba(50,20,190,1)",
        borderWidth: 1,
        marginTop: 8,
        width: 170,
        alignSelf: "center"
    },
    actionButtonLabel: {
        fontSize: 12
    },
    cardItem: {
        elevation: 1,
        margin: 8,
        borderRadius: 8 
    }
});

export default function CurrentLocationStep(props) {
    const {t} = useTranslation();
    const [currentLocation, setCurrentLocation] = useState(props.stepItem.initialProps || {});

    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
            type: 'regions',
            useOverlay: true
        })
        .then((place) => {
            let location = { 
                placeId: place.placeID,
                latitude: place.location.latitude, 
                longitude: place.location.longitude,
                placeName: place.name,
                placeTypes: place.types,
                visitDates: [new Date()]
            }
            setCurrentLocation(location);

            props.stepItem.onFinish(location, true);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => {
            setCurrentLocation({});
            props.stepItem.onFinish(currentLocation, false);
            console.log(error.message);
        });  // error is a Javascript Error object
    }

    return (
        <View>
            {/* <Text>{currentLocation.address}</Text> */}
            {currentLocation.placeName ?
                <Card
                    style={styles.cardItem}>
                  <Card.Title
                    title={currentLocation.placeName}
                    subtitle="City"
                    left={props => <Avatar.Icon {...props} icon="home-city" />}
                    right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                  />
                </Card>
                : false 
            }
            <Button 
                mode="outlined"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => openPlacesSearchModal()}>
                {t('report.residence.primaryAction')}
            </Button>
        </View>
    )
};
