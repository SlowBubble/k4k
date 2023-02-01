import { AlphabetGame } from "./alphabetGame.js";
import { levelToAssetUrl } from "./template.js";

main();

function main() {
    const displayerSvg = document.getElementById('displayer-svg');
    const header = document.getElementById('instruction-header');
    const synth = window.speechSynthesis;
    const game = new AlphabetGame({displayerSvg: displayerSvg, synth: synth});
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level') || 1);
    game.setLevel(level);
    document.addEventListener("keydown", event => {
        if (event.metaKey) {
            return;
        }

        // E.g. kids press on random keys like Tab to break out of the game accidentally.
        event.preventDefault();
        
        if (synth.speaking) {
            return;
        }
        header.innerHTML = '';
        game.respond(event.key);
    });
}
