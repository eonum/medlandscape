import React, { Component } from 'react';
import DropdrownMenu from './components/DropdownMenu.js';
import CheckboxList from './components/CheckboxList/CheckboxList.js';
import './App.css';

const apiURL = "https://qm1.ch/";
let apiRequest = "de/api/medical_landscape/hospitals";

class App extends Component {

    state = {
        var: [],
        cantons : [],
        hospitals : [],

        selectedVariable : {},
        selectedCantons : [],
        selectedHospitals : []
    }

    componentDidMount(){
        this.initApiCall();
    }

    initApiCall = () => {
        fetch(apiURL + "de/api/medical_landscape/variables").then(res => res.json()).then((results) => {
            this.setState({
                var : results.map(variable => {
                    return variable;
                })
            })
            this.dropdownSelectItem(this.state.var[0]);
        });

        fetch(apiURL + "de/api/medical_landscape/cantons").then(res => res.json()).then((results) => {
            this.setState({
                cantons : results.map(canton => {
                    return canton;
                })
            })
        });

        fetch(apiURL + "de/api/medical_landscape/hospitals").then(res => res.json()).then((results) => {
            this.setState({
                hospitals : results.map(hospital => {
                    return hospital;
                })
            })
        });
    };

    dropdownSelectItem = (item) => {
        this.setState({ selectedVariable: item });
    }

    checkboxSelectItem = (object) => {
        let selectedObj = (object.text) ? "selectedCantons" : "selectedHospitals";
        console.log(selectedObj);
        let newList = [];
        if (this.state[selectedObj].includes(object)) {
            newList = this.state[selectedObj].filter(checkedObj => {
                return checkedObj !== object;
            });
        } else {
            newList = [...this.state[selectedObj], object];
        }
        this.setState({
            [selectedObj] : newList
        })
    }

    render() {
        return (
            <div className="App">
                <DropdrownMenu listItems={this.state.var} selectItem={this.dropdownSelectItem}
                    selectedItem={this.state.selectedVariable} />
                <CheckboxList objects={this.state.cantons} checkboxSelectItem={this.checkboxSelectItem} /><br />
                <CheckboxList objects={this.state.hospitals} checkboxSelectItem={this.checkboxSelectItem} />
            </div>
        );
    }
}

export default App;
