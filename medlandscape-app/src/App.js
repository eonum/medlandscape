import React, { Component } from 'react';
import './App.css';

class App extends Component {

    state = {
        apiURL :  "https://qm1.ch/",
        apiRequest : "de/api/medical_landscape/hospitals"
    }

    apiCall = () => {
        fetch(this.state.apiURL + this.state.apiRequest).then(res => res.json()).then((result) => {
            console.log(result);
        });
    };


    render() {
        this.apiCall();
        return (
            <div className="App">
                <h1>Hello world</h1>
            </div>
        );
    }
}

export default App;
