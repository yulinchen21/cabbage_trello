let cardsInfo = [];
let labelSet = [];
let dataSet = {};

const t = window.TrelloPowerUp.iframe();

t.board('labels').then(res => {
    const _ = require('lodash');
    labelSet = _.filter(res.labels, label => label.name !== '');
    console.log('labelSet: ', labelSet);
});
t.cards('id', 'labels', 'name')
    .then(cards => {
        cards.forEach(cardInfo => {
            t.get(cardInfo.id, 'shared', 'demandChangeCount')
                .then(demandChangeCount => {
                    cardsInfo = [...cardsInfo, {...cardInfo, demandChangeCount}]
                })
        })
    });

startAnalysis = () => {
    const _ = require('lodash');
    _.forEach(labelSet, label => {
        const list = _.filter(cardsInfo, cardInfo => {
            return _.find(cardInfo.labels, singleLabel => singleLabel.name === label.name)
        });
        dataSet = {...dataSet, [label.name]: list};
    });
    console.log('cardsInfo: ', cardsInfo);
    console.log('dataSet: ', dataSet);
}
