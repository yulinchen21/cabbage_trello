export const calculateRequirementChangeCountAsSource = dataSet => {
    const _ = require('lodash');
    let data = [];
    _.forEach(dataSet, (value, key) => {
        const cardCount = value.length;
        let changeCount = 0;
        _.forEach(value, singleCard => {
            const singleCount = _.get(singleCard, 'demandChangeCount', 0);
            changeCount += singleCount;
        });
        data = [ ...data, {label: key, cardCount, changeCount}];
    })
}
