import { getBbox } from "./svgUtil.js";

const svgns = "http://www.w3.org/2000/svg";

const numImagesPerRow = 4;

export async function templateToSvgElts(dirPath, isNumber, currTemplate, prevLetterTemplate) {
    let fileName;
    if (currTemplate.templateKeyVal.get('ImageName')) {
        fileName = currTemplate.templateKeyVal.get('ImageName') + '.jpeg';
    } else {
        const template = isNumber ? prevLetterTemplate : currTemplate;
        const word = template.templateKeyVal.get('Word');
        if (word) {
            fileName = word.replaceAll(' ', '-') + '.jpeg';
        }
    }
    
    const href = fileName ? `${dirPath}/${fileName}` : 'appPlay/404.jpeg';
    
    const maxHeight = window.innerHeight - 120;
    const maxWidth = window.innerWidth;
    const possInt = parseInt(currTemplate.templateKeyVal.get('Key'));
    let numImages = isNaN(possInt) ? 1 : possInt;
    numImages = numImages === 0 ? 10 : numImages;
    const bbox = await getBbox(genImageElt(href));
    const dims = getReasonableDims(bbox, maxWidth, maxHeight, numImages);
    
    const svgElts = [];
    let currColIdx = 0;
    let currRowIdx = 0;
    for (let idx = 0; idx < numImages; idx++) {
        const imageElt = genImageElt(href);
        imageElt.setAttributeNS(null, "id", `image-${idx + 1}`);
        if (numImages > 1) {
            imageElt.setAttributeNS(null, "class", `half-opaque`);
        }
        imageElt.setAttributeNS(null, "x", currColIdx * dims.width);
        imageElt.setAttributeNS(null, "y", currRowIdx * dims.height);
        imageElt.setAttributeNS(null, "height", dims.height);
        svgElts.push(imageElt);

        if (currColIdx + 1 < numImagesPerRow) {
            currColIdx += 1;
        } else {
            currColIdx = 0;
            currRowIdx += 1;
        }
    }

    const text = document.createElementNS(svgns, "text");
    text.setAttributeNS(null, "id", `word`);
    text.setAttributeNS(null, "class", `almost-opaque`);
    text.setAttribute("x", 10);
    text.setAttribute("y", Math.ceil(numImages / numImagesPerRow) * dims.height + 10);
    text.setAttribute("font-size", 100);
    text.setAttribute("font-family", "Arial");
    text.setAttribute('alignment-baseline', 'hanging');
    const words = currTemplate.templateKeyVal.get('Word') || '';
    text.textContent = words.split(' ').map(capitalizeFirstLetter).join(' ');
    svgElts.push(text);
    return svgElts;
}

function getReasonableDims(bbox, maxWidth, maxHeight, numImages) {
    const numRows = Math.ceil(numImages / numImagesPerRow);
    const numCols = Math.min(numImagesPerRow, numImages);
    const maxHeightPerImage = maxHeight / numRows;
    const maxWidthPerImage = maxWidth / numCols;
    const imageWidthToHeightRatio = bbox.width > 0 && bbox.height > 0 ? bbox.width / bbox.height : 1;
    let width = 400;
    let height = 400;
    if (imageWidthToHeightRatio > maxWidthPerImage / maxHeightPerImage) {
        width = Math.min(maxWidthPerImage, 700);
        height = width / imageWidthToHeightRatio;
    } else {
        height = Math.min(maxHeightPerImage, 700 * maxHeightPerImage / maxWidthPerImage);
        width = height * imageWidthToHeightRatio;
    }
    return {height: height, width: width};
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function genImageElt(href) {
    const imageElt = document.createElementNS(svgns, "image");
    imageElt.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
    return imageElt;
}
