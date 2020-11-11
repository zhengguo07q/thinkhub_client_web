import React from 'react';
import { SizeContext } from '../../layouts/BasicLayout/index'
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

export default class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    onChange(editorState){
        this.setState({ editorState });
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled'; 
    }
    render() {
        return (
            <SizeContext.Consumer>
                {size => (
                    <div style={{ height: size.height }}>
                        <Editor
                            editorState={this.state.editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                        />
                    </div>
                )}
            </SizeContext.Consumer>
        );
    }
}




