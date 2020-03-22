
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button, Card, Paragraph } from 'react-native-paper';

import { selectContactPhone } from 'react-native-select-contact';

import {PermissionsAndroid} from 'react-native';

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
    },
    itemList: {
        width: "90%", alignSelf: "center"
    },
});

export default function ContactsStep(props) {

    const [selectedContacts, setSelectedContacts] = useState(props.stepItem.initialProps || []);

    let selectPhoneNumber = (number) => {
        // TODO: add logic so that the contact date can be set
        let newSelectedContact = { phoneNumber: number, contactDate: new Date() };
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
                selectPhoneNumber(selectedPhone.number);
            });  
    }

    return (
        <View>
            <View style={styles.itemList}>
                {selectedContacts.map((contact, index) => {
                    return (
                        <Card 
                            key={index}
                            style={styles.cardItem}
                        >
                             <Card.Content>
                                <Paragraph>{contact.phoneNumber}</Paragraph>
                            </Card.Content> 
                        </Card>
                    )
                })}

                <Button
                    mode="outlined"
                    style={styles.actionButton}
                    labelStyle={styles.actionButtonLabel}
                    onPress={() => getPhoneNumber()}
                >
                    Pick a Contact's Phone Number
                </Button>
            </View>
           
        </View>
    ); 
};
// 