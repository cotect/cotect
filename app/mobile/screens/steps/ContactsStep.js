import React, {useState} from 'react';

import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import {ScrollView, StyleSheet, View} from 'react-native';

import {
    Button,
    Card,
    Dialog,
    Portal,
    Paragraph,
    IconButton,
    Avatar
} from 'react-native-paper';

import StepContainer from './StepContainer';

import {Calendar} from 'react-native-calendars';

import {format, subDays, parseISO, isSameDay, isSameMonth, min, max} from 'date-fns';

import {selectContactPhone} from 'react-native-select-contact';

import {PermissionsAndroid} from 'react-native';

import {CaseContact} from '../../client/cotect-backend/index';

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

export default function ContactsStep(props) {
    const {t} = useTranslation();

    const [selectedContacts, setSelectedContacts] = useState(props.caseReport.contacts || []);
    const [isModalVisible, setModalVisible] = useState(false);
    const [dialogSelectedContact, setDialogSelectedContact] = useState({});
    const [dialogSelectedDates, setDialogSelectedDates] = useState({});

    const _showDialog = () => setModalVisible(true);
    const _hideDialog = () => setModalVisible(false);

    const getStateToBeSaved = () => {
        const caseReport = {...props.caseReport};
        caseReport.contacts = selectedContacts;
        return caseReport;
    };

    let getMinDate = () => {
        return format(subDays(new Date(), 14), 'yyyy-MM-dd');
    };

    let getMaxDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    let getRangeDate = (visitCount, earliestDate, latestDate) => {
        if (earliestDate == null || latestDate == null) {
            return t('report.contacts.noDatesDesc');
        }

        if (isSameDay(earliestDate, latestDate)) {
            return t('report.contacts.singleDateDesc', {date: format(earliestDate, 'd.M')});
        } else if (isSameMonth(earliestDate, latestDate)) {
            return t('report.contacts.datesDesc', {
                visitCount: visitCount,
                earliestDate: format(earliestDate, 'd.'),
                latestDate: format(latestDate, 'd.M.'),
            });
        } else {
            return t('report.contacts.datesDesc', {
                visitCount: visitCount,
                earliestDate: format(earliestDate, 'd.M.'),
                latestDate: format(latestDate, 'd.M.'),
            });
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
                // set both to true so that it is marked correctly
                startingDate: true,
                endingDate: true,
                timestamp: day.timestamp,
            };
        }
        setDialogSelectedDates(modifiedDialogSelectedDays);
    };

    let getSelectedContactByNumber = phoneNumber => {
        if (phoneNumber == null) {
            return null;
        }

        for (let selectedContact of selectedContacts) {
            if (selectedContact && selectedContact.phone_number === phoneNumber) {
                return selectedContact;
            }
        }
        return null;
    };

    let removeContact = phoneNumber => {
        let contact = getSelectedContactByNumber(phoneNumber);
        if (contact) {
            var index = selectedContacts.indexOf(contact);
            if (index !== -1) {
                selectedContacts.splice(index, 1);

                // TODO: workaround to reset view -> otherwise card is not removed
                setDialogSelectedContact({});
                setDialogSelectedDates({});
            }
        }
    };

    let onAddContact = (contact, markedDates) => {
        let dates = [];
        if (markedDates) {
            for (let date of markedDates) {
                dates.push(parseISO(date));
            }
        }

        // sometimes this is null or undefined
        if (contact && contact.phone_number) {
            let existingContact = getSelectedContactByNumber(contact.phone_number);
            if (existingContact && dates) {
                // contact was already added -> update
                if (existingContact.contact_dates) {
                    existingContact.contact_dates = existingContact.contact_dates.concat(dates);
                } else {
                    existingContact.contact_dates = dates;
                }
            } else {
                // only set dates, the rest is already set before
                contact.contact_dates = dates;
                let modifiedSelectedContacts = [...selectedContacts, contact];
                setSelectedContacts(modifiedSelectedContacts);
            }
        }

        setDialogSelectedContact({});
        setDialogSelectedDates({});
        _hideDialog();
    };

    let openSelectPhoneNumberModal = async () => {
        let readContactsPermission = true;
        if (Platform.OS === 'android') {
            async function requestPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                        {
                            title: t('report.contacts.permissionTitle'),
                            message: t('report.contacts.permissionMessage'),
                            buttonNeutral: t('actions.askLater'),
                            buttonNegative: t('actions.cancel'),
                            buttonPositive: t('actions.ok'),
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Contact permission granted');
                        return true;
                    } else {
                        console.log('Contact permission denied');
                        return false;
                    }
                } catch (err) {
                    console.warn(err);
                    return false;
                }
            }

            readContactsPermission = await requestPermission();
        }

        if (!readContactsPermission) {
            return true;
        }

        return selectContactPhone().then(selection => {
            if (!selection) {
                return null;
            }

            let {contact, selectedPhone} = selection;

            let caseContact = new CaseContact(selectedPhone.number);
            // this property will not be send to the server:
            caseContact.contact_name = contact.name;

            setDialogSelectedContact(caseContact);
            _showDialog();
        });
    };

    const scrollViewRef = React.createRef();
    return (
        <StepContainer
            title={t('report.contacts.title')}
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
                    {selectedContacts.map((item, index) => {
                        let visitCount = 0;
                        let earliestDate = null;
                        let latestDate = null;
                        if (item && item.contact_dates && item.contact_dates.length > 0) {
                            visitCount = item.contact_dates.length;
                            earliestDate = min(item.contact_dates);
                            latestDate = max(item.contact_dates);
                        }

                        return (
                            <Card key={index} style={styles.cardItem}>
                                <Card.Title
                                    title={item.contact_name}
                                    subtitle={item.phone_number}
                                    left={props => <Avatar.Icon {...props} icon="account" />}
                                />
                                <IconButton
                                    {...props}
                                    style={{position: 'absolute', right: 0, top: 0, bottom: 0}}
                                    icon="close"
                                    size={17}
                                    onPress={() => {
                                        removeContact(item.phone_number);
                                    }}
                                />
                                <Card.Content>
                                    <Paragraph>
                                        {getRangeDate(visitCount, earliestDate, latestDate)}
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
                    onPress={() => openSelectPhoneNumberModal()}>
                    {t('report.contacts.addContact')}
                </Button>
            </View>
            <Portal>
                <Dialog style={{height: '70%'}} visible={isModalVisible} onDismiss={_hideDialog}>
                    <Dialog.Title>{t('report.contacts.dialogTitle')}</Dialog.Title>
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
                                onAddContact(
                                    dialogSelectedContact,
                                    Object.keys(dialogSelectedDates),
                                )
                            }>
                            {t('actions.add')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </StepContainer>
    );
}

ContactsStep.propTypes = {
    caseReport: PropTypes.object.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    hideBackButton: PropTypes.bool,
    hideNextButton: PropTypes.bool,
};
