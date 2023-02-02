const synth = window.speechSynthesis;

// Load this later since getVoices seems to be empty when called too early.
let availableGoodEnVoices;
getAvailableGoodEnVoices()
function getAvailableGoodEnVoices() {
    if (availableGoodEnVoices && availableGoodEnVoices.length > 0) {
        return availableGoodEnVoices;
    }

    const langToFirstVoice = new Map();
    synth.getVoices().forEach(voice => {
        if (langToFirstVoice.has(voice.lang)) {
            return;
        }
        langToFirstVoice.set(voice.lang, voice);
    });

    const enVoiceUris = new Set();
    langToFirstVoice.forEach((voice, lang) => {
        if (!lang.startsWith('en-')) {
            return;
        }
        if (lang === 'en-IN') {
            return;
        }
        enVoiceUris.add(voice.voiceURI);
    });

    const googleEnVoices = synth.getVoices().filter(voice => {
        return voice.voiceURI.match(/google/i) && voice.lang.startsWith('en-');
    });
    googleEnVoices.forEach(voice => enVoiceUris.add(voice.voiceURI));

    availableGoodEnVoices = synth.getVoices().filter(voice => enVoiceUris.has(voice.voiceURI));
    return availableGoodEnVoices;
}

// const goodEnVoiceUris = new Set([
//     'Samantha',
//     'Google US English',
//     'Daniel',
//     'Google UK English Female',
//     'Google UK English Male',
//     'Karen',
//     'Moira',
//     // 'Rishi', // en-IN.
//     'Tessa', // en-ZA
// ]);



export function speakSentence(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence.content);
    utterance.rate = sentence.speechRate;
    if (sentence.voice) {
        utterance.voice = sentence.voice;
    }
    console.log(utterance.voice)
    synth.speak(utterance);
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

// TODO experiment with these
// en-US has a lot of wierd voices, so we exlude US here.
const goodEnNonUsVoices = synth.getVoices().filter(voice => voice.lang.startsWith("en") && !voice.lang.includes("-US") && !voice.name.includes("("));
// Pick the first voice from en-US, en-UK and en-AU.
// const availabeEnVoices = [];
const musicalVoiceUris = new Set([
    'Bells',
    'Cellos',
    'Good News',
    'Trinoids',
    'Zarvox',
]);