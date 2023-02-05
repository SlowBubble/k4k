import { generateDefaultSentences, templateToSentences } from "./diaglogue.js";
import { getKeyToTemplates } from "./template.js";
import { Sentence } from "./sentence.js";
import { speakSentence } from "./speechSynth.js";
import { templateToSvgElts } from "./display.js";


const levelToAssetsDirPath = {
    1: 'appPlay/level1Assets',
    2: 'appPlay/level2Assets',
}
const levelToTemplateFileName = {
    1: 'ABC-tasty-food - 1.tsv',
    2: 'ABC-where-did-you-go - 1.tsv',
}

export const maxLevel = Math.max(...Object.keys(levelToTemplateFileName).map(str => parseInt(str)));

export class AlphabetGame {
    constructor({level = 1, displayerSvg, maxNumRounds = 20, playerName = '', numRemainingTriesPub}) {
        this.level = level;
        this.displayerSvg = displayerSvg;
        this.numWrongKeys = 0;
        this.numRounds = 0;
        this.maxNumRounds = maxNumRounds;
        this.keyToTemplates = new Map();
        this.prevLetterTemplate = null;
        this.playerName = playerName;
        this.assetsDirPath = '';
        this.numRemainingTriesPub = numRemainingTriesPub;
        this.numRemainingTriesPub(this.maxNumRounds - this.numRounds);

    }

    setMaxNumRounds(num) {
        this.maxNumRounds = num;
        this.numRemainingTriesPub(this.maxNumRounds - this.numRounds);
    }

    setNumRounds(num) {
        this.numRounds = num;
        this.numRemainingTriesPub(this.maxNumRounds - this.numRounds);
    }

    getGreeting() {
        const prefixes = ['Hey', '', ''];
        const pauseName = this.playerName ? `, ${this.playerName}` : '';
        const names = [pauseName, pauseName, 'buddy', 'my friend', '', '', ''];
        const prefix = prefixes[getRandomInt(prefixes.length)];
        const name = names[getRandomInt(names.length)];
        if (!name && !prefix) {
            return '';
        }
        return `${prefix} ${name}. `;
    }

    async respond(key) {
        this.numRounds++;
        this.numRemainingTriesPub(this.maxNumRounds - this.numRounds);

        if (this.numRounds > this.maxNumRounds) {
            if (this.numRounds === this.maxNumRounds + 1) {
                renderTextInSvg(this.displayerSvg, 'Game Over'.toUpperCase(), 150);

            }
            speakSentence(new Sentence({content: this.getGreeting(), speechRate: 0.75}));
            speakSentence(new Sentence({content: 'Game time is over.', speechRate: 0.85}));
            speakSentence(new Sentence({content: 'Go take a break.', speechRate: 0.75}));
            return;
        }

        const isLetter = key.match(/^[a-z]$/i);
        const isNumber = key.match(/^[0-9]$/i);
        if (!isLetter && !isNumber) {
            this.numWrongKeys++;
            let content = 'Please press on a letter.';
            if (this.numWrongKeys > 1) {
                content = 'You are not pressing on a letter.'
            }
            speakSentence(new Sentence({content: this.getGreeting(), speechRate: 0.8}));
            speakSentence(new Sentence({content: content, speechRate: 0.9}));
            return;
        }
        let sentences;
        let svgElts;
        if (this.keyToTemplates.has(key)) {
            const possTemplates = this.keyToTemplates.get(key);
            const currTemplate = possTemplates[getRandomInt(possTemplates.length)];
            sentences = templateToSentences(
                currTemplate, this.prevLetterTemplate, isNumber, this.getGreeting());
            if (isLetter) {
                this.prevLetterTemplate = currTemplate;
            }
            svgElts = await templateToSvgElts(
                this.assetsDirPath, isNumber, currTemplate, this.prevLetterTemplate);
        } else {
            sentences = generateDefaultSentences(key, this.numRounds % 5 === 1);
        }
        sentences.forEach(sentence => {
            speakSentence(sentence);
        });
        if (svgElts) {
            renderSvg(this.displayerSvg, svgElts);
        } else {
            renderTextInSvg(this.displayerSvg, key.toUpperCase());
        }
        if (this.numRounds == this.maxNumRounds) {
            this.displayerSvg.style.background = 'grey';
        }
    }

    async loadLevel(level) {
        this.level = level;
        renderTextInSvg(this.displayerSvg, 'Press a letter on your keyboard.', 80);
        const assetsDirPath = levelToAssetsDirPath[level];
        const templateFileName = levelToTemplateFileName[level];
        if (!assetsDirPath || !templateFileName) {
            return;
        }
        this.assetsDirPath = assetsDirPath;
        this.keyToTemplates = await getKeyToTemplates(`${assetsDirPath}/${templateFileName}`);
        this.prevLetterTemplate = this.keyToTemplates.get('a')[0];
    }

    loadPlayerName(name) {
        this.playerName = name;
        speakSentence(new Sentence({content: `Hi there, ${name}`, speechRate: 0.8}));
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