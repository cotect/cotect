import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {Avatar, Button, Card, IconButton, Paragraph} from 'react-native-paper';

import {CARD_ITEM, PRIMARY_COLOR} from '../constants/DefaultStyles';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const styles = StyleSheet.create({
    cardItem: CARD_ITEM,
});

//<Card.Actions>
// <Button>{t('actions.update')}</Button>
// <IconButton color={PRIMARY_COLOR} icon="information-outline" />
// </Card.Actions>

// <View >
//            <AnimatedCircularProgress
//            style={{  marginTop: 10}}
//          size={60}
//          width={8}
//          backgroundWidth={6}
//          fill={40}
//          tintColor={PRIMARY_COLOR}
//          //tintColorSecondary="#dc8580"
//          backgroundColor="#A0A0A0"
//          arcSweepAngle={200}
//          rotation={260}
//          lineCap="round"
//        />
//s                </View>

export default function InfectionRiskCard(props) {
    const {t} = useTranslation();

    return (
        <Card style={{...styles.cardItem, ...props.style}}>
            <Card.Title
                title={t('assesments.infectionRisk.title')}
                subtitle={t('assesments.infectionRisk.updateLabel', {
                    date: t('basics.today').toLowerCase(),
                })}
                left={props => <Avatar.Icon {...props} icon="chart-bar-stacked" />}
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
