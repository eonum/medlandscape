import React, { Component } from 'react';
import DropdrownMenu from './components/DropdownMenu/DropdownMenu.js';
import './App.css';

const apiURL = "https://qm1.ch/";
let apiRequest = "de/api/medical_landscape/";

class App extends Component {

    state = {
        var: [],
        cantons : [],
        hospitals : [],

        selectedVariable : {},
        selectedCantons : []
    }

    applyVar = (selectedVar) => {
        const {name, variable_model} = selectedVar;

        let query = apiRequest;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";

        query += key + "?variables=" + name;
        this.apiCall(key, query, this.createVarInfo, selectedVar);
    }

    apiCall = (key, query, callback, cbArg) => {
        fetch(apiURL + query).then(res => res.json()).then((results) => {
            this.setState({
                [key] : results.map(obj => {
                    return obj;
                })
            });
            if (callback && cbArg)
                callback(cbArg);
            else if (callback)
                callback(this.state[key][0]);
        })
    }

    initApiCall = () => {
        let key = "var";
        let query = apiRequest + "variables";
        this.apiCall(key, query, this.dropdownSelectItem);

        // hospitals already fetched in applyVar()

        key = "cantons";
        query = apiRequest + "cantons";
        this.apiCall(key, query);
    }

    createVarInfo = (variable) => {
        const {name, variable_model, variable_type, is_time_series} = variable;

        let model = (variable_model === "Hospital") ? "hospitals" : "cantons";
        let varData = this.state[model];
        let keys = [name];
        if (is_time_series) {
            let firstEntry = this.create2dArr(varData[0].attributes[name])[0][0];
            keys = [...keys, firstEntry];
        }

        let obj = {
            name : name,
            variable_model : model,
            variable_type : variable_type,
            is_time_series : is_time_series,
            keys : keys,
            data : varData
        }
        return obj;
    }

    dropdownSelectItem = (item) => {
        this.setState({ selectedVariable : item });
        this.applyVar(item);
    }

    selectCanton = (canton) => {
        let updatedCantonList = [];
        if (this.state.selectedCantons.includes(canton)) {
            updatedCantonList = this.state.selectedCantons.filter(checkedCanton => {
                return checkedCanton !== canton;
            })
        } else {
            updatedCantonList =  [...this.state.selectedCantons, canton];
        }
        this.setState({
            selectedCantons : updatedCantonList
        })
    }

    create2dArr = (selectedObject) => {
        let arr = [];
        for (var key in selectedObject) {
            if (typeof selectedObject[key] !== 'object' && selectedObject[key] !== null) {
                arr.push([key, selectedObject[key]]);
            }
        }
        return arr;
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {
        let cantonVars = [], hospitalVars = [];
        hospitalVars = this.state.var.filter(variable => {
            if (variable.variable_model === "Hospital")
                return variable
        })
        cantonVars = this.state.var.filter(variable => {
            if (variable.variable_model === "Canton")
                return variable
        })
        return (
            <div className="App">
                <p>Canton Variables:</p>
                <DropdrownMenu id="CantonVarList" listItems={cantonVars} selectItem={this.dropdownSelectItem} selectedItem={cantonVars[0]} />
                <p>Hospital Variables:</p>
                <DropdrownMenu id="HospitalVarList" listItems={hospitalVars} selectItem={this.dropdownSelectItem} selectedItem={hospitalVars[0]} />
            </div>
        );
    }
}

export default App;
