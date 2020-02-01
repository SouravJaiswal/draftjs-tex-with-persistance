import React from 'react';
import htmlToRaw from '../utils/html-to-raw-draftjs';
import { EditorState, RichUtils, Modifier} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import InlineLatexToolbarOption from '../plugins/InlineLatexToolbarOption';
import BlockLatexToolbarOption from '../plugins/BlockLatexToolbarOption';
import draftjsToHTML from '../utils/draftjs-raw-to-html';
import BlockLatexComponent from './BlockLatexComponent';
import InlineLatexComponent, { findInlineLatex } from './InlineLatexComponent';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


class EditorComponent extends React.Component {
    constructor(props){
        super(props);
        const latexHtml = JSON.parse(localStorage.getItem('editor'))
        //debugger;
        const editorState = !latexHtml ? EditorState.createEmpty() : EditorState.createWithContent(htmlToRaw(latexHtml));
        this.state = {
            latexHtml,
            editorState
        }
    }
    onEditorStateChange: Function = (editorState) => {
        const latexHtml = draftjsToHTML(editorState.getCurrentContent());
        this.setState({
          latexHtml,
          editorState
        });
    };

    blockRenderFn = (block, config, editorState) => {
        if (block.getType() === 'atomic'){
            const contentState = config.getEditorState().getCurrentContent();
            const entity = contentState.getEntity(block.getEntityAt(0));
            if(entity){
                switch (entity.type){
                    case 'BLOCKMATH':
                        return {
                            component: BlockLatexComponent,
                            editable: false,
                            props: {
                                onChange: (contentState) => {
                                    this.onEditorStateChange(EditorState.createWithContent(contentState))
                                },
                                editorState: this.state.editorState
                            }
                        }
                    default:
                        return false;
                }
            }
        }
    }

    handlePastedText = (text: string, html?: string): boolean => {
        // if they try to paste something they shouldn't let's handle it
          // we'll add a message for the offending user to the editor state
          const newContent = Modifier.replaceText(
            this.state.editorState.getCurrentContent(),
            this.state.editorState.getSelection(),
            text
          );
    
          // update our state with the new editor content
          this.onEditorStateChange(EditorState.push(
            this.state.editorState,
            newContent,
            'insert-characters'
          ));
          return true;
      }

    _handleKeyCommand = (command, editorState) => {
        var newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          this.onEditorStateChange(newState);
          return true;
        }
        return false;
      };

    render(){
        const editorState = this.state.editorState
        return (<div>
            <Editor
                toolbar={{ options: ['inline', 'blockType', 'list', 'image'], 
                list: {options: ['unordered', 'ordered']}}}
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                customBlockRenderFunc={this.blockRenderFn}
                handleKeyCommand={this._handleKeyCommand}
                toolbarCustomButtons={[<InlineLatexToolbarOption />, <BlockLatexToolbarOption/>]}
                customDecorators={[{
                    strategy: findInlineLatex,
                    component: InlineLatexComponent,
                    props: {
                        editorState: editorState,
                        onChange: this.onEditorStateChange
                    }
                }]}
                handlePastedText={this.handlePastedText}
                editorStyle={{ border: '1px', height: '400px', border: '1px solid grey' }}
            />
            <div style={{width: "80%", margin: "auto"}}>
            <h1>HTML</h1>
            <div style={{marginTop: '20px'}}>
                {this.state.latexHtml}
            </div>
            </div>
            </div>
        )
    }
}

export default EditorComponent;