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

class App extends Component {

    state = {
        variables : [],
        hospitals : [],
        cantons : [],

        // different variables applied to the different views
        hospitalMapSelectedVariable : {},
        cantonMapSelectedVariable : {},
        boxPlotSelectedVariable : {},

        // different hospital results stored per view
        mapHospitals : [],
        tableHospitals : [],
        boxPlotHospitals : [],
        regressionHospitals : [],

        // results of the different filters
        hospitalsByEnums : [],
        hospitalsByType : [],
        unfilteredHospitals : [],
        filteredHospitals : [],

        years : [],
        selectedYear : "",

        view : 1,
        mapView : 1,
        graphView : 1,

        hasLoaded : false,
        tableDataLoaded : false
    }

    /**
    * Calls the API with specific query.
    * @param  {String} query The specific query to use for the API call.
    */
    applyVariables = (query) => {
        console.log("FETCHING DATA, QUERY: " + query);
        let key;
        return this.apiCall(query).then((results) => {
            console.log("DATA FETCHED");
            if (this.state.view === 1) {
                key = (this.state.mapView === 1) ? "mapHospitals" : "cantons";
            } else if (this.state.view === 2) {
                key = "tableHospitals";
            } else {
                key = (this.state.graphView === 1) ? "boxPlotHospitals" : "regressionHospitals";
            }

            this.setState({
                [key] : results,
                hasLoaded : (this.state.view !== 1 || this.state.mapView !== 1)
            }, () => {
                if (this.state.view === 1) {
                    if (this.state.mapView === 1) {
                        this.filterHospitals(); // only needed for hospitals while on the map View
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

    changeLanguage = () => {
        // this.initApiCall();

        // TODO: implement to avoid resetting when changing the language

        //const {view, mapView, hospitalMapSelectedVariable, cantonMapSelectedVariable, boxPlotSelectedVariable, mapHospitals, tableHospitals, boxPlotHospitals, regressionHospitals, cantons} = this.state;
        this.apiCall("variables").then((result) => {
            this.setState({
                variables : result,
            });
        });
            // let typeVar = result.filter((variable) => {
            //     return (variable.name === "Typ");
            // })

            // // different variables applied to the different views
            // cantonMapSelectedVariable : {},
            // boxPlotSelectedVariable : {},
            //
            // // different hospital results stored per view
            // mapHospitals : [],
            // tableHospitals : [],
            // boxPlotHospitals : [],
            // regressionHospitals : [],
            // let hMSV = {}, cMSV = {}, bPSV = {}, mH, tH, bH, rH, can;
            //
            // for (var i = 0; i < result.length; i++) {
            //     if (result[i].name === hospitalMapSelectedVariable.name) {
            //         hMSV = result[i];
            //     } else if (result[i].name === cantonMapSelectedVariable.name) {
            //         cMSV = result[i];
            //         let query = "cantons?variables=";
            //         query += encodeURIComponent(cMSV.name);
            //         can = this.apiCall(query);
            //     } else if (result[i].name === boxPlotSelectedVariable) {
            //         bPSV = result[i];
            //         let query = "hospitals?variables=";
            //         query += encodeURIComponent(bPSV.name);
            //         can = this.apiCall(query);
            //     }
            // }
            //
            // if (Objects.keys(hMSV).length > 0) {
            //     let query = "hospitals?variables=";
            //     query += encodeURIComponent(hMSV.name + "$" + typeVar[0].name);
            //     mH = this.apiCall(query).then((results) => {
            //         mH = mH.filter((hospital) => {
            //             for (let i = 0; i < this.state.mapHospitals.length; i++) {
            //                 if (this.state.mapHospitals[i].name === hospital.name) {
            //                     return true;
            //                 }
            //             }
            //         })
            //     });
            // }

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

            // the "type" variable which is loaded with every request
            let typeVar = result.filter((variable) => {
                return (variable.name === "Typ");
            })

            // the default variable chosen when loading the app
            this.setVariable(result[1]);
            let query = "hospitals?variables=";
            query += encodeURIComponent(result[1].name + "$" + typeVar[0].name);
            this.applyVariables(query);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
    * @param  {Variable object} item The selected variable.
    */
    setVariable = (item) => {
        console.log("============================");
        console.log("SETTING variable to " + item.name);
        let key = this.getViewSpecificVariable();

        if (this.state[key] !== item) {
            this.setState({
                [key] : item,
                hasLoaded : false
            });
        } else {
            console.log("Same Variable selected, nothing to change.");
        }
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
     * Determines which Hospitals to pass to MAPS.js according to type & enum filters,
     * saves the list into filteredHospitals in the state.
     */
    filterHospitals = () => {
        const {hospitalsByEnums, hospitalsByType, mapHospitals} = this.state;
        let filteredHospitals = [], intersectingHospitals = [];
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
        console.log("DATA FILTERED");
        let unfiltered = mapHospitals;
        this.setState({
            filteredHospitals : filteredHospitals,
            unfilteredHospitals : unfiltered,
        }, () => {
            this.setYears(this.state.mapHospitals);
        });
    }

    /**
     * Returns list of available years for selected Variable.
     * @return {Array} The available years.
     */
    setYears = (objects) => {
        console.log("GETTING YEARS");
        const {name} = this.state[this.getViewSpecificVariable()];
        let maxYears = [], years, recent;
        for (var i = 0; i < objects.length; i++) {
            years = Object.keys(objects[i].attributes[name]);
            maxYears = (years.length > maxYears.length) ? years : maxYears;
        }
        recent = maxYears.length - 1;
        this.setState({
            years : maxYears,
            selectedYear : maxYears[recent],
            hasLoaded : true
        })
    }

    /**
     * Determines which selectedVariable of the state to use, depending on the currently selected view.
     * @return {String} The current relevant variable.
     */
    getViewSpecificVariable = () => {
        let v;
        switch (this.state.view) {
            case 1:
                v = (this.state.mapView === 1) ? "hospitalMapSelectedVariable" : "cantonMapSelectedVariable"
                break;
            case 3:
                v = "boxPlotSelectedVariable";
                break;
            default:
                v = "hospitalMapSelectedVariable";
        }
        return v;
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
        console.log("SWITCHING TABVIEW");
        this.setState({
            view : view,
        })
    }

    /**
     * Setter for the mapView state variable.
     * @param {int} view The selected view.
     */
    setMapView = (view) => {
        console.log("SWITCHING MAPVIEW");

        this.setState({
            mapView : view,
            hasLoaded : false
        }, () => {
            let objects = (view === 1) ? this.state.mapHospitals : this.state.cantons
            this.setYears(objects);
        })
    }

    /**
     * Setter for the graphView state variable.
     * @param {int} view The selected view.
     */
    setGraphView = (view) => {
        console.log("SWITCHING GRAPHVIEW");
        this.setState({
            graphView : view
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
            console.log("UPDATING filterhospitals from setHospitalsByEnums");
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
            console.log("UPDATING filterhospitals from setHospitalsByType");
            this.filterHospitals();
        })
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {
        const {
            variables,
            hospitals,
            cantons,
            hospitalMapSelectedVariable,
            cantonMapSelectedVariable,
            boxPlotSelectedVariable,
            mapHospitals,
            tableHospitals,
            boxPlotHospitals,
            regressionHospitals,
            unfilteredHospitals,
            filteredHospitals,
            years,
            selectedYear,
            view,
            mapView,
            graphView,
            hasLoaded
        } = this.state;

        let viewSpecificObjects;
        let viewSpecificVariable;

        switch (view) {
            case 1:
                viewSpecificObjects = (mapView === 1) ? filteredHospitals : cantons;
                viewSpecificVariable = (mapView === 1) ? hospitalMapSelectedVariable : cantonMapSelectedVariable;
                break;
            case 2:
                viewSpecificObjects = (tableHospitals.length > 0) ? tableHospitals : hospitals;
                break;
            case 3:
                viewSpecificObjects = (graphView === 1) ? boxPlotHospitals : regressionHospitals;
                viewSpecificVariable = boxPlotSelectedVariable;
                break;
            default:
                viewSpecificObjects = mapHospitals;
                viewSpecificVariable = hospitalMapSelectedVariable;
                break;
        }

        if (hasLoaded) {
            console.log("DATA READY");
            //console.log("PASSING VAR: " + viewSpecificVariable.name);
            console.log("PASSING OBJ: " + viewSpecificObjects.length);
            console.log("OBJ SAMPLE: ");
            console.log(viewSpecificObjects[0]);
        }

        let centralPanel = (view !== 1)
            ? (
                <CentralPanel
                    view={view}
                    graphView={graphView}
                    variables={variables}
                    hasLoaded={hasLoaded}
                    fetchData={this.applyVariables}
					objects={viewSpecificObjects}
                    variableInfo={viewSpecificVariable}
                    year={selectedYear}
                />
            )
            : null
        ;

        let slider;

        if (years.length > 1 && view === 1 && Object.keys(viewSpecificVariable).length !== 0) {
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
                        year={selectedYear}
                        hasLoaded={hasLoaded}
                        view={view}
                        setView={this.setView}
                        mapView={mapView}
                        setMapView={this.setMapView}
                        graphView={graphView}
                        setGraphView={this.setGraphView}
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
