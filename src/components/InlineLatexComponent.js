import React from 'react';
import {InlineMath} from 'react-katex';
import { EditorState, Modifier, ContentBlock } from 'draft-js';
import {getSelectionEntity, getEntityRange} from 'draftjs-utils';

export function findInlineLatex(contentBlock, callback, contentState){
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                (entityKey !== null) && 
                contentState.getEntity(entityKey).getType() === 'INLINEMATH'
            );
        },
        callback
    )
}

class InlineLatexComponent extends React.Component{
    constructor(props){
        super(props);
        const math = this.props.contentState
                        .getEntity(this.props.entityKey)
                        .getData()['content'];
        this.state = {
            math
        }
    }

    onClick = (e) => {
        e.preventDefault();
        return;
        /* 
        const { editorState } = this.props;
        const latexInput = window.prompt("Enter the formula:");
        if (!latexInput){
        return;
        }
        let entityKey = this.props.entityKey;
        //debugger;
        let contentState = editorState.getCurrentContent()
        let contentStateWithEntity = contentState
                                        .mergeEntityData(entityKey, {content: latexInput});
        entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        
        contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            latexInput,
            editorState.getCurrentInlineStyle(),
            entityKey
        );
        
        const newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
        )
        this.props.onChange(newEditorState);

        this.setState({math: latexInput});
        */
    }

    render(){
        return (
            <span contentEditable='false' readOnly onClick={this.onClick} suppressContentEditableWarning={true}>
                <InlineMath math={this.state.math}/>
            </span>
        )
    }
}

export default InlineLatexComponent;