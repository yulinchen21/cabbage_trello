const echarts = require("echarts");

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
    const source = calculateRequirementChangeCountAsSource(dataSet);
    const labels = _.map(labelSet, iteration => iteration.name);
    console.log('source: ', source);
    console.log('labels: ', labels);

    var echarts = require('echarts');
    var chartDom = document.getElementById('charts');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        dataset: {
            dimensions: ['product', '2015', '2016', '2017'],
            source: [
                { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
                { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
                { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
                { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
            ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    };
    option.dataset.dimensions = ['label', ...labels];
    option.dataset.source = source;
    option.series = [{ type: 'bar' }, { type: 'bar' }];
    option && myChart.setOption(option);
    console.log('option: ', option);
}

calculateRequirementChangeCountAsSource = dataSet => {
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
    return data;
}
