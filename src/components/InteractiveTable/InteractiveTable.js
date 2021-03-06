import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import VariableSelector from './VariableSelector/VariableSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import ResultTable from './ResultTable/ResultTable.js';
import update from 'immutability-helper';
import * as d3 from "d3";
import { withTranslation } from 'react-i18next';

/**
 * Represents the Table view which can be used to create and display a 2d-table
 *  to compare different hospitals and their values on selected variables
 *
 * The relevant state consists of an array that holds all dropdowns for hospitals
 *  and one that holds all selected items of those dropdowns. Those arrays
 *  exist for variables as well.
 */
class InteractiveTable extends Component {

    /**
     * constructor - initializes the component by calling the superclass's
     *  constructor and setting the inital state
     *
     * @param  {object} props handed over by parent component
     */
    constructor(props) {
        super(props)
        this.state = {
			nextVariableId : 'var-' + 0,
			variableDropdowns : [],
            selectedVariables : [],

            nextYearId : 'yea-' + 0,
            selectedYears : [],

            nextHospitalId : 'hos-' + 0,
            hospitalDropdowns : [],
            selectedHospitals : [],

            dropdownsNeedUpdate : true,
			csvData : [],

            previousLanguage : props.i18n.language,
            selectionChanged: false
        }
    }

    /**
     * componentDidUpdate - updates the dropdowns if needed and checks if the
     *  language has changed -> if yes, the table is cleared
     */
    componentDidUpdate() {
        if ((this.props.hasLoaded && this.state.dropdownsNeedUpdate)) {
            this.updateAllDropdowns();
        }

        if (this.state.previousLanguage !== this.props.i18n.language) {

            this.setState({
                nextVariableId : 'var-' + 0,
    			variableDropdowns : [],
                selectedVariables : [],

                nextHospitalId : 'hos-' + 0,
                hospitalDropdowns : [],
                selectedHospitals : [],

                previousLanguage: this.props.i18n.language,

                languageDidChange: true
            }, () => {
                this.addHospital();
                this.addVariable();
            });

        }
    }

    /**
     * updateAllDropdowns - Fills the dropdown-lists that were present before
     *  the api request was complete with the correct data. Otherwise they
     *  would be empty lists.
     *
     * @param {Object} newProps if provided, these will be used to update the
     *  dropdowns instead of this.props
     */
    updateAllDropdowns = (newProps) => {
        let props = this.props;
        if (newProps) {
            props = newProps;
        }

        let newHospitalDropdowns = this.state.hospitalDropdowns;
        for (let i = 0; i < this.state.hospitalDropdowns.length; i++) {
            newHospitalDropdowns = update(newHospitalDropdowns, {[i]: {props: {children: {0: {props: {listItems: {$set: props.hospitals}}}}}}});
        }
        let newVariableDropdowns = this.state.variableDropdowns;
        for (let i = 0; i < this.state.variableDropdowns.length; i++) {
            newVariableDropdowns = update(newVariableDropdowns, {[i]: {props: {children: {0: {props: {listItems: {$set: props.variables}}}}}}});
        }
        this.setState({
            hospitalDropdowns : newHospitalDropdowns,
            variableDropdowns : newVariableDropdowns,
            dropdownsNeedUpdate : false,
            dropdownsForceUpdate : false
        });
    }

    /**
     * componentWillReceiveProps - when the language was changed, the listItems
     *  of the existing dropdowns need an update to display the correct items
     */
    componentWillReceiveProps(nextProps) {
        if (this.state.languageDidChange) {
            if (this.props.variables[0].text !== nextProps.variables[0].text) {
                this.setState({
                    languageDidChange : false
                });
                this.updateAllDropdowns(nextProps);
            }
        }
    }


    /**
     * componentDidMount - Adds a dropdown on each dimension by default.
     */
    componentDidMount() {
        this.addHospital();
        this.addVariable();
    }

