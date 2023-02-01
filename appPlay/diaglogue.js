import { Sentence } from "./sentence.js";
import { getRandomEnVoices } from "./speechSynth.js";

export function templateToSentences(template, prevLetterTemplate) {
    const question = instantiateTemplate(template.questionTemplate, template.templateKeyVal, prevLetterTemplate.templateKeyVal);
    const answer = instantiateTemplate(template.answerTemplate, template.templateKeyVal, prevLetterTemplate.templateKeyVal);
    const [voice1, voice2] = getRandomEnVoices(2);
    const sentences = [new Sentence({content: question, voice: voice1, speechRate: 0.9})];
    sentences.push(new Sentence({content: answer, voice: voice2, speechRate: 0.9}));
    return sentences;
}

function instantiateTemplate(templateString, templateKeyVal, prevLetterTemplateKeyVal) {
    const varNames = templateString.match(/\$[\S]+/g) || [];
    const varNameToVal = new Map();
    varNames.forEach(varName => {
        if (varName === '$PAUSE') {
            varNameToVal.set(varName, ',');
            return;
        }
        if (varName.startsWith('$Prev')) {
            const lookupKey = varName.slice(5);
            if (prevLetterTemplateKeyVal.has(lookupKey)) {
                varNameToVal.set(varName, prevLetterTemplateKeyVal.get(lookupKey));
                return;
            }
            console.warn('Failed to look up the previous key: ', varNameWithDollarSign, ' template:', prevLetterTemplate);
            return;
        }
        const lookupKey = varName.slice(1);
        if (templateKeyVal.has(lookupKey)) {
            varNameToVal.set(varName, templateKeyVal.get(lookupKey));
            return;
        }
        console.warn('Failed to look up the key: ', varNameWithDollarSign, ' template:', template);
    });
    let res = templateString;
    varNameToVal.forEach((val, varName) => {
        res = res.replaceAll(varName, val);
    });
    return res;
}
export function generateDefaultSentences(key, sayQuestion) {
    const isLetter = key.match(/^[a-z]$/i);
    const isNumber = key.match(/^[0-9]$/i);
    let keyPhrase = '';
    if (isLetter) {
        keyPhrase = `letter: ${key.toUpperCase()}`;
    }
    if (isNumber) {
        keyPhrase = `number: ${key}`;
    }
    const sentences = [];
    const [voice1, voice2] = getRandomEnVoices(2);
    if (sayQuestion) {
        sentences.push(new Sentence({content: `What key did you press?`, voice: voice1}))
    }
    sentences.push(new Sentence({content: `I pressed on the ${keyPhrase}`, voice: voice2, speechRate: 0.8}));
    return sentences;
}
