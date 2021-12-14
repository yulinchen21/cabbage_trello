var t = window.TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.alert({
    message: 'Powering-Up, give us a second...'
});

// more complex alert
t.alert({
    message: 'Powered-Up Successfully 🎉',
    duration: 6,
});
