export let getPlaceDisplayType = (types, translation) => {
    let t = translation;

    if (types === null) {
        return [t('report.places.types.place'), 'map-marker'];
    }

    if (types.indexOf('airport') >= 0) {
        return [t('report.places.types.airport'), 'airport'];
    } else if (types.indexOf('train_station') >= 0) {
        return [t('report.places.types.trainStation'), 'train'];
    } else if (types.indexOf('bank') >= 0) {
        return [t('report.places.types.bank'), 'bank'];
    } else if (types.indexOf('museum') >= 0) {
        return [t('report.places.types.museum'), 'bank'];
    } else if (types.indexOf('atm') >= 0) {
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
    } else if (types.indexOf('lodging') >= 0) {
        return [t('report.places.types.lodging'), 'hotel'];
    } else if (types.indexOf('store') >= 0) {
        return [t('report.places.types.store'), 'store'];
    } else if (types.indexOf('establishment') >= 0) {
        return [t('report.places.types.establishment'), 'home-modern'];
    } else if (types.indexOf('street_address') >= 0) {
        return [t('report.places.types.street_address'), 'home-group'];
    } else if (types.indexOf('route') >= 0) {
        return [t('report.places.types.street_address'), 'home-group'];
    } else if (types.indexOf('postal_code') >= 0) {
        return [t('report.places.types.postal_code'), 'home-city'];
    } else if (types.indexOf('country') >= 0) {
        return [t('report.places.types.country'), 'earth-box'];
    } else if (types.indexOf('sublocality') >= 0) {
        return [t('report.places.types.locality'), 'home-city'];
    } else if (types.indexOf('locality') >= 0) {
        return [t('report.places.types.locality'), 'home-city'];
    }

    // home-modern, home-group, map-marker, map-marker-outline, map-marker-radius
    // office-building, road-variant, shield-check, shield-check-outline, shield-account
    // shield-lock, shield-plus, marker-check
    return [t('report.places.types.place'), 'map-marker'];
};
