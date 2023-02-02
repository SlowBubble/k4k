const w3 = "http://www.w3.org/2000/svg";

export async function getBbox(elt) {
    // TODO think of a way to hide this; it's not a problem now since our main svg covers everything.
    const tmpSvg = document.createElementNS(w3, "svg");
    tmpSvg.setAttribute('width', '10000');
    tmpSvg.setAttribute('height', '10000');
    tmpSvg.appendChild(elt);
    document.body.appendChild(tmpSvg);
    return new Promise((resolve, reject) => {
        let intervalId;
        let numTries = 0;
        const cleanup = _ => {
            clearInterval(intervalId);
            tmpSvg.remove();
        }
        intervalId = setInterval(() => {
            const possBbox = elt.getBBox();
            if (possBbox.width > 0 || possBbox.height > 0) {
                cleanup();
                resolve(possBbox);
                return;
            }
            numTries++;
            if (numTries > 10) {
                cleanup();
                reject('Failed to get nonzero bbox.');
            }
        }, 20);
      });
    // HACK: Remove after the current loop runs or else the dom rect's data is cleared
    // window.setTimeout(_ => {
    //     tmpSvg.remove();
    // }, 1000);
    return elt.getBBox();
}

function getTextBoundingBox(textInput, style) {
    const svg = document.createElementNS(w3, "svg");
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    const text = document.createElementNS(w3, 'text');
    textInput.split('\n').forEach(line => {
      const tspan = document.createElementNS(w3, 'tspan');
      tspan.textContent = textInput;
      text.appendChild(tspan);
    });
    Object.keys(style).forEach(key => {
      text.setAttribute(key, style[key]);
    });
    svg.appendChild(text);
    document.body.appendChild(svg);
    const box = text.getBBox();
    svg.remove();
    return box;
}