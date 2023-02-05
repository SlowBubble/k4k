
const goodEnLocales = new Set([
    'en-us',
    'en-gb',
    'en-au',
    'en-za',
    'en-nz',
    'en-ie',
]);

// Load this later since getVoices seems to be empty when called too early.
let availableGoodEnVoices;
getAvailableGoodEnVoices()
function getAvailableGoodEnVoices() {
    if (availableGoodEnVoices && availableGoodEnVoices.length > 0) {
        return availableGoodEnVoices;
    }

    const langToFirstVoice = new Map();
    window.speechSynthesis.getVoices().forEach(voice => {
        if (langToFirstVoice.has(voice.lang)) {
            return;
        }
        langToFirstVoice.set(voice.lang, voice);
    });

    const enVoiceUris = new Set();
    langToFirstVoice.forEach((voice, lang) => {
        if (goodEnLocales.has(lang.toLowerCase())) {
            enVoiceUris.add(voice.voiceURI);
        }
    });

    const googleEnVoices = window.speechSynthesis.getVoices().filter(voice => {
        return voice.voiceURI.match(/google/i) && goodEnLocales.has(voice.lang.toLowerCase());
    });
    googleEnVoices.forEach(voice => enVoiceUris.add(voice.voiceURI));

    availableGoodEnVoices = window.speechSynthesis.getVoices().filter(voice => enVoiceUris.has(voice.voiceURI));
    console.log(availableGoodEnVoices);
    return availableGoodEnVoices;
}

export function speakSentence(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence.content);
    utterance.rate = sentence.speechRate;
    if (sentence.voice) {
        utterance.voice = sentence.voice;
    }
    if (sentence.action) {
        utterance.onstart = _ => sentence.action();
    }
    if (sentence.afterAction) {
        utterance.onend = _ => sentence.afterAction();
    }
    console.log(utterance.voice);
    window.speechSynthesis.speak(utterance);
}

export function getRandomEnVoices(numVoices) {
    const unshuffled = getAvailableGoodEnVoices();
    // while (unshuffled.length < numVoices) { unshuffled = unshuffled.concat(getAvailableGoodEnVoices())}
    const shuffled = unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    return shuffled.slice(0, numVoices);
}

// // TODO experiment with these
// // en-US has a lot of wierd voices, so we exlude US here.
// const goodEnNonUsVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith("en") && !voice.lang.includes("-US") && !voice.name.includes("("));
// // Pick the first voice from en-US, en-UK and en-AU.
// // const availabeEnVoices = [];
// const musicalVoiceUris = new Set([
//     'Bells',
//     'Cellos',
//     'Good News',
//     'Trinoids',
//     'Zarvox',
// ]);