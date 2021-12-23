const _ = require("lodash");
const moment = require("moment");
test('adds 1 + 2 to equal 3', () => {
    const _ = require('lodash');
    const dataSet = {
        I1: [{id: '61bf1e5ec25291767a16fe62', name: '提出一个新的方案', demandChangeCount: 0},
            {id: '61b8095076a18840dff3990a', name: 'asdf', demandChangeCount: 7}],
        I2: [{id: '61ba0afd99a5528a015079ce', name: 'alalhala', demandChangeCount: 5}],
        I3: [{id: '61ba0b02f7b1d82d31acdf31', name: 'aloha', demandChangeCount: 4}],
        I4: [],
        I5: [],
        template: [{id: '61bf17331ba9451009b9f9ad', name: 'card-template', demandChangeCount: 2},
            {id: '61c0403bd735c71ef6d90789', name: 'It is A TEST CARD!', demandChangeCount: 7},
            {id: '61b80c5de324fc193d212859', name: 'hello', demandChangeCount: 23}],
    }
    let data = [];
    _.forEach(dataSet, (value, key) => {
        console.log('key: ', key);
        console.log('value: ', value);
        const cardCount = value.length;
        let changeCount = 0;
        _.forEach(value, singleCard => {
            const singleCount = _.get(singleCard, 'demandChangeCount', 0);
            changeCount += singleCount;
        });
        data = [ ...data, {label: key, cardCount, changeCount}];
    })
    expect(data).toBe(2);
});

test('test momentjs', () => {
    const _ = require('lodash');
    const dataSet = {
        I1: [{id: '61bf1e5ec25291767a16fe62', name: '提出一个新的方案', demandChangeCount: 0},
            {id: '61b8095076a18840dff3990a', name: 'asdf', demandChangeCount: 7}],
        I2: [{id: '61ba0afd99a5528a015079ce', name: 'alalhala', demandChangeCount: 5}],
        I3: [{id: '61ba0b02f7b1d82d31acdf31', name: 'aloha', demandChangeCount: 4}],
        I4: [],
        I5: [],
        template: [{id: '61bf17331ba9451009b9f9ad', name: 'card-template', demandChangeCount: 2},
            {id: '61c0403bd735c71ef6d90789', name: 'It is A TEST CARD!', demandChangeCount: 7},
            {id: '61b80c5de324fc193d212859', name: 'hello', demandChangeCount: 23}],
    }
    const moment = require('moment');
    for (let i = 0; i < 6; i++) {
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            const twoWeeksStart = moment().local().endOf('week').subtract((i + 1) * 14, 'days');
            const twoWeeksEnd = moment().local().endOf('week').subtract(i * 14);
            return twoWeeksEnd.isAfter(dateLastActivityOfCard) && twoWeeksStart.isBefore(dateLastActivityOfCard);
        });
        console.log('list: ', list);
    }
    expect(data).toBe(2);
});
