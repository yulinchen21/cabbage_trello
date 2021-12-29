let cardsInfo = [];
let labelSet = [];
let dataSet = {};

const t = window.TrelloPowerUp.iframe();

var echarts = require('echarts');
const _ = require("lodash");
var chartDom = document.getElementById('charts');
var myChart = echarts.init(chartDom);
var option;
var histogramDom = document.getElementById('histogram');
var myHistogram = echarts.init(histogramDom);
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
        console.log('cards: ', cards);
        cards.forEach(cardInfo => {
            t.get(cardInfo.id, 'shared', 'requirementChangeCount')
                .then(requirementChangeCount => {
                    cardsInfo = [...cardsInfo, {...cardInfo, requirementChangeCount}];
                })
        });
        drawPieChart();
        drawHistogram();
    });

onConfirm = () => {
    const _ = require('lodash');
    const moment = require('moment');
    const start_data_value = document.getElementById("start-date").value;
    const end_data_value = document.getElementById("end-date").value;
    const period_value = document.getElementById("period").value;
    console.log('input params: ', start_data_value, end_data_value, period_value);
    if(!start_data_value || !end_data_value || !period_value) {
        window.prompt("参数输入不完整，请补全参数");
        return;
    }
    if( !moment(start_data_value).isBefore(moment(end_data_value))){
        window.prompt("开始日期晚于结束日期，请补全参数");
        return;
    }
    if( period_value <= 0){
        window.prompt("周期输入有误");
        return;
    }
    drawHistogram(start_data_value, end_data_value, period_value);
}

drawHistogram = (start_data_value, end_data_value, period_value) => {
    const _ = require('lodash');
    const moment = require('moment');
    let source = [['cycle', 'cards count', 'changes count']];
    const period = period_value ? _.toNumber(period_value) : 14;
    const startDate = _.isEmpty(start_data_value) ? moment().local() : moment(start_data_value);
    const endDate = _.isEmpty(end_data_value) ? moment().local() : moment(end_data_value);
    console.log('period: ', period);
    console.log('startDate: ', startDate.format('yyyy/MM/DD').toString());
    console.log('endDate: ', endDate.format('yyyy/MM/DD').toString());
    for (let i = 0; i < 6; i++) {
        console.log('startDate.endOf(\'week\'): ', startDate.endOf('week').format('yyyy/MM/DD').toString());
        console.log('how many days to subtract: ', (i + 1) * period);
        const twoWeeksStart = startDate.endOf('week').subtract((i + 1) * period, 'days');
        const twoWeeksEnd = startDate.endOf('week').subtract(i * period, 'days');
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            return twoWeeksEnd.isAfter(dateLastActivityOfCard) && twoWeeksStart.isBefore(dateLastActivityOfCard);
        });
        const cardCount = list.length;
        let changeCount = 0;
        _.forEach(list, singleCard => {
            const singleCount = _.get(singleCard, 'requirementChangeCount', 0);
            changeCount += singleCount;
        });
        console.log('twoWeeksStart: ', twoWeeksStart.format('yyyy/MM/DD').toString());
        console.log('twoWeeksEnd: ', twoWeeksEnd.format('yyyy/MM/DD').toString());
        console.log('cardCount and changeCount: ', cardCount, changeCount);
        source = [...source, [`${twoWeeksStart.format('MM/DD')} ~ ${twoWeeksEnd.format('MM/DD')}`, cardCount, changeCount]];
    }
    console.log('source: ', source);
    const histogramOption = generateHistogramOption(source);
    myHistogram.setOption(histogramOption);
}

generateHistogramOption = source => {
    const _ = require('lodash');
    const labels = _.drop(source).map(data => data[0]);
    console.log('labels', labels);
    const histogramOption = {
        color: ['#d3f998', '#59c276'],
        title: {
            text: 'Requirement Changes Statistics',
            x: 'center',
            textStyle: {
                fontSize: 30
            }
        },
        legend: {
            right: '10%',
            top: '10%'
        },
        grid: {
            top: '20%'
        },
        tooltip: {},
        dataset: {
            source: [
                ['cycle', 'cards count', 'changes count'],
                ['cycle1', 7, 17],
                ['cycle2', 3, 34],
            ]
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisTick: {
                alignWithLabel: true,
                interval: '0'
            },
            axisLabel: {
                show: true,
                interval: '0'
            }
        },
        yAxis: {},
        series: [{type: 'bar'}, {type: 'bar'}]
    };
    histogramOption.dataset.source = source;
    return histogramOption;
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
            const singleCount = _.get(singleCard, 'requirementChangeCount', 0);
            changeCount += singleCount;
        });
        data = [...data, {name: key, value: changeCount}];
    })
    return data;
}
