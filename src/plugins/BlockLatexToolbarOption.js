import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, AtomicBlockUtils} from 'draft-js';
import {getSelectionEntity, getEntityRange} from 'draftjs-utils';

class BlockLatexToolbarOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addTex: Function = (): void => {
    const { editorState, onChange } = this.props;
    const latexInput = window.prompt("Enter the formula:");
    if (!latexInput){
      return;
    }

    let contentStateWithEntity = editorState.getCurrentContent()
                                    .createEntity('BLOCKMATH', 'IMMUTABLE', {content: latexInput});
    const entityKey  = contentStateWithEntity.getLastCreatedEntityKey();
    
    const newEditorState = EditorState.set(
        editorState,
        { currentContent: contentStateWithEntity}
    )

    onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
  };

  render() {
    return (
      <div onClick={this.addTex} className="rdw-option-wrapper">$</div>
    );
  }
}

export default BlockLatexToolbarOption;
