import { makePubSub } from "../esModules/pub-sub/pubSub.js";
import { AlphabetGame } from "./alphabetGame.js";
import { Keyboard } from "./keyboard.js";
import { Menu } from "./menu.js";
import { sanitizeName } from "./sanitizeName.js";
import { getUrlParamsMap } from "./url.js";

main();

function main() {
    const displayerSvg = document.getElementById('displayer-svg');
    const paramsMap = getUrlParamsMap();
    const level = parseInt(paramsMap.get('level') || '1');
    const maxNumRounds = parseInt(paramsMap.get('tries') || '20');
    const playerName = sanitizeName(paramsMap.get('name')  || '');
    const [numRemainingTriesPub, numRemainingTriesSub] = makePubSub();
    numRemainingTriesSub(num => document.getElementById('remaining-tries-display').textContent = num);

    const game = new AlphabetGame({
        displayerSvg: displayerSvg,
        maxNumRounds: maxNumRounds,
        playerName: playerName,
        numRemainingTriesPub: numRemainingTriesPub,
    });
    game.loadLevel(level);
    const keyboard = new Keyboard({game: game});
    const _ = new Menu({
        buttonHtml: document.getElementById('menu-toggle-button'),
        menuHtml: document.getElementById('menu-panel'),
        nameInputHtml: document.getElementById('name-input'),
        levelDisplayHtml: document.getElementById('level-display'),
        incrLevelHtml: document.getElementById('incr-level-btn'),
        decrLevelHtml: document.getElementById('decr-level-btn'),
        triesDisplayHtml: document.getElementById('remaining-tries-display'),
        incrTriesHtml: document.getElementById('incr-tries-btn'),
        decrTriesHtml: document.getElementById('decr-tries-btn'),
        game: game, keyboard: keyboard,
    })
}
