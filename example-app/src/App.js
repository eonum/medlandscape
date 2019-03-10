import React, { Component } from 'react';
import TodoList from './components/TodoList.js'; // example for: Importing a component.
import DoneList from './components/DoneList.js';
import './App.css';

class App extends Component { // See ES6 class notation

    state = {
        // creating example array of tasks instead of using a backend
        todos: [
            {
                id: 1,
                taskText: "Do laundry",
                done: false
            },
            {
                id: 2,
                taskText: "Get money",
                done: false
            },
            {
                id: 3,
                taskText: "Visit grandma",
                done: true
            }
        ]
    }

    // example for:
    // arrow function
    // setState()
    toggle = (id) => {
        this.setState({
            todos: this.state.todos.map(task => {
                if (task.id === id) {
                    task.done = !task.done
                }
                return task;
            })
        });
    }


    render() {
        // example for: Accessing the state of a component.
        console.log(this.state.todos);

        // example for:
        // JSX in curly braces {},
        // Rendering a component,
        // Passing properties (props)
        // ("this" refers to App.js)
        return (
            <div className="app">
                <header className="headerTitle">
                    <h1>Example App: Todo list</h1>
                </header>
                <div className="todoList">
                    <h2>Tasks to do:</h2>
                    <TodoList todos={this.state.todos} toggle={this.toggle}/>
                    <h2>Completed Tasks:</h2>
                    <DoneList todos={this.state.todos} toggle={this.toggle}/>
                </div>
            </div>
        );
    }
}

export default App;
