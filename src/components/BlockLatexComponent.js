import React from 'react';
import {BlockMath} from 'react-katex';

class BlockLatexComponent extends React.Component{
    constructor(props){
        super(props);
        const math = this.props.contentState
                        .getEntity(this.props.block.getEntityAt(0))
                        .getData()['content'];
        this.state = {
            math
        }
    }

    onClick = (e) => {
        debugger;
    e.preventDefault();
    const latexInput = window.prompt("Enter the formula:");
    if (!latexInput){
      return;
    }
    const entityKey = this.props.block.getEntityAt(0);
    const contentState = this.props.blockProps.editorState.getCurrentContent();
    let contentStateWithEntity = contentState
                                    .mergeEntityData(entityKey, {content: latexInput});

    
    this.props.blockProps.onChange(contentStateWithEntity);

    this.setState({math: latexInput});
    }

    render(){
        return (
            <span onClick={this.onClick}>
                <BlockMath math={this.state.math}/>
            </span>
        )
    }
}

export default BlockLatexComponent;