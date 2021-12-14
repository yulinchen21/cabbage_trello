import {getBoardButton} from '../board-button/capability'

const CAPABILITY_PROPS = {
    baseUrl: window.location.href.replace(/\/$/, ''),
    icon: {
        dark: '/static/icon-dark.png',
        light: '/static/icon-light.png'
    }
}

window.TrelloPowerUp.initialize({
    'board-buttons': (t) => getBoardButton(t, CAPABILITY_PROPS),
})