    /**
     * addHospital - Creates a new dropdown menu to select a hospital to
     *  display, with a new unique id. Then updates the state accordingly.
     */
    addHospital = () => {
        let nextHospId = this.state.nextHospitalId + "";
        let hosp = this.createNewHospital(nextHospId);

        // splits the next id ('var-x') into 'var' and 'x' and increments 'x'
        let hosp_id_parts = nextHospId.split("-");
        nextHospId = hosp_id_parts[0] + "-" + (Number(hosp_id_parts[1]) + 1);

        let newSelectedHospitals = [...this.state.selectedHospitals, hosp[0]];
        let newDropdowns = [...this.state.hospitalDropdowns, hosp[1]];

        this.setState({
            hospitalDropdowns : newDropdowns,
            selectedHospitals : newSelectedHospitals,
            nextHospitalId : nextHospId
        });
        this.selectionChanged();
    }

    /**
     * addAllHospitals - Adds all hospitals available in this.props.hospitals to
     *  the table, deleting existing ones.
     */
    addAllHospitals = () => {
        let hospDropdowns = [];
        let selectedHosps = [];

        let nextHospId = this.state.nextHospitalId + "";

        for (let hosp of this.props.hospitals) {
            let data = this.createNewHospital(nextHospId, hosp);

            selectedHosps.push(hosp);
            hospDropdowns.push(data[1]);

            // splits the next id ('var-x') into 'var' and 'x' and increments 'x'
            let hosp_id_parts = nextHospId.split("-");
            nextHospId = hosp_id_parts[0] + "-" + (Number(hosp_id_parts[1]) + 1);
        }

        this.setState({
            hospitalDropdowns : hospDropdowns,
            selectedHospitals : selectedHosps,
            nextHospitalId : nextHospId
        });
        this.selectionChanged();
    }

    /**
     * createNewHospital - creates a new hospitalDropdown and the according
     *  selectedVariable which is undefined by default, but can be set using
     *  the parameter selectedHosp
     *
	 * @param {String} id of the new hospitalDropdown 
     * @param {Object} newSelectedHospital the hospital that will be selected by default
     *
     * @return {Array} Array containing the selectedHospital variable at index 0
     *  and the new dropdown at index 1
     */
    createNewHospital = (id, newSelectedHospital) => {
        let newDropdown = (
            <div className='hospitalDropdown selectionElement' key={id}>
                <DropdownMenu id={id}
                    listItems={this.props.hospitals}
                    selectItem={this.selectHospital}
                    selectedItem={newSelectedHospital}
                    defaultText={this.props.t('dropDowns.hospitalFallback')}
                />
                <button className="btnSubtractDropDown" onClick={() => this.subtractHospital(id)}>X</button>
            </div>
        );
        return [newSelectedHospital, newDropdown];
    }

    /**
     * subtractHospital - Gets called when the remove button is clicked. Removes
     *  the according dropdown from state.
     *
     * @param {String} senderId Id of the dropdown that should be removed
     */
    subtractHospital = (senderId) => {
		// findIndex does the same as indexOf for arrays, but with a function as input
		let index = this.state.hospitalDropdowns
			.findIndex((item) => {return item.props.children[0].props.id === senderId});
		
		let newSelectedHospitals = [...this.state.selectedHospitals]; // create a copy of the arrays (React state immutable)
		let newHospitalDropDowns = [...this.state.hospitalDropdowns];
		
		// remove the hospital
		newSelectedHospitals.splice(index,1);
		newHospitalDropDowns.splice(index,1);
		
        this.setState({
			selectedHospitals: newSelectedHospitals,
			hospitalDropdowns: newHospitalDropDowns
		});
        this.selectionChanged();
    }

