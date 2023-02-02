import { AlphabetGame } from "./alphabetGame.js";

main();

function main() {
    const displayerSvg = document.getElementById('displayer-svg');
    const synth = window.speechSynthesis;
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level') || '1');
    const maxNumRounds = parseInt(urlParams.get('rounds') || '30');
    const playerName = urlParams.get('name') || '';
    const game = new AlphabetGame({displayerSvg: displayerSvg, synth: synth, maxNumRounds: maxNumRounds, playerName: playerName});
    game.setLevel(level);
    let isLocked = false;
    document.addEventListener("keydown", async event => {
        if (event.metaKey || event.ctrlKey) {
            return;
        }

        // E.g. kids press on random keys like Tab to break out of the game accidentally.
        event.preventDefault();
        
        if (synth.speaking || isLocked) {
            return;
        }

        isLocked = true;
        try {
            await game.respond(event.key);
        } finally {
            isLocked = false;
        }
    });
}
