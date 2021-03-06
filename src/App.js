import React, { Component } from 'react';
import Maps from './components/Maps/Maps.js';
import './App.css';
import { withTranslation } from 'react-i18next';
import ControlPanel from './components/ControlPanel/ControlPanel.js'
import CentralPanel from './components/CentralPanel/CentralPanel.js'
import LanguagePicker from './components/LanguagePicker/LanguagePicker.js';
import Slider from './components/Slider/Slider.js'

const apiURL = "https://qm1.ch/";
let apiRequest = "/api/medical_landscape/";

/**
 * Represents the brain of the application
 * making API calls and distributing data to and from filters and data displaying components
 *
 * The state holds all variables, hospital and canton objects,
 * the selected variables for each view,
 * the selected view, results of filters, the available years,
 * the chosen year, CSV data as well as the information that data has been loaded
*/
class App extends Component {

    state = {
        variables : [],
        hospitals : [],
        cantons : [],

        // different variables applied to the different views
        hospitalMapSelectedVariable : {},
        cantonMapSelectedVariable : {},
        boxPlotSelectedVariable : {},
        regressionSelectedVariableX : {},
        regressionSelectedVariableY : {},

        // different hospital results stored per view
        mapHospitals : [],
        tableHospitals : [],
        boxPlotHospitals : [],
        regressionHospitals : [],

        // results of the different filters
        hospitalsByEnums : [],
        hospitalsByType : [],
        linRegHospitalsByType : [],
        unfilteredHospitals : [],
        filteredHospitals : [],

        years : [],
        selectedYear : "",

        view : 1,
        mapView : 1,
        graphView : 1,

        csvData : [],

        hasLoaded : false,
        tableDataLoaded : false
    }

