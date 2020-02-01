import draftToHtml from "draftjs-to-html";
import {convertToRaw} from 'draft-js';

function entityToHtml (entity, text) {
    switch (entity.type){
        case 'INLINEMATH':
            return `<latex>${entity.data.content}</latex>`;
        case 'BLOCKMATH':
            return `<blocklatex>${entity.data.content}</blocklatex>`;
        default:
            return
    }
}

export default function (rawState){
    return draftToHtml(convertToRaw(rawState), null, null, entityToHtml);
}