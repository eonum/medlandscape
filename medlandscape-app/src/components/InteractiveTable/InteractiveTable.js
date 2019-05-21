import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import VariableSelector from './VariableSelector/VariableSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import ResultTable from './ResultTable/ResultTable.js';
import update from 'immutability-helper';
import { withTranslation } from 'react-i18next';
import { CSVLink } from "react-csv";

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
     * @param  {ojbect} props props handed over by parent component
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
        let hosp = this.createNewHospital(undefined, nextHospId);

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
            let data = this.createNewHospital(hosp, nextHospId);

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
     * @param {Object} selectedHosp the hospital that will be selected by default
     *
     * @return {Array} Array containing the selectedHospital variable at index 0
     *  and the new dropdown at index 1
     */
    createNewHospital = (selectedHosp, id) => {
        let newSelectedHospital = undefined;
        if (selectedHosp) {
            newSelectedHospital = selectedHosp;
        }
        let newDropdown = (
            <div className='hospitalDropdown' key={id}>
                <DropdownMenu id={id}
                    listItems={this.props.hospitals}
                    selectItem={this.selectHospital}
                    selectedItem={newSelectedHospital}
                    defaultText={this.props.t('dropDowns.hospitalFallback')}
                />
                <button className="btnSubtractHospital" onClick={() => this.subtractHospital(id)}>X</button>
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
        let index;

		for (let hD of this.state.hospitalDropdowns) {
			if (hD.props.children[0].props.id === senderId) {
				index = this.state.hospitalDropdowns.indexOf(hD);
                break;
			}
		}

        let updSelHos1 = this.state.selectedHospitals.slice(0, index);
        let updSelHos2 = this.state.selectedHospitals.slice(index + 1, this.state.selectedHospitals.length);
        let updSelHos = updSelHos1.concat(updSelHos2);

        let updHosDrp1 = this.state.hospitalDropdowns.slice(0, index);
        let updHosDrp2 = this.state.hospitalDropdowns.slice(index + 1, this.state.hospitalDropdowns.length);
        let updHosDrp = updHosDrp1.concat(updHosDrp2);

        this.setState({
			selectedHospitals: updSelHos,
			hospitalDropdowns: updHosDrp
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
        let index;

        for (let hD of this.state.hospitalDropdowns) {
            if (hD.props.children[0].props.id === senderId) {
                index = this.state.hospitalDropdowns.indexOf(hD);
                break;
            }
        }

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
            <div className="variableDropdown" key={this.state.nextVariableId}>
                <DropdownMenu id={this.state.nextVariableId}
                    listItems={this.props.variables}
                    selectItem={this.selectVariable}
                    defaultText={this.props.t('dropDowns.variablesFallback')}
                />
                <button className="btnSubtractVariable" onClick={() => this.subtractVariable(nextVariableId)}>X</button>
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
     * selectYear - description
     */
    selectYear = (item, senderId) => {
        let index;
        for (let yD of this.state.variableDropdowns) {
            if (yD.props.children[4].props.children.props.id === senderId) {
                index = this.state.variableDropdowns.indexOf(yD);
                break;
            }
        }
        let selectedYear;
        if (this.state.selectedVariables[index].is_time_series) {
            selectedYear = Number(item.name);
        } else {
            selectedYear = item.name;
        }
        console.log(selectedYear);
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
        let index;

		for (let vD of this.state.variableDropdowns) {
			if (vD.props.children[0].props.id === senderId) {
				index = this.state.variableDropdowns.indexOf(vD);
                break;
			}
		}

        let updSelVar1 = this.state.selectedVariables.slice(0, index);
        let updSelVar2 = this.state.selectedVariables.slice(index + 1, this.state.selectedVariables.length);
        let updSelVar = updSelVar1.concat(updSelVar2);

        let updVarDrp1 = this.state.variableDropdowns.slice(0, index);
        let updVarDrp2 = this.state.variableDropdowns.slice(index + 1, this.state.variableDropdowns.length);
        let updVarDrp = updVarDrp1.concat(updVarDrp2);

        this.setState({
			selectedVariables: updSelVar,
			variableDropdowns: updVarDrp
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
        let senderIndex;

		for (let vD of this.state.variableDropdowns) {
			if (vD.props.children[0].props.id === senderId) {
				senderIndex = this.state.variableDropdowns.indexOf(vD);
			}
		}

        let variable = this.state.selectedVariables[senderIndex];

        // then create an array containing arrays of length 2 that contain the
        // index of the selectedHospital and its value on the variable
        let selectedHospitals = this.state.selectedHospitals;
        let referenceArr = [];

        if (this.canTableBeSorted(true)) {
            for (let i = 0; i < selectedHospitals.length; i++) {
                let currentHosp;
                for (let hosp of this.props.hospitals) {
                    if (hosp.name === selectedHospitals[i].name) {
                        currentHosp = hosp;
                        break;
                    }
                }
                // const latestYear = Object.keys(currentHosp.attributes[variable.name])
                //     .sort()[Object.keys(currentHosp.attributes[variable.name]).length -1];
                const year = this.state.selectedYears[senderIndex];
                const attributes = currentHosp.attributes[variable.name];
                let value = '';
                if (typeof attributes[year] !== 'undefined') {
                    value = attributes[year];
                }
                referenceArr.push([i, value]);
            }

            // then sort this array according to the value on the variable
            const sortFunction = (
                function sortFunction(a, b) {
                    if (a[1] === b[1]) { return 0; }
                    else {
                        if (order === 'asc') {
                            return (a[1] < b[1]) ? -1 : 1;
                        }
                        else {
                            return (a[1] > b[1]) ? -1 : 1;
                        }
                    }
                }
            );

            referenceArr.sort(sortFunction);

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
		let index;

		for (let vD of this.state.variableDropdowns) {
			if (vD.props.children[0].props.id === senderId) {
				index = this.state.variableDropdowns.indexOf(vD);
                break;
			}
		}

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

        this.setState({
            csvData : namedData
        });
    }

    /**
     * dataFetched - Called when the API-Request is completed (description)
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
                    let hospital = {};
                    for (let hosp of this.props.hospitals) {
                        if (selectedHospital.name === hosp.name) {
                            hospital = hosp;
                        }
                    }
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
                    d.classList.toggle('showYearDropdown');
                }
            });
        }
    }

    /**
     * resultTableAcknowledgedChange - description
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
                <button className="btnCreateCSV"
                onClick={() => this.csvLink.link.click()}>
                {t('tableView.btnCreateCSV')}
                </button>
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
				<CSVLink
					data={this.state.csvData}
					filename="medlandscapeCSV.csv"
					className="CSVButton"
					ref={(r) => this.csvLink = r}
					target="_blank"
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
 */
InteractiveTable.propTypes = {
    variables: PropTypes.array.isRequired,
    hospitals: PropTypes.array.isRequired,
    requestData: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
    retriggerTableGeneration: PropTypes.func.isRequired,

}

const LocalizedInteractiveTable = withTranslation()(InteractiveTable);
export default LocalizedInteractiveTable;
