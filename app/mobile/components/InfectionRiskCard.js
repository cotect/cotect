import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {Avatar, Button, Card, IconButton, Paragraph} from 'react-native-paper';

import {CARD_ITEM, PRIMARY_COLOR} from '../constants/DefaultStyles';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
});

//<Card.Actions>
// <Button>{t('actions.update')}</Button>
// <IconButton color={PRIMARY_COLOR} icon="information-outline" />
// </Card.Actions>

export default function InfectionRiskCard(props) {
    const {t} = useTranslation();

    return (
        <Card style={{...styles.cardItem, ...props.style}}>
            <Card.Title
                title={t('assesments.infectionRisk.title')}
                subtitle={t('assesments.infectionRisk.updateLabel', {
                    date: t('basics.today').toLowerCase(),
                })}
                left={props => <Avatar.Icon {...props} icon="shield-check" />}
            />
            <Card.Content>
                <Paragraph>{t('assesments.infectionRisk.noAssesmentDesc')}</Paragraph>
            </Card.Content>
        </Card>
    );
}

InfectionRiskCard.propTypes = {
    style: PropTypes.object,
};
