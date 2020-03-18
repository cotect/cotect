
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button, Card, Paragraph } from 'react-native-paper';

import RNGooglePlaces from 'react-native-google-places';


const styles = StyleSheet.create({
    actionButton: {
        borderRadius: 32,
        borderColor: "rgba(50,20,190,1)",
        borderWidth: 1,
        marginTop: 8,
        padding: 2
    },
    actionButtonLabel: {
        fontSize: 12
    },
    cardItem: {
        marginBottom: 8
    }
});

export default function CurrentLocationStep(props) {
    const [currentLocation, setCurrentLocation] = useState(props.stepItem.initialProps);
    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            setCurrentLocation(place.address);

            props.stepItem.onFinish(place.address, true);
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
            {currentLocation ?
                <Card 
                    style={styles.cardItem}
                >
                    <Card.Content>
                        <Paragraph>{currentLocation}</Paragraph>
                    </Card.Content> 
                </Card>
                : false 
            }
            <Button 
                mode="outlined"
                style={styles.actionButton}
                labelStyle={styles.actionButtonLabel}
                onPress={() => openPlacesSearchModal()}>
                Pick current location
            </Button>
        </View>
    )
};
