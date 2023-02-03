import { getBbox } from "./svgUtil.js";

const svgns = "http://www.w3.org/2000/svg";


export async function templateToSvgElts(dirPath, numberOrNull, currTemplate, prevLetterTemplate) {
    let fileName;
    
    // const numImages = numberOrNull === null ? 1 : numberOrNull;
    // if (numImages === 0) {
    //     fileName = 'zero.jpeg';
    // } else {
        // TODO check if ImageName is available in the future.
    const template = numberOrNull === null ? currTemplate : prevLetterTemplate;
    const word = template.templateKeyVal.get('Word');
    const possInt = parseInt(word);
    const numImages = isNaN(possInt) ? 1 : possInt;
    if (word) {
        fileName = word.replaceAll(' ', '-') + '.jpeg';
    }
    // }\
    if (!fileName) {
        return;
    }

    const href = `${dirPath}/${fileName}`;

    let currHeight = 0;
    const svgElts = [];

    const maxHeight = window.innerHeight - 120;
    const maxWidth = window.innerWidth;

    for (let idx = 0; idx < numImages; idx++) {
        const bbox = await getBbox(genImageElt(href));
        const imageElt = genImageElt(href);
        const height = getReasonableHeight(bbox, maxWidth, maxHeight);
        imageElt.setAttributeNS(null, "height", height);
        currHeight += height;
        svgElts.push(imageElt);
    }
    const text = document.createElementNS(svgns, "text");
    text.setAttribute("x", 10);
    text.setAttribute("y", currHeight + 10);
    text.setAttribute("font-size", 100);
    text.setAttribute("font-family", "Arial");
    text.setAttribute('alignment-baseline', 'hanging');
    const words = currTemplate.templateKeyVal.get('Word') || '';
    text.textContent = words.split(' ').map(capitalizeFirstLetter).join(' ');
    svgElts.push(text);
    return svgElts;
}

function getReasonableHeight(bbox, maxWidth, maxHeight) {
    return 400;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function genImageElt(href) {
    const imageElt = document.createElementNS(svgns, "image");
    imageElt.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
    return imageElt;
}
