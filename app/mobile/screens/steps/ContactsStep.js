
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button, Card, Paragraph } from 'react-native-paper';

import { selectContactPhone } from 'react-native-select-contact';

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

    let getPhoneNumber = () => {
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