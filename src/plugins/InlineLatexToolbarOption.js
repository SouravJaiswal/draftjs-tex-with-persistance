import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';

import {getSelectionEntity, getEntityRange} from 'draftjs-utils';

class InlineLatexToolbarOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addTex: Function = (): void => {
    const { editorState, onChange } = this.props;
    const currentEntity = getSelectionEntity(editorState)
    let selection = editorState.getSelection()
    const latexInput = window.prompt("Enter the formula:");
    if (!latexInput){
      return;
    }
    
    if (currentEntity) {
        const entityRange = getEntityRange(editorState, currentEntity);
        const isBackward = selection.getIsBackward();
        if (isBackward) {
          selection = selection.merge({
            anchorOffset: entityRange.end,
            focusOffset: entityRange.start,
          });
        } else {
          selection = selection.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
          });
        }
      }
    
    let entityKey = editorState.getCurrentContent()
                                    .createEntity('INLINEMATH', 'MUTABLE', {content: latexInput})
                                    .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      latexInput,
      editorState.getCurrentInlineStyle(),
      entityKey
    );

    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + latexInput.length,
      focusOffset: selection.get('anchorOffset') + latexInput.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);

    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined
    );

    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
  }

  render() {
    return (
      <div onClick={this.addTex} className="rdw-option-wrapper">$'</div>
    );
  }
}

export default InlineLatexToolbarOption;