
const t = window.TrelloPowerUp.iframe();
const context = t.getContext();
let demandChangeCount;
t.get(context.card, 'shared', 'demandChangeCount').then(demandChangeCountInResponse => {
    demandChangeCount = demandChangeCountInResponse ? demandChangeCountInResponse : 0;
    showDemandChangeCount(`total changes: ${demandChangeCount}`);
});
t.cards('all').then(function (cards) {
    console.log('t.cards(\'all\') res: ', JSON.stringify(cards, null, 2));
});
t.getAll()
    .then(function (data) {
        console.log('t.getAll(): ', JSON.stringify(data, null, 2));
    });

onRecordBtnClick = () => {
    demandChangeCount = demandChangeCount + 1;
    console.log('demandChangeCount is increased, now its value is: ', demandChangeCount);
    showDemandChangeCount(`total changes: ${demandChangeCount}`);
}

onSaveBtnClick = () => {
    t.set(context.card, 'shared', {demandChangeCount});
    const {diffChars} = require('../utils/character')
    console.log('diff of \'1asd\',\'12\'', diffChars('今晚提出一个新的方案','今晚提出一个新的方案, 不然明天讨论没东西可说'));
    console.log('diff of \'1asd\',\'12\'', diffChars('今晚提出一个新的方案','今晚提出一个'));
    showDemandChangeCount(`total changes: ${demandChangeCount} (save successfully!)`);
}

showDemandChangeCount = demandChangeCount => {
    let element = document.getElementById('demandChangeCount');
    element.innerHTML = demandChangeCount;
}
