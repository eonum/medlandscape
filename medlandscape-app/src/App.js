import React, { Component } from 'react';
import Maps from './components/Maps/Maps.js';
import './App.css';
import { withTranslation } from 'react-i18next';
import ControlPanel from './components/ControlPanel/ControlPanel.js'
import CentralPanel from './components/CentralPanel/CentralPanel.js'
import LanguagePicker from './components/LanguagePicker/LanguagePicker.js';
import Slider from './components/Slider/Slider.js'
import InteractiveTable from './components/InteractiveTable/InteractiveTable.js';

const apiURL = "https://qm1.ch/";
let apiRequest = "/api/medical_landscape/";

class App extends Component {

    state = {
        variables: [],
        enums : [],
        cantons : [],
        hospitals : [],

        selectedVariable : {},
        selectedCantons : [],
        selectedHospitals : [],
        years : [],
        selectedYear : "",
        view : 1,
        hasLoaded : false,
        tableDataLoaded: false
    }

    /**
    * Calls the API with specific query
    * @param {String} key String value that is either hospitals or cantons.
    * @param  {String} query The specific query to use for the API call.
    */
    applyVariables = (key, query) => {
        return this.apiCall(query).then((results) => {
            if (key === "hospitals") {
                this.setState({
                    [key] : results,
                    selectedHospitals : results
                });
            } else {
                this.setState({
                    [key] : results,
                });
            }
        }).then(() => {
            if (this.state.view !== 1) {
                let years = this.getYears(this.state.selectedVariable);
                this.setState({
                    years : years,
                    selectedYear : years[0],
                    hasLoaded : true
                })
            } else {
                this.setState({
                    hasLoaded : true
                })
            }
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
    * Initialises the state variables with a call to the API.
    */
    initApiCall = () => {
        let varResultArr = [];

        // fetches all Variables from the API
        this.apiCall((this.props.i18n.language + apiRequest + "variables")).then((result) => {
            this.setState({
                variables : result,
            });
            this.selectVariable(result[1]);
            let query = this.props.i18n.language + apiRequest + "hospitals?variables=";
            query += encodeURIComponent(result[1].name);
            this.applyVariables("hospitals", query);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
    * then calls applyVariables to fetch data from the API.
    * @param  {Variable object} item The selected variable.
    */
    selectVariable = (item) => {
        this.setState({
            selectedVariable : item,
            hasLoaded : false
        });
    }

    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }

    /**
    * Adds / removes objects to the respective List of selected canton / hospitals.
    * @param  {Canton/Hospital object} object The object to add / remove from the list.
    */
    checkboxSelectItem = (object) => {
        let selectedObj = (object.text) ? "selectedCantons" : "selectedHospitals";
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
     * Returns list of available years depending on variable
     * @param {Variable Object}
     * @return {Array} The available years.
     */
    getYears = (selectedVariable) => {
        const {variable_model, is_time_series, name} = selectedVariable;
        let selObj = (variable_model === "Hospital") ? this.state.selectedHospitals : this.state.cantons;
        let maxYears = [], years;
        for (var i = 0; i < selObj.length; i++) {
            years = Object.keys(selObj[i].attributes[name]);
            maxYears = (years.length > maxYears.length) ? years : maxYears
        }
        return maxYears;
    }

    /**
     * Setter for the selectedYear state variable.
     * @param {String} year The selected year.
     */
    setYear = (year) => {
        this.setState({
            selectedYear : year
        })
    }

    /**
     * Setter for the view state variable.
     * @param {int} view The selected view.
     */
    setView = (view) => {
        this.setState({
            view : view
        })
    }

    /**
     * Set selectedHospitals to
     * @param {Array} selectedHospitals The selected hospitals.
     */
    updateSelectedHospitals = (selectedHospitals) => {
        this.setState({
            selectedHospitals : selectedHospitals
        })
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {

        let centralPanel = (this.state.view !== 1)
            ? (
                <CentralPanel
                    view={this.state.view}
                    variables={this.state.variables}
                    hospitals={this.state.hospitals}
                    hasLoaded={this.state.hasLoaded}
                    fetchData={this.applyVariables}
                />
            )
            : null
        ;

        let slider = (this.state.years.length > 1 && this.state.view === 1)
            ? (
                <Slider years={this.state.years} selectedYear={this.state.selectedYear} setYear={this.setYear}/>
            )
            : null
        ;

        return (
			<div className="App">
                <Maps
                    objects={(this.state.selectedVariable.variable_model === "Hospital") ? this.state.selectedHospitals : this.state.cantons}
                    variableInfo={this.state.selectedVariable}
                    year={this.state.selectedYear}
                    hasLoaded={this.state.hasLoaded}
                    view={this.state.view}
                />
				<div className="grid-container">
                    <ControlPanel
                        view={this.state.view}
                        setView={this.setView}
                        hospitals={this.state.hospitals}
                        selectVariable={this.selectVariable}
                        selectedVariable={this.state.selectedVariable}
                        variables={this.state.variables}
                        fetchData={this.applyVariables}
                        updateHospitals={this.updateSelectedHospitals}
                        year={this.state.selectedYear}
                        hasLoaded={this.state.hasLoaded}
                    />
                    {centralPanel}
                    <LanguagePicker resendInitApiCall={this.initApiCall} />
                    {slider}
				</div>
			</div>
        );
    }
}

/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedApp = withTranslation()(App);
export default LocalizedApp;
