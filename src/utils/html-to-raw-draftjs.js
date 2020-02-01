import {convertFromHTML} from 'draft-convert';

function htmlToEntity (nodeName, node, createEntity){
    switch (nodeName){
        case 'latex':
            return createEntity(
                'INLINEMATH',
                'MUTABLE',
                {
                    content: node.innerText
                }
            );
        case 'blocklatex':
            return createEntity(
                'BLOCKMATH',
                'IMMUTABLE',
                {
                    content: node.innerText
                }
            );
        case 'img':
            return createEntity('IMAGE', 'MUTABLE', {
                src: node.src,
                width: 'auto',
                height: 'auto'
            });
        default:
            return;
    }
}

function htmlToBlock(nodeName, node){
    switch (nodeName){
        case 'blocklatex':
            return {
                type: 'atomic',
                data: {
                    content: node.innerText
                }
            }
        case 'img':
            return {
                type: 'atomic',
                data: {
                    src: node.src,
                    width: 'auto',
                    height: 'auto'
                }
            }
        default:
            return;
    }
}

export default function (html){
    return convertFromHTML({
        htmlToEntity,
        htmlToBlock
    })(html);
}