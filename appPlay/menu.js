import { maxLevel } from "./alphabetGame.js";
import { sanitizeName } from "./sanitizeName.js";
import { setUrlParam } from "./url.js";

export class Menu {
    constructor({buttonHtml, menuHtml, nameInputHtml,
        levelDisplayHtml, incrLevelHtml, decrLevelHtml,
        triesDisplayHtml, incrTriesHtml, decrTriesHtml,
        game, keyboard}) {
        this.isVisible = false;
        this.menuHtml = menuHtml;

        nameInputHtml.onfocus = _ => {
            keyboard.enabled = false;
        }

        nameInputHtml.value = game.playerName;
        nameInputHtml.onblur = _ => {
            keyboard.enabled = true;
            const cleanName = sanitizeName(nameInputHtml.value);
            
            nameInputHtml.value = cleanName;
            setUrlParam('name', cleanName);
            game.loadPlayerName(cleanName);
        }
        nameInputHtml.onkeyup = evt => {
            if (evt.key === 'Enter') {
                nameInputHtml.blur();
            }
        }

        incrTriesHtml.onclick = _ => {
            if (game.numRounds > 0) {
                game.setNumRounds(0);
                return;
            }
            game.setMaxNumRounds(game.maxNumRounds + 5);
            setUrlParam('tries', game.maxNumRounds);
        }
        decrTriesHtml.onclick = _ => {
            if (game.maxNumRounds >= 5) {
                game.setMaxNumRounds(game.maxNumRounds - 5);
            } else {
                game.setNumRounds(game.maxNumRounds);
            }
            setUrlParam('tries', game.maxNumRounds);
        }

        levelDisplayHtml.textContent = game.level;
        incrLevelHtml.onclick = _ => updateLevel(mod(game.level + 1, maxLevel + 1))
        decrLevelHtml.onclick = _ => updateLevel(mod(game.level - 1, maxLevel + 111))

        function updateLevel(nextLevel) {
            game.loadLevel(nextLevel);
            setUrlParam('level', nextLevel);
            levelDisplayHtml.textContent = nextLevel;
        }

        buttonHtml.onclick = _ => {
            this.isVisible = !this.isVisible;
            this.renderMenu();
        }
        this.renderMenu();
    }
    renderMenu() {
        this.menuHtml.style.display = this.isVisible ? '' : 'none';
    }
}

function mod(x, y) {
    return ((x % y) + y) % y;
  }