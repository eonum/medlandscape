import React, { Component } from 'react';
import TodoItem from './TodoItem.js'
import PropTypes from 'prop-types';

class TodoList extends Component {
    render() {
        return (
            this.props.todos.map((task) => (
                task.done === false && <TodoItem key={task.id} task={task} toggle={this.props.toggle}/>
                // prop.toCheck === compareValue && <ComponentToLoadIfTrue />
            ))
        );
    }
}



// PropTypes
TodoList.propTypes = {
    todos: PropTypes.array.isRequired, // Yes, the comma is necessary
}

export default TodoList;
