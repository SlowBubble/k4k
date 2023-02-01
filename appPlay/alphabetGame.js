import { generateDefaultSentences, templateToSentences } from "./diaglogue.js";
import { getKeyToTemplate } from "./template.js";
import { Sentence } from "./sentence.js";
import { speakSentence } from "./speechSynth.js";
import { templateToSvgElts } from "./image.js";

export class AlphabetGame {
    constructor({level = 0, displayerSvg = null, synth = null, maxNumRounds = 0, playerName = ''}) {
        this.level = level;
        this.displayerSvg = displayerSvg;
        this.synth = synth;
        this.numWrongKeys = 0;
        this.numRounds = 0;
        this.maxNumRounds = maxNumRounds;
        this.keyToTemplate = new Map();
        this.prevLetterTemplate = null;
        this.playerName = playerName;
    }

    getGreeting() {
        const prefixes = ['Hey', '', ''];
        const names = [`, ${this.playerName}`, 'buddy', 'my friend', '', '', '', ''];
        const prefix = prefixes[getRandomInt(prefixes.length)];
        const name = names[getRandomInt(names.length)];
        if (!name && !prefix) {
            return '';
        }
        return `${prefix} ${name}. `;
    }

    respond(key) {
        if (this.numRounds >= this.maxNumRounds) {
            speakSentence(new Sentence({content: this.getGreeting(), speechRate: 0.7}));
            speakSentence(new Sentence({content: 'Game time is over.', speechRate: 0.8}));
            speakSentence(new Sentence({content: 'Go take a break.', speechRate: 0.7}));
            return;
        }

        const isLetter = key.match(/^[a-z]$/i);
        const isNumber = key.match(/^[0-9]$/i);
        if (!isLetter && !isNumber) {
            this.numWrongKeys++;
            let content = 'Please press on a letter or a number.';
            if (this.numWrongKeys > 1) {
                content = 'You are not pressing on a letter or a number.'
            }
            speakSentence(new Sentence({content: this.getGreeting(), speechRate: 0.7}));
            speakSentence(new Sentence({content: content, speechRate: 0.9}));
            return;
        }
        const numberOrNull = isNumber ? parseInt(key) : null;
        let sentences;
        let svgElts;
        if (this.keyToTemplate.has(key)) {
            const currTemplate = this.keyToTemplate.get(key);
            sentences = templateToSentences(currTemplate, this.prevLetterTemplate, this.getGreeting());
            if (isLetter) {
                this.prevLetterTemplate = this.keyToTemplate.get(key);
            }
            svgElts = templateToSvgElts(numberOrNull, currTemplate, this.prevLetterTemplate);
        } else {
            sentences = generateDefaultSentences(key, this.numRounds % 5 === 0);
        }
        sentences.forEach(sentence => {
            speakSentence(sentence);
        });
        if (svgElts) {
            renderSvg(this.displayerSvg, svgElts);
        } else {
            renderTextInSvg(this.displayerSvg, key.toUpperCase());
        }
        this.numRounds++;

        if (this.numRounds >= this.maxNumRounds) {
            setTimeout(_ => {
                renderTextInSvg(this.displayerSvg, 'Game Over'.toUpperCase(), 150);
            }, 5000);
        }
    }

    async setLevel(level) {
        this.level = level;
        this.keyToTemplate = await getKeyToTemplate(level);
        this.prevLetterTemplate = this.keyToTemplate.get('a');
    }
}

function renderSvg(svg, svgElts) {
    svg.innerHTML = '';
    svgElts.forEach(elt => {
        svg.appendChild(elt);
    });

}

function renderTextInSvg(svg, key, fontSize) {
    svg.innerHTML = '';
    fontSize ||= 350;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "10");
    text.setAttribute("y", "50");
    text.setAttribute("font-size", fontSize);
    text.setAttribute("font-family", "Arial");
    text.setAttribute('alignment-baseline', 'hanging');
    text.textContent = key;
    svg.appendChild(text);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}