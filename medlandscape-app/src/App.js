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

    constructor(props) {
        super(props)
        this.state = {
            variables: [],
            cantons : [],
            hospitals : [],

            selectedVariable : {},
            selectedCantons : [],
            selectedHospitals : [],
            selectedYear : "",
            hasLoaded : false
        }
    }

    /**
    * Fetches Cantons or Hospitals with the selected Variable information.
    * @param  {Variable Object} selectedVar The selected Variable to apply to Hospitals or Cantons.
    */
    applyVar = (selectedVar) => {
        const {name, variable_model} = selectedVar;

        let query = this.props.i18n.language + apiRequest;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        query += key + "?variables=" + encodeURIComponent(name);

        this.apiCall(query).then((results) => {
            this.setState({
                [key] : results.map(obj => {
                    return obj;
                }),
            });
            if (key === "hospitals"){
                this.setState({selectedHospitals : results.map(obj => {
                    return obj;
                    }),
                });
            }
        }).then(() => {
            this.setState({
                hasLoaded : true,
                selectedYear : this.getYears()[0]
            });
        })
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

        this.apiCall((this.props.i18n.language + apiRequest + "variables")).then((result) => {
            varResultArr = result.map(obj => {
                return obj;
            })
        });

        // hospitals already fetched in applyVar()

        this.apiCall((this.props.i18n.language + apiRequest + "cantons")).then((result) => {
            cantonResultArr = result.map(obj => {
                return obj;
            })
        }).then(() => {
            this.setState({
                variables : varResultArr,
                cantons : cantonResultArr,
                selectedVariable : varResultArr[0]
            });
            this.applyVar(varResultArr[0]);
        });
    }

    /**
    * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
    * then calls applyVar to fetch data from the API.
    * @param  {Variable object} item The selected variable.
    */
    dropdownSelectItem = (item) => {
        this.setState({
            selectedVariable : item,
            hasLoaded : false
        });
        this.applyVar(item);
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
     * @return {Array} The available years.
     */
    getYears = () => {
        let selVar = this.state.selectedVariable;
        let selObj = (selVar.variable_model === "Hospital") ? this.state.selectedHospitals : this.state.cantons;
        let years = (selVar.is_time_series) ? Object.keys(selObj[0].attributes[selVar.name]) : ["Aktuell"];
        return years;
    }

    /**
     * [setYear description]
     */
    setYear = (year) => {
        this.setState({
            selectedYear : year,
            hasLoaded : true
        })
    }

    /**
     * Set selectedHospitals to
     * @param {Array} the selected hospitals.
     */
    updateSelectedHospitals = (selectedHospitals) => {
        this.setState({
            selectedHospitals: selectedHospitals
        })
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {
        let cantonVars = [], hospitalVars = [], years = [];
        let selectedCanton = {}, selectedHospital = {};

        hospitalVars = this.state.variables.filter(variable => {
            if (variable.variable_model === "Hospital")
            return variable
        })
        cantonVars = this.state.variables.filter(variable => {
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

        const { t } = this.props;
        years = (this.state.hasLoaded) ? this.getYears() : [];
        console.log(this.state.variables);
        return (
			<div className="App">
				<div className="grid-container">
					<div className="control-panel">
						<p>{t('variables.name_canton')}</p>
						<DropdownMenu id="cantonVars" listItems={cantonVars} selectItem={this.dropdownSelectItem} selectedItem={selectedCanton} />
						<p>{t('variables.name_hospital')}</p>
						<DropdownMenu id="hospitalVars" listItems={hospitalVars} selectItem={this.dropdownSelectItem} selectedItem={selectedHospital} />
						<LanguagePicker resendInitApiCall={this.initApiCall} />
					</div>
					{
						(years.length > 1)
						? <Slider years={years} selectedYear={this.state.selectedYear} setYear={this.setYear}/>
						: null
					}
				</div>
				<Maps objects={(this.state.selectedVariable.variable_model === "Hospital") ? this.state.selectedHospitals : this.state.cantons} variableInfo={this.state.selectedVariable} year={this.state.selectedYear} hasLoaded={this.state.hasLoaded} />
				<FilterEditor hospitals={this.state.hospitals} updateHospitals={this.updateSelectedHospitals} hasLoaded={this.state.hasLoaded} variables={this.state.variables}/>
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
