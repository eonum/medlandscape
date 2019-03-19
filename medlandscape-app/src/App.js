import React, { Component } from 'react';
import CantonMap from './components/CantonMap/CantonMap.js';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello world</h1>
                <CantonMap/>
            </div>
        );
    }
}

export default App;