    /**
     * selectHospital - Called when a hospital is selected on a dropdown menu.
     *  It uses the id of the dropdown that called this function to identify it's
     *  index in the dropdowns array and update its displayed text. The index is
     *  as well used to identify the according object in the array of selected
     *  items and update it. Immutabilit-helper is used for that.
     *
     * @param {Object} item the selected item
     * @param {String} senderId Id of the dropdown that selected something
     */
    selectHospital = (item, senderId) => {
		// findIndex does the same as indexOf for arrays, but with a function as input
		let index = this.state.hospitalDropdowns
			.findIndex((item) => {return item.props.children[0].props.id === senderId});
		

        this.setState({
            // selectedHospitals : newList
            selectedHospitals: update(this.state.selectedHospitals, {[index]: {$set: item}}),
            hospitalDropdowns: update(this.state.hospitalDropdowns, {[index]: {props: {children: {0: {props: {selectedItem: {$set: item}}}}}}})
        });
        this.selectionChanged();
    }

    /**
     * addVariable - Creates a new dropdown menu to select a variable to display,
     *  with a new unique id. Then updates the state accordingly.
     */
	addVariable = () => {
        let newVariables = [];
        let newSelectedVariables = [];
        let newSelectedYears = [];

        let nextVariableId = this.state.nextVariableId + "";

        let newDrp = (
            <div className="variableDropdown selectionElement" key={this.state.nextVariableId}>
                <DropdownMenu id={this.state.nextVariableId}
                    listItems={this.props.variables}
                    selectItem={this.selectVariable}
                    defaultText={this.props.t('dropDowns.variablesFallback')}
                />
                <button className="btnSubtractDropDown" onClick={() => this.subtractVariable(nextVariableId)}>X</button>
                <button className="btnSortAsc" onClick={() => this.sortHospitals(nextVariableId, 'asc')}>{this.props.t('tableView.sortAsc')}</button>
                <button className="btnSortDesc" onClick={() => this.sortHospitals(nextVariableId, 'desc')}>{this.props.t('tableView.sortDesc')}</button>
                <div className="yearDropdown">
                    <DropdownMenu id={this.state.nextYearId}
                            listItems={[]}
                            selectItem={this.selectYear}
                        />
                </div>
            </div>
        );

        // splits the next id ('var-x') into 'var' and 'x' and increments 'x' for vars and years
        let id_parts = this.state.nextVariableId.split("-");
        let nextVariableIdInc = id_parts[0] + "-" + (Number(id_parts[1]) + 1);

        id_parts = this.state.nextYearId.split("-");
        let nextYearIdInc = id_parts[0] + "-" + (Number(id_parts[1]) + 1);

        newVariables = [...this.state.variableDropdowns, newDrp];
        newSelectedVariables = [...this.state.selectedVariables, {}];
        newSelectedYears = [...this.state.selectedYears, {}];

        this.setState({
            nextVariableId: nextVariableIdInc,
            nextYearId: nextYearIdInc,
            selectedYears: newSelectedYears,
            variableDropdowns : newVariables,
            selectedVariables : newSelectedVariables
        });
        this.selectionChanged();
    }

    /**
     * selectionChanged - called when the selected variables or hospitals change.
     *  This will notify the ResultTable to wipe itself (via props) and wait
     *  for regeneration.
     */
    selectionChanged = () => {
        this.setState({
            selectionChanged: true
        });
        let yearDropdowns = document.getElementsByClassName('yearDropdown');
        for(let d of yearDropdowns) {
            d.classList.remove('showYearDropdown');
        }
    }

    /**
     * selectYear - called when something is selected in a yearDropdown. updates
     *  the state and retriggers table generation.
     */
    selectYear = (item, senderId) => {
		// findIndex does the same as indexOf for arrays, but with a function as input
		let index = this.state.variableDropdowns
			.findIndex((item) => {return item.props.children[4].props.children.props.id === senderId});
	
        let selectedYear;
        if (this.state.selectedVariables[index].is_time_series) {
            selectedYear = Number(item.name);
        } else {
            selectedYear = item.name;
        }
        let updatedYears = update(this.state.selectedYears, {[index]: {$set: selectedYear}});
        let updatedDropdowns = update(this.state.variableDropdowns, { [index]: {props: {children: {4: {props: {children: {props: {selectedItem: {$set: item}}}}}}}}});
        this.setState({
            selectedYears: updatedYears,
            variableDropdowns: updatedDropdowns
        }, () => {
            this.props.retriggerTableGeneration();
        });
    }

