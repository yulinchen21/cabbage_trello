console.log("hello world!")

var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
var BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

var onBtnClick = function (t, opts) {
    console.log('Someone clicked the button');
};

window.TrelloPowerUp.initialize({
    'board-buttons': function (t, opts) {
        return [{
            // we can either provide a button that has a callback function
            icon: {
                dark: WHITE_ICON,
                light: BLACK_ICON
            },
            text: 'Callback',
            callback: onBtnClick,
            condition: 'edit'
        }, {
            // or we can also have a button that is just a simple url
            // clicking it will open a new tab at the provided url
            icon: {
                dark: WHITE_ICON,
                light: BLACK_ICON
            },
            text: 'URL',
            condition: 'always',
            url: 'https://trello.com/inspiration',
            target: 'Inspiring Boards' // optional target for above url
        }];
    },
    'attachment-sections': function(t, options){
        // options.entries is a list of the attachments for this card
        // you can look through them and 'claim' any that you want to
        // include in your section.

        // we will just claim urls for Yellowstone
        var claimed = options.entries.filter(function (attachment) {
            return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
        });

        // you can have more than one attachment section on a card
        // you can group items together into one section, have a section
        // per attachment, or anything in between.
        if (claimed && claimed.length > 0) {
            // if the title for your section requires a network call or other
            // potentially lengthy operation you can provide a function for the title
            // that returns the section title. If you do so, provide a unique id for
            // your section
            return [{
                id: 'Yellowstone', // optional if you aren't using a function for the title
                claimed: claimed,
                icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
                title: 'Example Attachment Section: Yellowstone',
                content: {
                    type: 'iframe',
                    url: t.signUrl('./section.html', {
                        arg: 'you can pass your section args here'
                    }),
                    height: 230
                }
            }];
        } else {
            return [];
        }
    }
});
