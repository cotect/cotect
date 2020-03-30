import React, {useState} from 'react';

import {ScrollView, StyleSheet, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
    Button,
    Card,
    Dialog,
    Portal,
    Text,
    Title,
    Paragraph,
    IconButton,
    Avatar,
    Menu,
} from 'react-native-paper';

import {Calendar} from 'react-native-calendars';

import {format, subDays, parseISO, isSameDay, isSameMonth} from 'date-fns';

import RNGooglePlaces from 'react-native-google-places';

const styles = StyleSheet.create({
    itemList: {
        flexGrow: 1,
    },
    cardItem: {
        elevation: 1,
        margin: 8,
        borderRadius: 8,
    },
    actionButton: {
        borderRadius: 32,
        borderColor: 'rgba(50,20,190,1)',
        borderWidth: 1,
        marginTop: 8,
        width: 170,
        alignSelf: 'center',
    },
    actionButtonLabel: {
        fontSize: 12,
    },
    coloredText: {
        color: 'rgba(50,20,190,1)',
    },
    dialogLocation: {
        marginBottom: 16,
    },
});

export default function LocationsStep(props) {
    const {t} = useTranslation();
    const [locationsAndDates, setLocationsAndDates] = useState(props.stepItem.initialProps || []);
    const [isModalVisible, setModalVisible] = useState(false);

    const [dialogLocation, setDialogLocation] = useState({});
    const [dialogSelectedDates, setDialogSelectedDates] = useState({});

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const [isCardMenuVisible, setCardMenuVisible] = useState(false);

    const _openMenu = () => setCardMenuVisible(true);
    const _closeMenu = () => setCardMenuVisible(false);

    let openPlacesSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
            useOverlay: true,
        })
            .then(place => {
                setDialogLocation(place);
                _showDialog();
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message)); // error is a Javascript Error object
    };

    let getPlaceDisplayType = types => {
        if (types.indexOf('airport') >= 0) {
            return [t('report.places.types.airport'), 'airport'];
        } else if (types.indexOf('train_station') >= 0) {
            return [t('report.places.types.trainStation'), 'train'];
        }else if (types.indexOf('bank') >= 0) {
            return [t('report.places.types.bank'), 'bank'];
        }else if (types.indexOf('museum') >= 0) {
                return [t('report.places.types.museum'), 'bank'];
        }else if (types.indexOf('atm') >= 0) {
                return [t('report.places.types.atm'), 'atm'];
        } else if (types.indexOf('school') >= 0) {
            return [t('report.places.types.school'), 'school'];
        } else if (types.indexOf('bakery') >= 0) {
            return [t('report.places.types.bakery'), 'bread-slice'];
        } else if (types.indexOf('bus_station') >= 0) {
            return [t('report.places.types.bus_station'), 'bus'];
        } else if (types.indexOf('church') >= 0) {
            return [t('report.places.types.church'), 'church'];
        } else if (types.indexOf('gas_station') >= 0) {
            return [t('report.places.types.gas_station'), 'gas-station'];
        } else if (types.indexOf('grocery_or_supermarket') >= 0) {
            return [t('report.places.types.grocery_or_supermarket'), 'shopping'];
        } else if (types.indexOf('library') >= 0) {
            return [t('report.places.types.library'), 'library'];
        } else if (types.indexOf('movie_theater') >= 0) {
            return [t('report.places.types.movie_theater'), 'theater'];
        } else if (types.indexOf('night_club') >= 0) {
            return [t('report.places.types.night_club'), 'music-circle'];
        } else if (types.indexOf('post_office') >= 0) {
            return [t('report.places.types.post_office'), 'email-outline'];
        } else if (types.indexOf('restaurant') >= 0) {
            return [t('report.places.types.restaurant'), 'silverware-fork-knife'];
        } else if (types.indexOf('shopping_mall') >= 0) {
            return [t('report.places.types.shopping_mall'), 'basket'];
        } else if (types.indexOf('stadium') >= 0) {
            return [t('report.places.types.stadium'), 'stadium'];
        } else if (types.indexOf('cafe') >= 0) {
            return [t('report.places.types.cafe'), 'coffee'];
        } else if (types.indexOf('doctor') >= 0) {
            return [t('report.places.types.doctor'), 'doctor'];
        } else if (types.indexOf('hospital') >= 0) {
            return [t('report.places.types.hospital'), 'hospital-building'];
        } else if (types.indexOf('park') >= 0) {
            return [t('report.places.types.park'), 'nature-people'];
        } else if (types.indexOf('pharmacy') >= 0) {
            return [t('report.places.types.pharmacy'), 'pharmacy'];
        } else if (types.indexOf('gym') >= 0) {
            return [t('report.places.types.gym'), 'dumbbell'];
        } else if (types.indexOf('store') >= 0) {
            return [t('report.places.types.store'), 'store'];
        } else if (types.indexOf('establishment') >= 0) {
            return [t('report.places.types.establishment'), 'store'];
        }

        return ['Place', 'map-marker-radius'];
    };

    let getMinDate = () => {
        return format(subDays(new Date(), 14), 'yyyy-MM-dd');
    };

    let getMaxDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    let getRangeDate = (visitCount, earliestDateKey, latestDateKey) => {
        var earliestDate = null;
        if (earliestDateKey) {
            earliestDate = parseISO(earliestDateKey);
        }

        var latestDate = null;
        if (latestDateKey) {
            latestDate = parseISO(latestDateKey);
        }

        if (earliestDate && latestDate) {
            if (isSameDay(earliestDate, latestDate)) {
                return t('report.places.singleVisitDesc', {date: format(earliestDate, 'd.M.')});
            } else if (isSameMonth(earliestDate, latestDate)) {
                return t('report.places.visitsDesc', {
                    visitCount: visitCount,
                    earliestDate: format(earliestDate, 'd.'),
                    latestDate: format(latestDate, 'd.M.'),
                });
            } else {
                return t('report.places.visitsDesc', {
                    visitCount: visitCount,
                    earliestDate: format(earliestDate, 'd.M.'),
                    latestDate: format(latestDate, 'd.M.'),
                });
            }
        } else {
            return t('report.places.noVisitsDesc')
        }
    };

    let onDayPress = day => {
        let modifiedDialogSelectedDays = {...dialogSelectedDates};
        if (day.dateString in modifiedDialogSelectedDays) {
            delete modifiedDialogSelectedDays[day.dateString];
        } else {
            modifiedDialogSelectedDays[day.dateString] = {
                selected: true,
                disableTouchEvent: false,
                selectedDotColor: 'orange',
                // set both to true so that it is marked correctly
                startingDate: true,
                endingDate: true,
                timestamp: day.timestamp,
            };
        }
        setDialogSelectedDates(modifiedDialogSelectedDays);
    };

    let onAddPlace = (place, dates) => {
        // TODO: values could be undefined? latitude , longitude
        let location = {
            placeId: place.placeID,
            latitude: place.location.latitude,
            longitude: place.location.longitude,
            placeName: place.name,
            placeTypes: place.types,
            visitDates: dates,
        };

        setDialogLocation({});
        setDialogSelectedDates({});
        let modifiedLocationsAndDates = [...locationsAndDates, location];
        setLocationsAndDates(modifiedLocationsAndDates);
        _hideDialog();

        props.stepItem.onFinish(modifiedLocationsAndDates);
    };

    let state = {
        visible: false,
    };

    return (
        // style={{maxHeight: 400}}
        <View>
            <ScrollView style={styles.itemList}>
                {locationsAndDates.map((item, index) => {
                    let visitCount = 0;
                    let earliestDateKey;
                    let latestDateKey;
                    for (let key in item.visitDates) {
                        visitCount += 1;
                        let date = item.visitDates[key];
                        if (
                            earliestDateKey === undefined ||
                            date.timestamp < item.visitDates[earliestDateKey].timestamp
                        ) {
                            earliestDateKey = key;
                        }
                        if (
                            latestDateKey === undefined ||
                            date.timestamp > item.visitDates[latestDateKey].timestamp
                        ) {
                            latestDateKey = key;
                        }
                    }
                    return (
                        <Card key={index} style={styles.cardItem}>
                            <Card.Title
                                title={item.placeName}
                                subtitle={getPlaceDisplayType(item.placeTypes)[0]}
                                left={props => (
                                    <Avatar.Icon
                                        {...props}
                                        icon={getPlaceDisplayType(item.placeTypes)[1]}
                                    />
                                )}
                                right={props => (
                                    <Menu
                                        visible={isCardMenuVisible}
                                        onDismiss={_closeMenu}
                                        anchor={
                                            <IconButton
                                                {...props}
                                                icon="dots-vertical"
                                                onPress={_openMenu}
                                            />
                                        }>
                                        <Menu.Item onPress={() => {}} title="Delete" />
                                    </Menu>
                                )}
                            />
                            <Card.Content>
                                <Paragraph>
                                    {getRangeDate(visitCount, earliestDateKey, latestDateKey)}
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

            <Portal>
                <Dialog style={{height: '70%'}} visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{t('report.places.dialogTitle')}</Dialog.Title>
                    {/* <Dialog.Content> */}
                    {/* <Paragraph>This is simple dialog</Paragraph> */}
                    <Dialog.ScrollArea>
                        <ScrollView>
                            <View>
                                <Calendar
                                    minDate={getMinDate()}
                                    maxDate={getMaxDate()}
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
                        <Button onPress={() => onAddPlace(dialogLocation, dialogSelectedDates)}>
                            {t('actions.add')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