    /**
     * subtractVariable - Gets called when the remove button is clicked.
     *  Removes the according dropdown from state.
     *
     * @param {String} senderId Id of the dropdown that should be removed
     */
    subtractVariable = (senderId) => {
		// findIndex does the same as indexOf for arrays, but with a function as input
		let index = this.state.variableDropdowns
			.findIndex((item) => {return item.props.children[0].props.id === senderId});

		let newSelectedVariables = [...this.state.selectedVariables]; //create new copies of the arrays
		let newVariableDropdowns = [...this.state.variableDropdowns];
		
		newSelectedVariables.splice(index,1);
		newVariableDropdowns.splice(index,1);

        this.setState({
			selectedVariables: newSelectedVariables,
			variableDropdowns: newVariableDropdowns
		});
        this.selectionChanged();
    }

    /**
     * canTableBeSorted - checks if in each dropdown something is selected,
     *  and if the data has been fetched for these selected things.
     *
     * @return {bool} true, if everything is selected and the data is loaded,
     *  false otherwise
     */
    canTableBeSorted = (shouldCheckForLoadedData) => {
        let shouldGenerate = true;

        // check if in each hospital dropdown something was selected
        for (let hosp of this.state.selectedHospitals) {
            if (!hosp || (Object.keys(hosp).length === 0 && hosp.constructor === Object)) {
                shouldGenerate = false;
                break;
            }
        }
        // check the same for variables
        if (shouldGenerate) {
            for (let variable of this.state.selectedVariables) {
                if (!variable || (Object.keys(variable).length === 0 && variable.constructor === Object)) {
                    shouldGenerate = false;
                    break;
                }
                if (shouldCheckForLoadedData) {
                    // also check if for the selected variables the data was fetched
                    if (typeof(this.props.hospitals[0].attributes[variable.name]) === 'undefined') {
                        shouldGenerate = false;
                        break;
                    }
                }
            }
        }
        if (!shouldGenerate) {
            window.alert(this.props.t('tableView.missingData'));
        }

        return shouldGenerate;
    }

    /**
     * sortHospitals - Sorts selectedHospitals and hospitalDropdowns according
     *  to their value on the variable with senderId.
     *
     * @param {String} senderId the id of the variable according to which the
     *  hospitals should be sorted
     * @param {String} order either 'asc' for sorting in ascending order or 'desc'
     *  for sorting in descending order
     */
    sortHospitals = (senderId, order) => {
        // first get the whole variable object using the senderId
		
		// findIndex does the same as indexOf for arrays, but with a function as input
		let senderIndex = this.state.variableDropdowns
			.findIndex((item) => {return item.props.children[0].props.id === senderId});
		
        let variable = this.state.selectedVariables[senderIndex];
		const year = this.state.selectedYears[senderIndex];

        // then create an array containing arrays of length 2 that contain the
        // index of the selectedHospital and its value on the variable
        let selectedHospitals = this.state.selectedHospitals;
        let referenceArr = [];

        if (this.canTableBeSorted(true)) {
            for (let i = 0; i < selectedHospitals.length; i++) {
				
				// find the according hospital object from the hospitals array
				let currentHosp = this.props.hospitals.find((hosp) => {return hosp.name === selectedHospitals[i].name;});
				
                // const latestYear = Object.keys(currentHosp.attributes[variable.name])
                //     .sort()[Object.keys(currentHosp.attributes[variable.name]).length -1];
                
                const attributes = currentHosp.attributes[variable.name];
                let value = '';
                if (typeof attributes[year] !== 'undefined') {
                    value = attributes[year];
                }
                referenceArr.push([i, value]);
            }
			
			// use the d3 sorting functions to sort referenceArr
			if(order === "asc")
				referenceArr.sort(function(a, b){ return d3.ascending(a[1], b[1]);});
			else
				referenceArr.sort(function(a, b){ return d3.descending(a[1], b[1]);});

            // according to the indices in the referenceArr, fill new sorted arrays
            // for dropdowns and selected hospitals
            let newHospitalDropdowns = [];
            let newSelectedHospitals = [];

            for (let i = 0; i < referenceArr.length; i++) {
                let index = referenceArr[i][0];
                newSelectedHospitals.push(selectedHospitals[index]);
                newHospitalDropdowns.push(this.state.hospitalDropdowns[index]);
            }

            // then set the state
            this.setState({
                hospitalDropdowns : newHospitalDropdowns,
                selectedHospitals : newSelectedHospitals
            });

            this.props.retriggerTableGeneration();
        }
    }

