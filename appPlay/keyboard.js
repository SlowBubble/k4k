
export class Keyboard {
    constructor({game}) {
        this.enabled = true;

        let isLocked = false;
        document.addEventListener("keydown", async event => {
            if (!this.enabled) {
                return;
            }
            if (event.metaKey || event.ctrlKey) {
                return;
            }
        
            // E.g. kids press on random keys like Tab to break out of the game accidentally.
            event.preventDefault();
            
            if (window.speechSynthesis.speaking || isLocked) {
                return;
            }
        
            isLocked = true;
            try {
                await game.respond(event.key.toLowerCase());
            } finally {
                isLocked = false;
            }
        });
    }
}