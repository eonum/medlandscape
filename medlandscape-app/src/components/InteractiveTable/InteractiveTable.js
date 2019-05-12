import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import VariableSelector from './VariableSelector/VariableSelector.js';
import YearSelector from './YearSelector/YearSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import ResultTable from './ResultTable/ResultTable.js';
import update from 'immutability-helper';
import { withTranslation } from 'react-i18next';
import { CSVLink, CSVDownload } from "react-csv";



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

            nextHospitalId : 'hos-' + 0,
            hospitalDropdowns : [],
            selectedHospitals : [],

            nextYearId : 'yea-' + 0,
            yearDropdowns : [],
            selectedYears : [],

            dropdownsNeedUpdate : true,
			csvData : [],

            previousLanguage : props.i18n.language
            // selectedYear : ""
        }
    }

    /**
     * componentDidUpdate
     *
     * Fills the dropdown-lists that were present before the api request was
     *  complete with the correct data. Otherwise they would be empty lists.
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
     * Creates a new dropdown menu to select a hospital to display, with a new
     *  unique id. Then updates the state accordingly.
     */
    addHospital = (selectedHosp) => {
        let newDropdowns = [];
        let newSelectedHospitals = [];
        let newYearDropdowns = [];
        let newSelectedYears = [];

        let nextHospitalId = this.state.nextHospitalId + "";
        let nextYearId = this.state.nextYearId + "";

        let newSelectedHospital = {};
        if (selectedHosp) {
            newSelectedHospital = selectedHosp;
        }
        let newDropdown = (
            <div className='hospitalDropdown' key={this.state.nextHospitalId}>
                <DropdownMenu id={this.state.nextHospitalId}
                    listItems={this.props.hospitals}
                    selectItem={this.selectHospital}
                    selectedItem={newSelectedHospital}
                />
            <button className="btnSubtractHospital" onClick={() => this.subtractHospital(nextHospitalId)}>-</button>
            </div>
        );
        let newSelectedYear = {};
        let newYearDropdown = (
            <div className='yearDropdown' key={this.state.nextYearId}>
                <DropdownMenu id={this.state.nextYearId}
                    listItems={[]}
                    selectItem={this.selectYear}
                    selectedItem={newSelectedYear}
                />
            </div>
        );

        // splits the next id ('var-x') into 'var' and 'x' and increments 'x'
        let hosp_id_parts = this.state.nextHospitalId.split("-");
        let nextHospitalIdInc = hosp_id_parts[0] + "-" + (Number(hosp_id_parts[1]) + 1);

        let year_id_parts = this.state.nextYearId.split("-");
        let nextYearIdInc = year_id_parts[0] + "-" + (Number(year_id_parts[1]) + 1);

        newDropdowns = [...this.state.hospitalDropdowns, newDropdown];
        newSelectedHospitals = [...this.state.selectedHospitals, newSelectedHospital];
        newYearDropdowns = [...this.state.yearDropdowns, newYearDropdown];
        newSelectedYears = [...this.state.selectedYears, newSelectedYear];

        this.setState({
            nextHospitalId: nextHospitalIdInc,
            hospitalDropdowns : newDropdowns,
            selectedHospitals : newSelectedHospitals,
            nextYearId : nextYearIdInc,
            yearDropdowns : newYearDropdowns,
            selectedYears : newSelectedYears
        });
    }

    /**
     * Gets called when the remove button is clicked. Removes the according
     *  dropdown from state.
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
    }

    /**
     * Called when a hospital is selected on a dropdown menu. It uses the id of
     *  the dropdown that called this function to identify it's index in the
     *  dropdowns array and update its displayed text. The index is as well used
     *  to identify the according object in the array of selected items and
     *  update it. Immutabilit-helper is used for that.
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
    }

    /**
     * Creates a new dropdown menu to select a variable to display, with a new
     *  unique id. Then updates the state accordingly.
     */
	addVariable = () => {
        let newVariables = [];
        let newSelectedVariables = [];

        let nextVariableId = this.state.nextVariableId + "";

        let newSelectedVariable = {};
        let newDrp = (
            <div className="variableDropdown" key={this.state.nextVariableId}>
                <DropdownMenu id={this.state.nextVariableId}
                    listItems={this.props.variables}
                    selectItem={this.selectVariable}
                    selectedItem={newSelectedVariable}
                />
                <button className="btnSubtractVariable" onClick={() => this.subtractVariable(nextVariableId)}>-</button>
                <button className="btnSortAsc" onClick={() => this.sortHospitals(nextVariableId, 'asc')}>{this.props.t('tableView.sortAsc')}</button>
                <button className="btnSortDesc" onClick={() => this.sortHospitals(nextVariableId, 'desc')}>{this.props.t('tableView.sortDesc')}</button>
            </div>
        );

        // splits the next id ('var-x') into 'var' and 'x' and increments 'x'
        let id_parts = this.state.nextVariableId.split("-");
        let nextVariableIdInc = id_parts[0] + "-" + (Number(id_parts[1]) + 1);;
        newVariables = [...this.state.variableDropdowns, newDrp];
        newSelectedVariables = [...this.state.selectedVariables, newSelectedVariable];

        this.setState({
            nextVariableId: nextVariableIdInc,
            variableDropdowns : newVariables,
            selectedVariables : newSelectedVariables
        });
    }

    /**
     * Gets called when the remove button is clicked. Removes the according
     *  dropdown from state.
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
    }

    /**
     * Sorts selectedHospitals and hospitalDropdowns according to their value on
     *  the variable with senderId.
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

        let shouldGenerate = true;

        if (Object.keys(variable).length === 0 && variable.constructor === Object) {
            shouldGenerate = false;
            window.alert(this.props.t('tableView.selectSomethingAlert'));
        }
        for (let hosp of selectedHospitals) {
            let currentHosp;
            for (let hosp2 of this.props.hospitals) {
                if (hosp.name === hosp2.name) {
                    currentHosp = hosp2;
                    break;
                }
            }
            if (!currentHosp) {
                shouldGenerate = false;
                window.alert(this.props.t('tableView.selectSomethingAlert'));
            }
            if (shouldGenerate) {
                if (Object.keys(currentHosp).length === 0 && currentHosp.constructor === Object) {
                    shouldGenerate = false;
                    window.alert(this.props.t('tableView.selectSomethingAlert'));
                    break;
                }
                if (!currentHosp.attributes[variable.name]) {
                    shouldGenerate = false;
                    window.alert(this.props.t('tableView.generateBeforeSortAlert'));
                    break;
                }
            }
        }
        if (shouldGenerate) {
            for (let i = 0; i < selectedHospitals.length; i++) {
                let currentHosp;
                for (let hosp of this.props.hospitals) {
                    if (hosp.name === selectedHospitals[i].name) {
                        currentHosp = hosp;
                        break;
                    }
                }
                const latestYear = Object.keys(currentHosp.attributes[variable.name])
                    .sort()[Object.keys(currentHosp.attributes[variable.name]).length -1];
                let attributes = currentHosp.attributes[variable.name];
                referenceArr.push([i, attributes[latestYear]]);
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
     * Called when a variable is selected on a dropdown menu. It uses the id of
     *  the dropdown that called this function to identify it's index in the
     *  dropdowns array and update its displayed text. The index is as well used
     *  to identify the according object in the array of selected items and
     *  update it. Immutabilit-helper is used for that.
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
	}

    addAllHospitals = () => {
        for (let hosp of this.props.hospitals) {
            this.sleep(0.5).then(() => {
                this.addHospital(hosp);
            });
        }
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    submitTableData = (data) => {
        this.setState({
            csvData : data
        });
    }

	createCsvData = ()  => {
		this.csvLink.link.click();
	}

    dataFetched = () => {
        console.log('whoeeh');
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
                    hospitalData={this.props.hospitals}
                    dataLoaded={this.props.tableDataLoaded}
                    dataGenerated={this.props.tableDataGenerated}
                    submitTableData={this.submitTableData}
                />
				<CSVLink
					data={this.state.csvData}
					filename="medlandscapeCSV.csv"
					className="CSVButton"
					ref={(r) => this.csvLink = r}
					target="_blank"
				/>
                {/*<YearSelector
                    className='yearSelector'
                    yearDropdowns={this.state.yearDropdowns}
                />*/}

				<button className="btnCreateCSV"
				onClick={() => this.createCsvData()}>
				{t('tableView.btnCreateCSV')}
				</button>
                <button
                    className="btnGenerateTable"
                    onClick={() => this.props.requestData(this.state.selectedVariables, this.dataFetched)}>{t('tableView.btnCreateTable')}
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