    /**
     * selectVariable - Called when a variable is selected on a dropdown menu.
     *  It uses the id of the dropdown that called this function to identify it's
     *  index in the dropdowns array and update its displayed text. The index is
     *  as well used to identify the according object in the array of selected
     *  items and update it. Immutabilit-helper is used for that.
     *
     * @param {Object} item the selected item
     * @param {String} senderId Id of the dropdown that selected something
     */
	selectVariable = (item, senderId) => {
		// findIndex does the same as indexOf for arrays, but with a function as input
		let index = this.state.variableDropdowns
			.findIndex((item) => {return item.props.children[0].props.id === senderId});

		this.setState({
			selectedVariables: update(this.state.selectedVariables, {[index]: {$set: item}}),
			variableDropdowns: update(this.state.variableDropdowns, {[index]: {props: {children: {0: {props: {selectedItem: {$set: item}}}}}}})
        });
        this.selectionChanged();
	}

    /**
     * submitTableData - Called when the ResultTable finished generating.
     * Adds row and column names to the array for CSV export.
     *
     * @param {Object} data the generated 2D array
     */
    submitTableData = (data) => {
        const {selectedVariables, selectedHospitals, selectedYears} = this.state;

        let namedData = [];

        let headers = [];
        headers.push("Variable");
        for (let v of selectedVariables) {
            headers.push(v.text);
        }
        namedData.push(headers);

        let years = [];
        years.push("Year");
        for (let y of selectedYears) {
            years.push(y);
        }
        namedData.push(years);

        for (let i = 0; i < data.length; i++) {
            let row = [selectedHospitals[i].name].concat(data[i]);
            namedData.push(row);
        }

        this.props.setCSVData(namedData);

        this.setState({
            csvData : namedData
        });
    }

    /**
     * dataFetched - Called when the API-Request is completed. Collects all the
     *  years for that data exist for all selected hospitals and updates the
     *  according yearDropdowns
     */
    dataFetched = () => {
        if (true) {
            let updatedDropdowns = this.state.variableDropdowns;
            let updatedYears = this.state.selectedYears;
            for (let i = 0; i < this.state.variableDropdowns.length; i++) {
                // let dropdown = this.state.variableDropdowns[i];
                let selectedVariable = this.state.selectedVariables[i];
                let years = new Set();
                for (let selectedHospital of this.state.selectedHospitals) {
                    let hospital = this.props.hospitals.find((hosp) => {return hosp.name === selectedHospital.name;});
                    if (selectedVariable.is_time_series) {
                        for (let year of Object.keys(hospital.attributes[selectedVariable.name])){
                            years.add(year);
                        }
                    } else {
                        years.add(this.props.t('tableView.noTimeData'))
                    }
                }
                years = Array.from(years);
                const selectedYear = years.sort()[years.length - 1];
                const selectedItem = { name: selectedYear };
                let yearsForDropdown = [];
                for (let year of years) {
                    yearsForDropdown.push({ name: year});
                }
                yearsForDropdown.reverse();
                updatedYears = update(updatedYears, {[i]: {$set: selectedYear}});
                updatedDropdowns = update(updatedDropdowns, {[i]: {props: {children: {4: {props: {children: {props: {listItems: {$set: yearsForDropdown}}}}}}}}});
                updatedDropdowns = update(updatedDropdowns, {[i]: {props: {children: {4: {props: {children: {props: {selectedItem: {$set: selectedItem}}}}}}}}});
            }
            this.setState({
                variableDropdowns: updatedDropdowns,
                selectedYears: updatedYears
            }, () => {
                this.props.retriggerTableGeneration();
                let yearDropdowns = document.getElementsByClassName('yearDropdown');
                for (let d of yearDropdowns) {
                    d.classList.add('showYearDropdown');
                }
            });
        }
    }

