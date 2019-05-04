import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import VariableSelector from './VariableSelector/VariableSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import ResultTable from './ResultTable/ResultTable.js';
import update from 'immutability-helper';
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

            dropdownsNeedUpdate : true

            // selectedYear : ""
        }
    }

    /**
     * componentDidUpdate
     *
     * Fills the dropdown-lists that were present before the api request was
     *  complete with the correct data. Otherwise they would be empty lists.
     *
     * @return {type}  description
     */
    componentDidUpdate() {
        if (this.props.hasLoaded && this.state.dropdownsNeedUpdate) {
            let newHospitalDropdowns = this.state.hospitalDropdowns;
            for (let i = 0; i < this.state.hospitalDropdowns.length; i++) {
                newHospitalDropdowns = update(newHospitalDropdowns, {[i]: {props: {children: {0: {props: {listItems: {$set: this.props.hospitals}}}}}}});
            }
            let newVariableDropdowns = this.state.variableDropdowns;
            for (let i = 0; i < this.state.variableDropdowns.length; i++) {
                newVariableDropdowns = update(newVariableDropdowns, {[i]: {props: {children: {0: {props: {listItems: {$set: this.props.variables}}}}}}});
            }
            this.setState({
                hospitalDropdowns : newHospitalDropdowns,
                variableDropdowns : newVariableDropdowns,
                dropdownsNeedUpdate : false
            });
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
    addHospital = () => {
        let newDropdowns = [];
        let newSelectedHospitals = [];

        let nextHospitalId = this.state.nextHospitalId + "";

        let newSelectedHospital = {};
        let newDropdown = (
            <div className='hospitalDropdown' key={this.state.nextHospitalId}>
                <DropdownMenu id={this.state.nextHospitalId}
                    listItems={this.props.hospitals}
                    selectItem={this.selectHospital}
                    selectedItem={undefined}
                    defaultText={this.props.t('dropDowns.hospitalFallback')}
                />
            <button className="btnSubtractVariable" onClick={() => this.subtractHospital(nextHospitalId)}>-</button>
            </div>
        );

        // splits the next id ('var-x') into 'var' and 'x' and increments 'x'
        let id_parts = this.state.nextHospitalId.split("-");
        let nextHospitalIdInc = id_parts[0] + "-" + (Number(id_parts[1]) + 1);

        newDropdowns = [...this.state.hospitalDropdowns, newDropdown];
        newSelectedHospitals = [...this.state.selectedHospitals, newSelectedHospital];

        this.setState({
            nextHospitalId: nextHospitalIdInc,
            hospitalDropdowns : newDropdowns,
            selectedHospitals : newSelectedHospitals
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
                    selectedItem={undefined}
                />
            <button className="btnSubtractVariable" onClick={() => this.subtractVariable(nextVariableId)}>-</button>
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
			}
		}

		this.setState({
			selectedVariables: update(this.state.selectedVariables, {[index]: {$set: item}}),
			variableDropdowns: update(this.state.variableDropdowns, {[index]: {props: {children: {0: {props: {selectedItem: {$set: item}}}}}}})
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
                    hospitalData={this.props.hospitals}
                    dataLoaded={this.props.tableDataLoaded}
                    dataGenerated={this.props.tableDataGenerated}
                />
                <button
                    className="btnGenerateTable"
                    onClick={() => this.props.requestData(this.state.selectedVariables)}>{t('interactive_table.btn_create_table')}
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
 */
InteractiveTable.propTypes = {
    variables: PropTypes.array.isRequired,
    hospitals: PropTypes.array.isRequired,
    requestData: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
}

const LocalizedInteractiveTable = withTranslation()(InteractiveTable);
export default LocalizedInteractiveTable;
