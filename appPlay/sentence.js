
export class Sentence {
    constructor({ content = '', speechRate = 0.95, voice = null, action, afterAction }) {
        this.content = content;
        this.speechRate = speechRate;
        this.voice = voice;
        this.action = action;
        this.afterAction = afterAction;
    }
}
