
const dirPath = 'appPlay/assets';
export function templateToSvgElts(numberOrNull, currTemplate, prevLetterTemplate) {
    let fileName;
    const numImages = numberOrNull === null ? 1 : numberOrNull;
    if (numImages === 0) {
        fileName = 'zero.jpeg';
    } else {
        // TODO check if ImageName is available in the future.
        const template = numberOrNull === null ? currTemplate : prevLetterTemplate;
        const word = template.templateKeyVal.get('Word');
        if (word) {
            fileName = word.replaceAll(' ', '-') + '.jpeg';
        }
    }
    if (!fileName) {
        return;
    }

    const href = `${dirPath}/${fileName}`;
    const svgns = "http://www.w3.org/2000/svg";

    const svgElts = [];
    for (let idx = 0; idx < numImages; idx++) {
        const imageElt = document.createElementNS(svgns, "image");
        imageElt.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
        imageElt.setAttributeNS(null, "width", 500);
        svgElts.push(imageElt);
    }
    return svgElts;
}