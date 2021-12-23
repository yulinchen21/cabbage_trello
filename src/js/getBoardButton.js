export function getBoardButton(t, opts) {
    return [{
        text: 'Requirement Changes',
        condition: 'always',
        callback: function (t, opt) {
            t.modal({
                title: 'Requirement Change Analysis',
                url: './requirementChangeAnalysis.html',
                height: 800,
            })
        }
    }];
}
