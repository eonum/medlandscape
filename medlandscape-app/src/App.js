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
        selectedVarInfo : {},
        selectedCantons : [],
        selectedHospitals : []
    }

    /**
     * Fetches Cantons or Hospitals with the selected Variable information.
     * @param  {Variable Object} selectedVar The selected Variable to apply to Hospitals or Cantons.
     */
    applyVar = (selectedVar) => {
        const {name, variable_model} = selectedVar;

        let query = apiRequest;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        query += key + "?variables=" + name;

        this.apiCall(query).then((results) => {
            this.setState({
                [key] : results.map(obj => {
                    return obj;
                })
            });
        }).then(() => {
            console.log("createVarInfo");
            this.createVarInfo();
        });
    }

    /**
     * Sends request to the API.
     * @param  {String} query The request.
     * @return {Promise} A Promise Object of the requested API call, results parsed as JSON.
     */
    apiCall = (query) => {
        return fetch(apiURL + query).then(res => res.json());
    }

    /**
     * Initialises the state variables with several calls to the API.
     */
    initApiCall = () => {
        let varResultArr, cantonResultArr = [];

        this.apiCall((apiRequest + "variables")).then((result) => {
            varResultArr = result.map(obj => {
                return obj;
            })
        });

        // hospitals already fetched in applyVar()

        this.apiCall((apiRequest + "cantons")).then((result) => {
            cantonResultArr = result.map(obj => {
                return obj;
            })
        }).then(() => {
            this.setState({
                var : varResultArr,
                cantons : cantonResultArr,
                selectedVariable : varResultArr[0]
            });
            this.applyVar(varResultArr[0]);
        });
    }

    /**
     * Creates an information object about the selected variable, to pass on
     * to the Map Components.
     * @return {Object} The variable metadata.
     */
    createVarInfo = () => {
        const {name, variable_model, variable_type, is_time_series} = this.state.selectedVariable;
        let model = (variable_model === "Hospital") ? "hospitals" : "cantons";

        let appliedData = this.state[model].map((obj) => {
            return obj.attributes[name];
        });

        console.log(this.state[model]);

        //work in progress

        let obj = {};
        //     name : name,
        //     variable_model : model,
        //     variable_type : variable_type,
        //     is_time_series : is_time_series,
        //     data :
        // }
        return obj;
    }

    /**
     * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
     * then calls applyVar to fetch data from the API.
     * @param  {Variable object} item The selected variable.
     */
    dropdownSelectItem = (item) => {
        this.setState({ selectedVariable : item });
        this.applyVar(item);
    }

    /**
     * Adds / removes objects to the respective List of selected canton / hospitals.
     * @param  {Canton/Hospital object} object The object to add / remove from the list.
     */
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

    /**
     * Creates a 2d array out of an object (Used for Table Component).
     * @param  {Object} selectedObject The object to convert to a 2d array.
     * @return {Array} The 2d array.
     */
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
        let selectedCanton = {}, selectedHospital = {};

        hospitalVars = this.state.var.filter(variable => {
            if (variable.variable_model === "Hospital")
            return variable
        })
        cantonVars = this.state.var.filter(variable => {
            if (variable.variable_model === "Canton")
            return variable
        })

        if (this.state.selectedVariable.variable_model === "Hospital") {
            selectedHospital = this.state.selectedVariable;
            selectedCanton = cantonVars[0];
        } else {
            selectedCanton = this.state.selectedVariable;
            selectedHospital = hospitalVars[0];
        }

        return (
            <div className="App">
                <p>Canton Variables:</p>
                <DropdrownMenu id="CantonVarList" listItems={cantonVars} selectItem={this.dropdownSelectItem} selectedItem={selectedCanton} />
                <p>Hospital Variables:</p>
                <DropdrownMenu id="HospitalVarList" listItems={hospitalVars} selectItem={this.dropdownSelectItem} selectedItem={selectedHospital} />
            </div>
        );
    }
}

export default App;
