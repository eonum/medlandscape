import React, { Component } from 'react';
import TodoItem from './TodoItem.js'
import PropTypes from 'prop-types';

class DoneList extends Component {
    render() {
        return (
            this.props.todos.map((task) => (
                task.done === true && <TodoItem key={task.id} task={task} toggle={this.props.toggle} />
                // prop.toCheck === compareValue && <ComponentToLoadIfTrue />
            ))
        );
    }
}



// PropTypes
DoneList.propTypes = {
    todos: PropTypes.array.isRequired, // Yes, the comma is necessary
}

export default DoneList;
