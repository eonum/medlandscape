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
        cantons : [],
        hospitals : [],

        selectedVariable : {},

        hospitalsByEnums : [],
        hospitalsByType : [],
        filteredHospitals : [],

        years : [],
        selectedYear : "",

        view : 1,
        mapView : 1,

        hasLoaded : false,
        tableDataLoaded : false
    }

    /**
    * Calls the API with specific query
    * @param {String} key String value that is either hospitals or cantons.
    * @param  {String} query The specific query to use for the API call.
    */
    applyVariables = (key, query) => {
        return this.apiCall(query).then((results) => {
            this.setState({
                [key] : results,
                hasLoaded : false
            });
        }).then(() => {
            if (this.state.view !== 1) {
                // other views
                this.setState({
                    hasLoaded : true
                });
            } else {
                // map view specific
                let years = this.getYears(this.state[key]);

                this.setState({
                    years : years,
                    selectedYear : years[0],
                    hasLoaded : (this.state.mapView !== 1)
                }, () => {
                    if (this.state.mapView === 1) {
                        this.filterHospitals();
                    }
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
        return fetch(apiURL + this.props.i18n.language + apiRequest + query).then(res => res.json());
    }

    /**
    * Initialises the state variables with a call to the API.
    */
    initApiCall = () => {
        let varResultArr = [];

        // fetches all Variables from the API
        this.apiCall(("variables")).then((result) => {
            this.setState({
                variables : result,
            });

            // the "type" variable which is loaded with every request
            let typeVar = result.filter((variable) => {
                return (variable.name === "Typ");
            })

            // the default variable chosen when loading the app
            this.setVariable(result[1]);
            let query = "hospitals?variables=";
            query += encodeURIComponent(result[1].name + "$" + typeVar[0].name);
            this.applyVariables("hospitals", query);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
    * @param  {Variable object} item The selected variable.
    */
    setVariable = (item) => {
        this.setState({
            selectedVariable : item,
            hasLoaded : false
        });
    }

    /**
     * Comment here please
     */
    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }

    /**
     * Determines which Hospitals to display on the map according to fitlers.
     * @return {Array} The array of hospitals to display.
     */
    filterHospitals = () => {
        const {hospitalsByEnums, hospitalsByType, hospitals} = this.state;
        let filteredHospitals = [];
        if (!(hospitalsByEnums[0] === 0 || hospitalsByType[0] === 0)) {
            // in case of no matches, there would be no need to do intersection
            if (hospitalsByEnums.length > 0 && hospitalsByType.length > 0) {
                // we have to compare names because the attribute of each hospital has a different length
                for (let i = 0; i < hospitalsByType.length; i++) {
                    for (let j = 0; j < hospitalsByEnums.length; j++) {
                        if (hospitalsByEnums[j].name === hospitalsByType[i].name) {
                            filteredHospitals.push(hospitalsByEnums[j]);
                        }
                    }
                }
            } else if (hospitalsByEnums.length > 0 || hospitalsByType.length > 0) {
                filteredHospitals = (hospitalsByType > hospitalsByEnums) ? hospitalsByType : hospitalsByEnums;
            } else {
                filteredHospitals = hospitals;
            }
        }

        this.setState({
            filteredHospitals : filteredHospitals,
            hasLoaded : true
        });
    }

    /**
     * Returns list of available years for selected Variable.
     * @return {Array} The available years.
     */
    getYears = (objects) => {
        const {variable_model, is_time_series, name} = this.state.selectedVariable;
        let maxYears = [], years;
        for (var i = 0; i < objects.length; i++) {
            years = Object.keys(objects[i].attributes[name]);
            maxYears = (years.length > maxYears.length) ? years : maxYears;
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

    setMapView = (view) => {
        this.setState({
            mapView : view
        })
    }

    /**
     * Set hospitalsByEnums to the selected Hospital Variable
     * @param {Array} selectedHospitals The selected hospitals.
     */
    setHospitalsByEnums = (selectedHospitals) => {
        this.setState({
            hospitalsByEnums : selectedHospitals,
            hasLoaded : false
        }, () => {
            this.filterHospitals();
        })
    }

    /**
     * Set hospitalsByType to selected Hospital Type
     * @param {Array} selectedHospitals The selected hospitals.
     */
    setHospitalsByType = (selectedHospitals) => {
        this.setState({
            hospitalsByType : selectedHospitals,
            hasLoaded : false
        }, () => {
            this.filterHospitals();
        })
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {

        const {selectedVariable, selectedHospitals, selectedYear, hasLoaded, view, mapView, hospitals, filteredHospitals, cantons, variables, years} = this.state;

        let variableIsTypeHospital = (selectedVariable.variable_model === "Hospital");

        let centralPanel = (view !== 1)
            ? (
                <CentralPanel
                    view={view}
                    variables={variables}
                    hospitals={hospitals}
                    hasLoaded={hasLoaded}
                    fetchData={this.applyVariables}
					objects={variableIsTypeHospital ? hospitals : cantons}
                    variableInfo={selectedVariable}
                    year={selectedYear}
                />
            )
            : null
        ;

        let slider;

        if (years.length > 1 && view === 1) {
             if (variableIsTypeHospital && mapView === 2) {
                slider = null;
            } else if (!variableIsTypeHospital && mapView === 1){
                slider = null;
            } else {
                slider = (<Slider years={years} selectedYear={selectedYear} setYear={this.setYear} hasLoaded={hasLoaded}/>);
            }
        }

        return (
			<div className="App">
                <Maps
                    objects={(variableIsTypeHospital) ? filteredHospitals : cantons}
                    selectedVariable={selectedVariable}
                    year={selectedYear}
                    hasLoaded={hasLoaded}
                    view={view}
                    mapView={mapView}
                    setMapView={this.setMapView}
                />
				<div className="grid-container">
                    <ControlPanel
                        view={view}
                        setView={this.setView}
                        hospitals={hospitals}
                        setVariable={this.setVariable}
                        selectedVariable={selectedVariable}
                        variables={variables}
                        fetchData={this.applyVariables}
                        filterByEnum={this.setHospitalsByEnums}
                        filterByType={this.setHospitalsByType}
                        year={selectedYear}
                        hasLoaded={hasLoaded}
                        mapView={mapView}
                        setMapView={this.setMapView}
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
