let cardsInfo = [];
let labelSet = [];
let dataSet = {};
let dataSetByList = {};
let listsInfo = {};

const t = window.TrelloPowerUp.iframe();

var echarts = require('echarts');

var chartDom = document.getElementById('charts');
var myChart = echarts.init(chartDom);
var option;

var chartByListDom = document.getElementById('charts-by-list');
var chartByList = echarts.init(chartByListDom);
var optionByList;

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
});
t.lists('all').then(lists => {
    listsInfo = lists;
});
t.cards('id', 'idList', 'labels', 'name', 'dateLastActivity')
    .then(cards => {
        let itemsProcessed = 0;
        cards.forEach((cardInfo, index, array) => {
            t.get(cardInfo.id, 'shared', 'demandChangeCount')
                .then(demandChangeCount => {
                    cardsInfo = [...cardsInfo, {...cardInfo, demandChangeCount}];
                })
                .then(() => {
                        itemsProcessed++;
                        if (itemsProcessed === array.length) {
                            drawPieChart();
                            drawHistogram();
                        }
                    }
                );

        });
    });

onConfirm = () => {
    const _ = require('lodash');
    const moment = require('moment');
    const start_data_value = document.getElementById("start-date").value;
    const end_data_value = document.getElementById("end-date").value;
    const period_value = document.getElementById("period").value;
    if (!start_data_value || !end_data_value || !period_value) {
        window.prompt("???????????????????????????????????????");
        return;
    }
    if (!moment(start_data_value).isBefore(moment(end_data_value))) {
        window.prompt("????????????????????????????????????????????????");
        return;
    }
    if (period_value <= 0) {
        window.prompt("??????????????????");
        return;
    }
    drawHistogram(start_data_value, end_data_value, period_value);
}

drawHistogram = (start_data_value, end_data_value, period_value) => {
    const _ = require('lodash');
    const moment = require('moment');
    let source = [['cycle', 'cards count', 'changes count']];
    const period = period_value ? _.toNumber(period_value) : 14;
    const startDate = _.isEmpty(start_data_value) ? moment().local().endOf('week').subtract(14 * 6, 'days') : moment(start_data_value).subtract(1, 'minutes').endOf('day');
    const endDate = _.isEmpty(end_data_value) ? moment().local().endOf('week') : moment(end_data_value);
    let periodStartPivot = startDate;
    while (endDate.isAfter(periodStartPivot)) {
        const periodStart = _.cloneDeep(periodStartPivot).add(1, 'minutes').startOf('day');
        const periodEnd = periodStartPivot.add(period, 'days');
        const list = _.filter(cardsInfo, cardInfo => {
            const dateLastActivityOfCard = moment(cardInfo.dateLastActivity);
            return periodStart.isBefore(dateLastActivityOfCard) && periodEnd.isAfter(dateLastActivityOfCard) && _.get(cardInfo, 'demandChangeCount');
        });
        const cardCount = list.length;
        let changeCount = 0;
        _.forEach(list, singleCard => {
            const singleCount = _.get(singleCard, 'demandChangeCount', 0);
            changeCount += singleCount;
        });
        console.log('periodStart: ', periodStart.format('yyyy/MM/DD HH:mm:ss.SSS').toString());
        console.log('periodEnd: ', periodEnd.format('yyyy/MM/DD HH:mm:ss.SSS').toString());
        source = [...source, [`${periodStart.format('yyyy/MM/DD')}~${periodEnd.format('yyyy/MM/DD')}`, cardCount, changeCount]];
    }
    const histogramOption = generateHistogramOption(source);
    myHistogram.setOption(histogramOption);
}

generateHistogramOption = source => {
    const histogramOption = {
        color: ['#d3f998', '#59c276'],
        legend: {
            show: false
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
            axisTick: {},
            axisLabel: {
                show: true,
            }
        },
        yAxis: {},
        dataZoom: [
            {
                type: 'inside'
            },
            {
                type: 'slider'
            }
        ],
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
    _.forEach(listsInfo, listInfo => {
        const list = _.filter(cardsInfo, cardInfo => cardInfo.idList === listInfo.id);
        dataSetByList = {...dataSetByList, [listInfo.name]: list};
    });
    const data = calculateDemandChangeCountAndCardCountAsSource(dataSet);
    option = generatePieChartOption(data);
    myChart.setOption(option);

    const dataByList = calculateDemandChangeCountAndCardCountAsSource(dataSetByList);
    console.log('dataByList: ', dataByList);
    optionByList = generatePieChartOption(dataByList);
    console.log('optionByList: ', optionByList);
    chartByList.setOption(optionByList);
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

calculateDemandChangeCountAndCardCountAsSource = dataSet => {
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
