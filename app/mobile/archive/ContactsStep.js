
import React, { useState } from 'react';

import { StyleSheet, View, ScrollView } from 'react-native';

import { Button, Card, Dialog, Portal, Text, Title, Paragraph, IconButton, Avatar } from 'react-native-paper';

import { selectContactPhone } from 'react-native-select-contact';

import {PermissionsAndroid} from 'react-native';

const styles = StyleSheet.create({
    itemList: {
        flexGrow: 0
    },
    cardItem: {
        elevation: 2,
        margin: 8
    },
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
});

export default function ContactsStep(props) {

    const [selectedContacts, setSelectedContacts] = useState(props.stepItem.initialProps || []);

    let selectPhoneNumber = (name, number) => {
        // TODO: add logic so that the contact date can be set
        let newSelectedContact = { phoneNumber: number, contactDate: new Date(), name: name};
        let modifiedSelectedContacts = [...selectedContacts, newSelectedContact];
        setSelectedContacts(modifiedSelectedContacts);

        props.stepItem.onFinish(modifiedSelectedContacts);
    }

    let getPhoneNumber = async () => {
        let readContactsPermission = true;
        if (Platform.OS === 'android') {
            async function requestPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                        {
                            title: 'Contact Permission',
                            message:
                                'Cotect needs to request your contact when you want to add them here',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
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

        return selectContactPhone()
            .then(selection => {
                if (!selection) {
                    return null;
                }
                
                let { contact, selectedPhone } = selection;
                // console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
                // return selectedPhone.number;
                selectPhoneNumber(contact.name, selectedPhone.number);
            });  
    }

    return (
        <View>
           <ScrollView style={styles.itemList}>
                {selectedContacts.map((contact, index) => {
                    return (
                        <Card style={styles.cardItem}>
                            <Card.Title
                                key={index}
                                style={styles.cardItem}
                                title={contact.name}
                                subtitle={contact.phoneNumber}
                                left={props => <Avatar.Icon {...props} icon="account" />}
                                right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                            />
                            <Card.Content>
                                <Paragraph>In closer contact 3 times between 21.03-26.03</Paragraph>
                            </Card.Content>
                        </Card>
                    )
                })}
            </ScrollView>
            <Button
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => getPhoneNumber()}
                >
                    Add Contact
                </Button>
        </View>
    ); 
};
// 