    /**
     * resultTableAcknowledgedChange - Used by ResultTable to tell the
     *  InteractiveTable that it wiped the table when the user changed the
     *  selection of vars or hosps
     */
    resultTableAcknowledgedChange = () => {
        this.setState({
            selectionChanged: false
        });
    }

    /**
     * render - renders the component to the screen
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        const { t } = this.props;
        return (
            <div className="interactiveTable">
                <VariableSelector
                    className="variableSelector"
                    variables={this.props.variables}
                    variableDropdowns={this.state.variableDropdowns}
					addVariable={this.addVariable}
                />
                <HospitalSelector
                    className="hospitalSelector"
                    hospitals={this.props.hospitals}
                    hospitalDropdowns={this.state.hospitalDropdowns}
                    selectedHospitals={this.state.selectedHospitals}
                    addHospital={this.addHospital}
                />
                <ResultTable
                    className="resultTable"
                    selectedHospitals={this.state.selectedHospitals}
                    selectedVariables={this.state.selectedVariables}
                    selectedYears={this.state.selectedYears}
                    hospitalData={this.props.hospitals}
                    dataLoaded={this.props.tableDataLoaded}
                    dataGenerated={this.props.tableDataGenerated}
                    submitTableData={this.submitTableData}
                    selectionChanged={this.state.selectionChanged}
                    changeAcknowledged={this.resultTableAcknowledgedChange}
                />
                <button
                    className="btnGenerateTable"
                    onClick={() => {
                        if(this.canTableBeSorted(false)) {
                            this.props.requestData(this.state.selectedVariables, this.dataFetched);
                        }
                    }}>{t('tableView.btnCreateTable')}
                </button>
                <button
                    className="btnAddAllHospitals"
                    onClick={() => this.addAllHospitals()}>{t('tableView.btnAddAllHospitals')}
                </button>
			</div>
        );
    }
}

/**
 * PropTypes:
 *
 * variables: list of variables one can choose from
 * hospitals: list of hospitals one can choose from
 * requestData: function that will be called to download the requested data
 * hasLoaded: bool that will be true if the data is loaded
 * retriggerTableGeneration: will cause resultTable to regenerate its table
 *  without resending a request
 * tableDataGenerated: will notify parent that ResultTable has finished
 *  generating the table (called from ResultTable)
 * tableDataLoaded: boolean that is true when the parent finished the request
 *  and false when not (will be set to false again by ResultTable after it
 *  finished table generation)
 */
InteractiveTable.propTypes = {
    variables: PropTypes.array.isRequired,
    hospitals: PropTypes.array.isRequired,
    requestData: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
    retriggerTableGeneration: PropTypes.func.isRequired,
    tableDataGenerated: PropTypes.func.isRequired,
    tableDataLoaded: PropTypes.bool.isRequired
}

const LocalizedInteractiveTable = withTranslation()(InteractiveTable);
export default LocalizedInteractiveTable;
