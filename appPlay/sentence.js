
export class Sentence {
    constructor({ content = '', speechRate = 0.95, voice = null }) {
        this.content = content;
        this.speechRate = speechRate;
        this.voice = voice;
    }
}
