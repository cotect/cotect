
import React, { useState } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import {useTranslation} from 'react-i18next';

import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';

import { CalendarList } from 'react-native-calendars';

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
    coloredText: {
        color: "rgba(50,20,190,1)"
    },
    dialogLocation: {
        marginBottom: 16
    }
});

export default function LocationsStep(props) {
    const {t} = useTranslation();
    const [locationsAndDates, setLocationsAndDates] = useState(props.stepItem.initialProps || []);
    const [isModalVisible, setModalVisible] = useState(false);

    const [dialogLocation, setDialogLocation] = useState({});
    const [dialogSelectedDates, setDialogSelectedDates] = useState({});

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            setDialogLocation(place);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    let onDayPress = (day) => {
        let modifiedDialogSelectedDays = {...dialogSelectedDates};
        if (day.dateString in modifiedDialogSelectedDays) {
            delete modifiedDialogSelectedDays[day.dateString ];
        }
        else {
            modifiedDialogSelectedDays[day.dateString] = {
                selected: true,
                disableTouchEvent: false,
                selectedDotColor: 'orange',
                // set both to true so that it is marked correctly
                startingDate: true,
                endingDate: true,
                timestamp: day.timestamp
            }
        }
        setDialogSelectedDates(modifiedDialogSelectedDays);
    }

    let onAddPlace = (place, dates) => {
        let location = { 
            placeId: place.placeID,
            latitude: place.location.latitude, 
            longitude: place.location.longitude,
            placeName: place.address,
            placeTypes: place.types,
            visitDates: dates
        }

        setDialogLocation({});
        setDialogSelectedDates({});
        let modifiedLocationsAndDates = [...locationsAndDates, location];
        setLocationsAndDates(modifiedLocationsAndDates);
        _hideDialog();

        props.stepItem.onFinish(modifiedLocationsAndDates);
    }

    return (
        <View>
            <View style={styles.itemList}>
                {locationsAndDates.map((item, index) => {
                    let earliestDateKey;
                    let latestDateKey;
                    for (let key in item.visitDates) {
                        let date = item.visitDates[key];
                        if (earliestDateKey === undefined || date.timestamp < item.visitDates[earliestDateKey].timestamp) {
                            earliestDateKey = key; 
                        }
                        if (latestDateKey === undefined || date.timestamp > item.visitDates[latestDateKey].timestamp) {
                            latestDateKey = key;
                        }
                    }

                    return (
                        <Card 
                            key={index}
                            style={styles.cardItem}
                        >
                            <Card.Title 
                                title={item.placeName}
                                subtitle={earliestDateKey + " to " + latestDateKey}
                            />
                            {/* {Object.entries(item.dates).map(([key, value]) => (
                                <Text>{key}</Text>
                            ))} */}
                        </Card>
                    )
                })}

                <Button 
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => _showDialog()}>
                    {t('report.residence.addLocation')}
                </Button>
            </View>

            <Portal>
                <Dialog
                    style={{height: "80%"}}
                    visible={isModalVisible}
                    onDismiss={_hideDialog}>
                    <Dialog.Title>{t('report.residence.dialogTitle')}</Dialog.Title>
                    {/* <Dialog.Content> */}
                        {/* <Paragraph>This is simple dialog</Paragraph> */}
                        <Dialog.ScrollArea>
                        <ScrollView>
                            <View style={styles.dialogLocation}>
                                <Text>
                                    {t('report.residence.locationLabel')}:  
                                    
                                </Text>
                                <Text 
                                        style={styles.coloredText}
                                        onPress={() => openPlacesSearchModal()}>
                                        {dialogLocation.address || t('report.residence.locationClick')}
                                    </Text>
                                
                                {/* <Button
                                    style={styles.actionButton}
                                    labelStyle={styles.actionButtonLabel}
                                    onPress={() => openPlacesSearchModal()}>
                                    Pick a location
                                </Button> */}
                            </View>  
                            <View>
                                <Text>{t('report.residence.titleDates')}:</Text>
                                <CalendarList
                                    // Max amount of months allowed to scroll to the past. Default = 50
                                    pastScrollRange={1}
                                    // Max amount of months allowed to scroll to the future. Default = 50
                                    futureScrollRange={0}
                                    // Enable or disable scrolling of calendar list
                                    scrollEnabled={true}
                                    
                                    horizontal={true}

                                    pagingEnabled={true}

                                    // Enable or disable vertical scroll indicator. Default = false
                                    showScrollIndicator={true}
                                    
                                    onDayPress={onDayPress}
                                    markedDates={dialogSelectedDates}
                                />
                            </View>
                        </ScrollView>
                        </Dialog.ScrollArea>
                        {/* <Text>Dates: {dialogDates}</Text>
                        <Button onPress={() => openCalendarModal()}>
                            Pick dates
                        </Button> */}
                    {/* </Dialog.Content> */}
                    <Dialog.Actions>
                        <Button
                            disabled={Object.keys(dialogLocation).length === 0}
                            onPress={() => onAddPlace(dialogLocation, dialogSelectedDates)}
                        >
                            {t('actions.add')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