    /**
    * Calls the API with specific query.
    * @param  {String} query The specific query to use for the API call.
    */
    applyVariables = (query) => {
        let key;
        return this.apiCall(query).then((results) => {

            // determining which state variable to store the results in
            if (this.state.view === 1) {
                key = (this.state.mapView === 1) ? "mapHospitals" : "cantons";
            } else if (this.state.view === 2) {
                key = "tableHospitals";
            } else {
                key = (this.state.graphView === 1) ? "boxPlotHospitals" : "regressionHospitals";
            }

            this.setState({
                [key] : results,
                hasLoaded : (this.state.view === 2) // only true if on tableView
            }, () => {
                // On the map, years and which hospitals to pass to Maps need to be redetermined
                if (this.state.view === 1) {
                    if (this.state.mapView === 1) {
                        this.filterHospitals(true); // only needed for hospitals
                    } else {
                        this.setYears(results);
                    }
                } else if (this.state.view === 3) {
                    if (this.state.graphView === 2) {
                        this.filterHospitals(true); // only needed for hospitals
                    } else {
                        this.setYears(results);
                    }
                }
            })
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
     * Handles the change of language:
     * Replaces state.variables
     * Replaces viewSpecificVariable with translated equivalent
     */
    changeLanguage = () => {
        this.apiCall("variables").then((results) => {
            let currentVariableKey = this.getViewSpecificVariable();
            if (currentVariableKey !== "regressionSelectedVariableX") {
                let currentVariable = this.state[currentVariableKey];
                let translatedCurrentVariable = currentVariable; // as fallback, this makes sure nothing changes
                if (Object.keys(currentVariable).length > 0) { // making sure that currentVariable.name exists
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].name === currentVariable.name) {
                            translatedCurrentVariable = results[i];
                        }
                    }
                }
                this.setState({
                    variables : results,
                    [currentVariableKey] : translatedCurrentVariable
                });
            } else {
                let currentVariable = this.state.regressionSelectedVariableX;
                let currentVariable2 = this.state.regressionSelectedVariableY;
                let translatedCurrentVariable = currentVariable;
                let translatedCurrentVariable2 = currentVariable2;
                if (Object.keys(currentVariable).length > 0 && Object.keys(currentVariable2).length > 0) { // making sure that currentVariable.name exists
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].name === currentVariable.name) {
                            translatedCurrentVariable = results[i];
                        } else if (results[i].name === currentVariable2.name){
                            translatedCurrentVariable2 = results[i];
                        }
                    }
                }
                this.setState({
                    variables : results,
                    regressionSelectedVariableX : translatedCurrentVariable,
                    regressionSelectedVariableY : translatedCurrentVariable2
                })
            }
        });
    }

    /**
    * Initialises the state variables with a call to the API.
    */
    initApiCall = () => {
        // fetching all hospitals from the API
        this.apiCall("hospitals").then((result) => {
            this.setState({
                hospitals : result
            });
        })

        // fetches all Variables from the API
        this.apiCall("variables").then((result) => {
            this.setState({
                variables : result
            });

            // the default variable chosen when loading the app
            this.setVariable(result[1]);
            let query = "hospitals?variables=";
            query += encodeURIComponent(result[1].name + "$Typ");
            this.applyVariables(query);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component (or two if lin. reg.),
    * @param  {Object} item The selected variable.
    */
    setVariable = (item) => {
        if (item.length === 2) {
            if (item[0] !== this.state.regressionSelectedVariableX || item[1] !== this.state.regressionSelectedVariableY) {
                this.setState({
                    regressionSelectedVariableX : item[0],
                    regressionSelectedVariableY : item[1],
                    hasLoaded : false
                })
            }
        } else {
            let key = this.getViewSpecificVariable();
            if (this.state[key] !== item) {
                this.setState({
                    [key] : item,
                    hasLoaded : false
                });
            }
        }
    }

    /**
     * Determines which Hospitals to pass to MAPS.js according to type & enum filters,
     * saves the list into filteredHospitals in the state.
     * @param {boolean} updateYears true if years need to be updated
     */
    filterHospitals = (updateYears) => {
        const {hospitalsByEnums, hospitalsByType, linRegHospitalsByType, mapHospitals, regressionHospitals} = this.state;

        let filteredHospitals = [], intersectingHospitals = [];

        // filtering for maps
        if (this.state.view === 1) {
            // [0] === 0 is specified as "no match" in FilterEditor | HospitalTypeFilter => filteredHospitals stays empty
            if (!(hospitalsByEnums[0] === 0 || hospitalsByType[0] === 0)) {
                // in case of no matches, there would be no need to do intersection
                if (hospitalsByEnums.length > 0 && hospitalsByType.length > 0) {
                    // we have to compare names because the attribute of each hospital has a different length
                    for (let i = 0; i < hospitalsByType.length; i++) {
                        for (let j = 0; j < hospitalsByEnums.length; j++) {
                            if (hospitalsByEnums[j].name === hospitalsByType[i].name) {
                                intersectingHospitals.push(hospitalsByEnums[j]);
                            }
                        }
                    }
                } else if (hospitalsByEnums.length > 0 || hospitalsByType.length > 0) {
                    intersectingHospitals = (hospitalsByType > hospitalsByEnums) ? hospitalsByType : hospitalsByEnums;
                } else {
                    filteredHospitals = mapHospitals;
                }

                if (intersectingHospitals.length > 0) {
                    for (let i = 0; i < intersectingHospitals.length; i++) {
                        for (let j = 0; j < mapHospitals.length; j++) {
                            if (intersectingHospitals[i].name === mapHospitals[j].name) {
                                filteredHospitals.push(mapHospitals[j]);
                            }
                        }
                    }
                }
            }
        } else if (this.state.view === 3) { // filtering for lin. regression
            if (linRegHospitalsByType.length > 0 && regressionHospitals.length > 0) {
                for (let i = 0; i < linRegHospitalsByType.length; i++) {
                    for (let j = 0; j < regressionHospitals.length; j++) {
                        if (linRegHospitalsByType[i].name === regressionHospitals[j].name) {
                            filteredHospitals.push(regressionHospitals[j]);
                        }
                    }
                }
            } else {
                filteredHospitals = regressionHospitals;
            }
        }
        let unfiltered = mapHospitals;
        let toDeriveYearsFrom = (this.state.view === 1) ? mapHospitals : regressionHospitals;
        this.setState({
            filteredHospitals : filteredHospitals,
            unfilteredHospitals : unfiltered,
            hasLoaded : !updateYears
        }, () => {
            if (updateYears) {
                this.setYears(toDeriveYearsFrom);
            }
        });
    }

    /**
     * Setting state.years to list of available years in given objects for selected Variable
     * @param {Object} objects Cantons/Hospitals
     */
    setYears = (objects) => {
        const {name, is_time_series} = this.state[this.getViewSpecificVariable()];
        let maxYears = [], years, recent;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].attributes[name] !== null) {
                if (is_time_series) {
                    years = Object.keys(objects[i].attributes[name]);
                    maxYears = (years.length > maxYears.length) ? years : maxYears;
                }
            }
        }
        recent = maxYears.length - 1;
        this.setState({
            years : maxYears,
            selectedYear : (maxYears.length > 0) ? maxYears[recent] : "",
            hasLoaded : true
        })
    }

    /**
     * Determines which selectedVariable of the state to use, depending on the currently selected view.
     * @return {String} variable the current relevant variable.
     */
    getViewSpecificVariable = () => {
        let variable;
        switch (this.state.view) {
            case 1:
                variable = (this.state.mapView === 1) ? "hospitalMapSelectedVariable" : "cantonMapSelectedVariable"
                break;
            case 3:
                variable = (this.state.graphView === 1) ? "boxPlotSelectedVariable" : "regressionSelectedVariableX";
                break;
            default:
                variable = "hospitalMapSelectedVariable";
        }
        return variable;
    }

    /**
     * Setter for the selectedYear state variable.
     * @param {String} year The selected year.
     */
    setYear = (year) => {
        this.setState({
            selectedYear : year
        });
    }

    /**
     * Setter for the view state variable.
     * @param {number} view The selected view.
     */
    setView = (view) => {
        this.setState({
            view : view,
            hasLoaded : false
        }, () => {
            this.filteringOnViewChange();
        })
    }

    /**
     * Setter for the mapView state variable.
     * @param {number} view The selected view.
     */
    setMapView = (view) => {
        this.setState({
            mapView : view,
            hasLoaded : false
        }, () => {
            this.filteringOnViewChange();
        })
    }

    /**
     * Setter for the graphView state variable.
     * @param {number} view The selected view.
     */
    setGraphView = (view) => {
        this.setState({
            graphView : view,
            hasLoaded : false
        }, () => {
            this.filteringOnViewChange();
        });
    }

    /**
     * Decides if hospitals habe to be filtered depending on the change of view and the active tab on that view.
     */
    filteringOnViewChange = () => {
        let view = this.state.view;

        if (view === 1) {
            if (this.state.mapView === 1) {
                this.filterHospitals(true);
            } else {
                this.setYears(this.state.cantons);
            }
        } else if (view === 3) {
            if (this.state.graphView === 1) {
                this.setYears(this.state.boxPlotHospitals);
            } else {
                this.filterHospitals(true);
            }
        } else {
            this.setState({
                hasLoaded : true
            });
        }
    }

    /**
     * Set hospitalsByEnums to the selected Hospital Variable
     * @param {Array} selectedHospitals The selected hospitals.
     */
    setHospitalsByEnums = (selectedHospitals) => {
        this.setFilterHospitals(selectedHospitals, "hospitalsByEnums");
    }

    /**
     * Set hospitalsByType to selected Hospital Type
     * @param {Array} selectedHospitals The selected hospitals.
     */
    setHospitalsByType = (selectedHospitals) => {
        this.setFilterHospitals(selectedHospitals, "hospitalsByType");
    }

    /**
     * Set LinRegHospitalsByType to selected Hospital Type
     * @param {Array} selectedHospitals The selected hospitals.
     */
    setLinRegHospitalsByType = (selectedHospitals) => {
        this.setFilterHospitals(selectedHospitals, "linRegHospitalsByType");
    }

    /**
     * Set given state variable to selected hospitals
     * @param {Array} selectedHospitals The selected hospitals.
     * @param {String} stateVar the state variable to be set
     */
    setFilterHospitals = (selectedHospitals, stateVar) => {
        let isEmpty = !(selectedHospitals.length > 0);
        this.setState({
            [stateVar] : selectedHospitals,
            hasLoaded : false
        }, () => {
            if (!isEmpty) {
                this.filterHospitals(false); // years do not need to be updated
            }
        })
    }

    /**
     * Set CSV data
     * @param {Array} data the csv data.
     */
    setCSVData = (data) => {
        this.setState({
            csvData : data
        })
    }

    /**
     * is invoked immediately after the component is mounted
     * makes intitial API call
     */
    componentDidMount() {
        this.initApiCall();
    }

    /**
     * render - renders the component to the screen
     * @return {JSX}  JSX of the component
    */
    render() {
        const {
            variables,
            hospitals,
            cantons,
            hospitalMapSelectedVariable,
            cantonMapSelectedVariable,
            boxPlotSelectedVariable,
            regressionSelectedVariableX,
            regressionSelectedVariableY,
            mapHospitals,
            tableHospitals,
            boxPlotHospitals,
            unfilteredHospitals,
            filteredHospitals,
            years,
            selectedYear,
            view,
            mapView,
            graphView,
            csvData,
            hasLoaded
        } = this.state;

        let viewSpecificObjects;
        let viewSpecificVariable;

        // determines which objects to pass to children components depending on the view
        switch (view) {
            case 1:
                viewSpecificObjects = (mapView === 1) ? filteredHospitals : cantons;
                viewSpecificVariable = (mapView === 1) ? hospitalMapSelectedVariable : cantonMapSelectedVariable;
                break;
            case 2:
                viewSpecificObjects = (tableHospitals.length > 0) ? tableHospitals : hospitals;
                viewSpecificVariable = {};
                break;
            case 3:
                viewSpecificObjects = (graphView === 1) ? boxPlotHospitals : filteredHospitals;
                viewSpecificVariable = (graphView === 1) ? boxPlotSelectedVariable : [regressionSelectedVariableX, regressionSelectedVariableY];
                break;
            default:
                viewSpecificObjects = mapHospitals;
                viewSpecificVariable = hospitalMapSelectedVariable;
                break;
        }

        // renders the central panel if not on mapView
        let centralPanel = (view !== 1)
            ? (
                <CentralPanel
                    view={view}
                    graphView={graphView}
                    variables={variables}
                    hasLoaded={hasLoaded}
                    fetchData={this.applyVariables}
					objects={viewSpecificObjects}
                    setVariable={this.setVariable}
                    selectedVariable={viewSpecificVariable}
                    setCSVData={this.setCSVData}
                    year={selectedYear}
                />
            )
            : null
        ;

        let slider;
        // display the slider only on Maps or Graphs and only if more than one year is available
        if (years.length > 1 && view !== 2 && Object.keys(viewSpecificVariable).length > 0) {
            slider = (<Slider years={years} selectedYear={selectedYear} setYear={this.setYear} hasLoaded={hasLoaded}/>);
        }

        return (
			<div className="App">
                <Maps
                    objects={viewSpecificObjects}
                    selectedVariable={viewSpecificVariable}
                    year={selectedYear}
                    hasLoaded={hasLoaded}
                    view={view}
                    mapView={mapView}
                />
                <div className="grid-container">
                    <ControlPanel
                        variables={variables}
                        setVariable={this.setVariable}
                        selectedVariable={viewSpecificVariable}
                        fetchData={this.applyVariables}
                        unfilteredHospitals={unfilteredHospitals}
                        filterByEnum={this.setHospitalsByEnums}
                        filterByType={this.setHospitalsByType}
                        filterLinRegByType={this.setLinRegHospitalsByType}
                        year={selectedYear}
                        hasLoaded={hasLoaded}
                        view={view}
                        setView={this.setView}
                        mapView={mapView}
                        setMapView={this.setMapView}
                        graphView={graphView}
                        setGraphView={this.setGraphView}
                        csvData={csvData}
                    />
                    {centralPanel}
                    <LanguagePicker changeLanguage={this.changeLanguage} />
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
