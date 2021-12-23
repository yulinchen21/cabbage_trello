let cardsInfo = [];
let labelSet = [];
let dataSet = {};

const t = window.TrelloPowerUp.iframe();

var echarts = require('echarts');
const moment = require("moment");
const _ = require("lodash");
var chartDom = document.getElementById('charts');
var myChart = echarts.init(chartDom);
var option;
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    dataset: {
        dimensions: ['product', '2015', '2016', '2017'],
        source: [
            {product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7},
            {product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1},
            {product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5},
            {product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1}
        ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: [{type: 'bar'}, {type: 'bar'}]
};


t.board('labels').then(res => {
    const _ = require('lodash');
    labelSet = _.filter(res.labels, label => label.name !== '');
    console.log('labelSet: ', labelSet);
});
t.cards('id', 'labels', 'name', 'dateLastActivity')
    .then(cards => {
        cards.forEach(cardInfo => {
            t.get(cardInfo.id, 'shared', 'demandChangeCount')
                .then(demandChangeCount => {
                    cardsInfo = [...cardsInfo, {...cardInfo, demandChangeCount}]
                })
        });
        console.log('cardsInfo: ', cardsInfo);
    });

startAnalysis = () => {
    drawPieChart();
    drawHistogram();
}

drawHistogram = () => {
    const _ = require('lodash');
    const moment = require('moment');
    let source = [['cycle', 'cards count', 'changes count']];
    for (let i = 0; i < 6; i++) {
        const twoWeeksStart = moment().local().endOf('week').subtract((i + 1) * 14, 'days');
        const twoWeeksEnd = moment().local().endOf('week').subtract(i * 14);
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            return twoWeeksEnd.isAfter(dateLastActivityOfCard) && twoWeeksStart.isBefore(dateLastActivityOfCard);
        });
        const cardCount = list.length;
        let changeCount = 0;
        _.forEach(list, singleCard => {
            const singleCount = _.get(singleCard, 'demandChangeCount', 0);
            changeCount += singleCount;
        });
        source = [ ...source, [twoWeeksStart.toString(), cardCount, changeCount]];
    }
    console.log('source: ', source);
    return source;
}

generateHistogramOption = data => {

}

drawPieChart = () => {
    const _ = require('lodash');
    _.forEach(labelSet, label => {
        const list = _.filter(cardsInfo, cardInfo => {
            return _.find(cardInfo.labels, singleLabel => singleLabel.name === label.name)
        });
        dataSet = {...dataSet, [label.name]: list};
    });
    const data = calculateRequirementChangeCountAndCardCountAsSource(dataSet);
    option = generatePieChartOption(data);
    myChart.setOption(option);
}

generatePieChartOption = data => {
    const pieChartOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            }
        ]
    };
    pieChartOption.series[0].data = data;
    return pieChartOption;
}

calculateRequirementChangeCountAndCardCountAsSource = dataSet => {
    const _ = require('lodash');
    let data = [];
    _.forEach(dataSet, (value, key) => {
        let changeCount = 0;
        _.forEach(value, singleCard => {
            const singleCount = _.get(singleCard, 'demandChangeCount', 0);
            changeCount += singleCount;
        });
        data = [...data, {name: key, value: changeCount}];
    })
    return data;
}
