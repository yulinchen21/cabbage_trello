test('adds 1 + 2 to equal 3', () => {
    const _ = require('lodash');
    const labelSet = {
        labels: [
            {id: '61b719ba8166f38753eac82f', name: 'template', color: 'blue'},
            {id: '61b719ba8166f38753eac826', name: '', color: 'green'},
            {id: '61b719ba8166f38753eac827', name: '', color: 'yellow'},
            {id: '61b719ba8166f38753eac82a', name: '', color: 'orange'},
            {id: '61b719ba8166f38753eac82d', name: '', color: 'red'},
            {id: '61b719ba8166f38753eac82e', name: '', color: 'purple'}
        ]
    }
    const cardsInfo = [
        {
            id: '61bf17331ba9451009b9f9ad',
            labels: [{id: '61b719ba8166f38753eac82f', name: 'template', color: 'blue'}],
            name: 'card-template',
            demandChangeCount: 2
        },
        {id: '61ba0afd99a5528a015079ce', labels: [], name: 'alalhala', demandChangeCount: 5},
        {id: '61ba0b02f7b1d82d31acdf31', labels: [], name: 'aloha', demandChangeCount: 0},
        {id: '61c0403bd735c71ef6d90789', labels: [], name: 'It is A TEST CARD!', demandChangeCount: 4},
        {id: '61bf1e5ec25291767a16fe62', labels: [], name: '提出一个新的方案', demandChangeCount: 0},
        {id: '61b80c5de324fc193d212859', labels: [], name: 'hello', demandChangeCount: 20},
        {id: '61b8095076a18840dff3990a', labels: [], name: 'asdf', demandChangeCount: 6}
    ];
    let data = [];
    _.forEach(labelSet.labels, label => {
        const list = _.filter(cardsInfo, cardInfo => {
            return _.find(cardInfo.labels, singleLabel => {
                return singleLabel.name === label.name;
            })
        });
        data = [...data, {[label.name]: list}];
    })
    expect(data).toBe(2);
});
