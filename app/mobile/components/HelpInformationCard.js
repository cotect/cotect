import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {List, Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

import {CARD_ITEM, PRIMARY_COLOR} from '../constants/DefaultStyles';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
    listElement: {
        fontSize: 14,
    },
    expandableElement: {
        padding: 0,
        margin: 0,
    },
});
//<Card.Actions>
// <Button>{t('actions.update')}</Button>
// <IconButton color={PRIMARY_COLOR} icon="information-outline" />
// </Card.Actions>

export default function HelpInformationCard(props) {
    const {t} = useTranslation();

    return (
        <Card style={{...styles.cardItem, ...props.style}}>
            <Card.Title
                title={"Get Help"}
                subtitle={"Hotlines & Testing Sites"}
                left={props => <Avatar.Icon {...props} icon="shield-check" />}
            />
            <Card.Content>
            <List.Accordion
                    style={styles.expandableElement}
                    title={"Help Hotlines"}
                    left={props => <List.Icon {...props} icon="phone" />}>
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Charité Virchow Wedding"
                            />
                </List.Accordion>
            <List.Accordion
                    style={styles.expandableElement}
                    title={"Testing Sites"}
                    left={props => <List.Icon {...props} icon="test-tube" />}>
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Campus Virchow-Klinikum"
                            />
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Vivantes Prenzlauer Berg"
                            />
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Vivantes Wenckebach-Klinikum"
                            />
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Evangelisches Krankenhaus Königin Elisabeth Herzberge"
                            />
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Gemeinschaftskrankenhaus Havelhöhe"
                            />
                            <List.Item
                                titleStyle={styles.listElement}
                                title="DRK Kliniken Berlin Westend"
                            />
                </List.Accordion>
                <List.Accordion
                    style={styles.expandableElement}
                    title={"Help Websites"}
                    left={props => <List.Icon {...props} icon="comment-question" />}>
                            <List.Item
                                titleStyle={styles.listElement}
                                title="Charité Virchow Wedding"
                            />
                </List.Accordion>
            </Card.Content>
        </Card>
    );
}

HelpInformationCard.propTypes = {
    style: PropTypes.object,
};
