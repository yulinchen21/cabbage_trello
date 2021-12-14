export function getBoardButton(t, opts) {
    return [{
        text: 'Requirement Changes',
        condition: 'always',
        callback: function (t, opt) {
            t.popup({
                title: 'Requirement Change Analysis',
                url: './requirementChangeAnalysis.html',
            })
        }
    }];
}
