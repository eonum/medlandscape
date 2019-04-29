import React, { Component } from 'react';
import DropdownMenu from './components/DropdownMenu/DropdownMenu.js';
import Maps from './components/Maps/Maps.js';
import Slider from './components/Slider/Slider.js'
import FilterEditor from './components/FilterEditor/FilterEditor.js';
import './App.css';
import { withTranslation } from 'react-i18next';
import LanguagePicker from './components/LanguagePicker/LanguagePicker.js';

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
        hasLoaded : false
    }

    /**
    * Sets the selected variable as selectedVariable
    * Fetches Cantons or Hospitals with the selectedVariable information.
    * @param  {Variable Object} variable The selected Variable to apply to Hospitals or Cantons.
    * @param  {boolean} init Flag to see if initApiCall was called, if true: sets selectedHospitals to hospitals
    */
    fetchMapData = (variable) => {
        const {name, variable_model} = variable;
        let query = this.props.i18n.language + apiRequest;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        query += key + "?variables=";
        query += encodeURIComponent(variable.name);

        this.apiCall(query).then((results) => {
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
            let years = this.getYears(this.state.selectedVariable);
            this.setState({
                years : years,
                selectedYear : years[0],
                hasLoaded : true
            })
        });
    }

    fetchEnumData = (variable) => {
        const {name} = variable;
        let query = this.props.i18n.language + apiRequest + "hospitals?variables=";
        query += encodeURIComponent(this.state.selectedVariable.name + "$");
        query += encodeURIComponent(name);

        return this.apiCall(query).then((results) => {
            this.setState({
                hospitals : results,
                selectedHospitals : results
            });
        }).then(() => {
            let years = this.getYears(this.state.selectedVariable);
            this.setState({
                years : years,
                selectedYear : years[0],
                hasLoaded : true
            })
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
        let varResultArr, enumVars = [];

        // fetches all Variables from the API
        this.apiCall((this.props.i18n.language + apiRequest + "variables")).then((result) => {
            // filters out enum variables (relevant for FilterEditor)
            enumVars = result.filter(obj => {
                return obj.variable_type === "enum";
            })
            this.setState({
                variables : result,
                enums : enumVars
            });
            this.fetchMapData(result[1]);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
    * then calls fetchMapData to fetch data from the API.
    * @param  {Variable object} item The selected variable.
    */
    selectVariable = (item) => {
        this.setState({
            selectedVariable : item,
            hasLoaded : false
        });
        this.fetchMapData(item);
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
     * [setYear description]
     */
    setYear = (year) => {
        this.setState({
            selectedYear : year
        })
    }

    /**
     * Set selectedHospitals to
     * @param {Array} the selected hospitals.
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
        let cantonVars = [], hospitalVars = [], years = [];
        let selectedCanton = {}, selectedHospital = {};

        cantonVars = this.state.variables.filter(variable => {
            return variable.variable_model === "Canton"
        });

        hospitalVars = this.state.variables.filter(variable => {
            return (variable.variable_model === "Hospital") && (variable.variable_type !== "enum")
        });

        if (this.state.selectedVariable.variable_model === "Hospital") {
            selectedHospital = this.state.selectedVariable;
            selectedCanton = cantonVars[0];
        } else {
            selectedCanton = this.state.selectedVariable;
            selectedHospital = hospitalVars[0];
        }

        const { t } = this.props;

        return (
			<div className="App">
				<div className="grid-container">
					<div className="control-panel">
						<p>{t('variables.name_canton')}</p>
						<DropdownMenu id="cantonVars" listItems={cantonVars} selectItem={this.selectVariable} selectedItem={selectedCanton} />
						<p>{t('variables.name_hospital')}</p>
						<DropdownMenu id="hospitalVars" listItems={hospitalVars} selectItem={this.selectVariable} selectedItem={selectedHospital} />
						<LanguagePicker resendInitApiCall={this.initApiCall} />
					</div>
					{
						(this.state.years.length > 1)
						? <Slider years={this.state.years} selectedYear={this.state.selectedYear} setYear={this.setYear}/>
						: null
					}
				</div>
				<Maps objects={(this.state.selectedVariable.variable_model === "Hospital") ? this.state.selectedHospitals : this.state.cantons} variableInfo={this.state.selectedVariable} year={this.state.selectedYear} hasLoaded={this.state.hasLoaded} />
				<FilterEditor hospitals={this.state.hospitals} updateHospitals={this.updateSelectedHospitals} fetchData={this.fetchEnumData} hasLoaded={this.state.hasLoaded} selectedYear={this.state.selectedYear} enums={this.state.enums} />
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
