
export const levelToAssetUrl = {
    1: 'appPlay/assets/ABC-tasty-food - 1.tsv',
    2: 'appPlay/level2Assets/ABC-where-did-you-go - 1.tsv',
    3: 'appPlay/level3Assets/ABC-What-do-you-have - 1.tsv',
}
export async function getKeyToTemplates(templateFilePath) {
    const response = await fetch(templateFilePath);
    const tsv = await response.text();
    const gridData = tsv.split(/\r?\n/g).map(line => line.split('\t'));
    const keyValForRows = parseAsKeyValForRows(gridData);
    const res = new Map();
    keyValForRows.forEach(keyValMap => {
        const template = keyValToDiaglogueTemplate(keyValMap);
        if (!res.has(template.key)) {
            res.set(template.key, []);
        }
        const array = res.get(template.key);
        return array.push(template);
    });
    return res;
}

export class DialogueTemplate {
    constructor({key = '', questionTemplate = '', answerTemplate = '', templateKeyVal = {}}) {
        this.key = key;
        this.questionTemplate = questionTemplate;
        this.answerTemplate = answerTemplate;
        this.templateKeyVal = new Map();
        Object.keys(templateKeyVal).forEach((key) => {
            this.templateKeyVal.set(key, templateKeyVal[key]);
        });
    }
}

function keyValToDiaglogueTemplate(keyValMap) {
    const res = new DialogueTemplate({})
    keyValMap.forEach((val, key) => {
        if (key === 'Question') {
            res.questionTemplate = val;
            return;
        }
        if (key === 'Answer') {
            res.answerTemplate = val;
            return;
        }
        if (key === 'Key') {
            res.key = val;
        }
        res.templateKeyVal.set(key, val);
    });
    return res;
}

function parseAsKeyValForRows(gridData) {
    const colIdxToColName = new Map;
    const keyValForRows = [];
    gridData.forEach((row, rowIdx) => {
        if (rowIdx === 0) {
            row.forEach((cell, colIdx) => {
                colIdxToColName.set(colIdx, cell);  
            });
            return;
        }
        const keyValForRow = new Map;
        keyValForRows.push(keyValForRow);
            row.forEach((cell, colIdx) => {
                if (!colIdxToColName.has(colIdx)) {
                return;
            }
            const colName = colIdxToColName.get(colIdx);
            keyValForRow.set(colName, cell);
        });
    });
    return keyValForRows;
}
