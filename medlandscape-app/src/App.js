import React, { Component } from 'react';
import MapComponent from './components/MapComponent.js';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello world</h1>
                <MapComponent />
            </div>
        );
    }
}

export default App;
