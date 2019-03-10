import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TodoItem extends Component {

    render() {
        // example of: deconstructing
        const {id, taskText} = this.props.task;
        return (
            <div className="todoItem">
                <p>
                    <input type="checkbox" className="checkBox" name="box" onChange={this.props.toggle.bind(this, id)}/>
                    {taskText}
                </p>
                <button type="button">Delete Task</button>
            </div>
        );
    }
}

// PropTypes
TodoItem.propTypes = {
    task: PropTypes.object.isRequired, // Yes, the comma is necessary
}

export default TodoItem;
