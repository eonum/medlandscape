import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import VariableSelector from './VariableSelector/VariableSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';
import update from 'immutability-helper';


class InteractiveTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
			nextVariableId : 'var-' + 0,
			variableDropdowns : [],
            selectedVariables : [],

            nextHospitalId : 'hos-' + 0,
            hospitalDropdowns : [],
            selectedHospitals : []

            // selectedYear : ""
        }
    }

    addHospital = () => {
        let newDropdowns = [];
        let newSelectedHospitals = [];

        let newSelectedHospital = {};
        let newDropdown = (
            <div id='hospitalDropdown' key={this.state.nextHospitalId}>
                <DropdownMenu id={this.state.nextHospitalId}
                    listItems={this.props.hospitals}
                    selectItem={this.selectHospital}
                    selectedItem={newSelectedHospital} />
            </div>
        );

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

    selectHospital = (item, senderId) => {

        let index;

        for (let hD of this.state.hospitalDropdowns) {
            if (hD.props.children.props.id === senderId) {
                index = this.state.hospitalDropdowns.indexOf(hD);
            }
        }

        this.setState({
            // selectedHospitals : newList
            selectedHospitals: update(this.state.selectedHospitals, {[index]: {$set: item}}),
            hospitalDropdowns: update(this.state.hospitalDropdowns, {[index]: {props: {children: {props: {selectedItem: {$set: item}}}}}})
        });
    }

	addVariable = () => {
        let newVariables = [];
        let newSelectedVariables = [];

        let newSelectedVariable = {};
        let newDrp = (
            <div id='variableDropdown' key={this.state.nextVariableId}>
                <DropdownMenu id={this.state.nextVariableId}
                    listItems={this.props.variables}
                    selectItem={this.selectVariable}
                    selectedItem={newSelectedVariable} />
            </div>
        );

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

	selectVariable = (item, senderId) => {

		let index;

		for (let vD of this.state.variableDropdowns) {
			if (vD.props.children.props.id === senderId) {
				index = this.state.variableDropdowns.indexOf(vD);
			}
		}

		this.setState({

			selectedVariables: update(this.state.selectedVariables, {[index]: {$set: item}}),
			variableDropdowns: update(this.state.variableDropdowns, {[index]: {props: {children: {props: {selectedItem: {$set: item}}}}}})
		});
	}

    render() {
        return (
            <div className="interactiveTable">
                <div className="empty"></div>
                <VariableSelector className="variableSelector"
                    variables={this.props.variables}
                    variableDropdowns={this.state.variableDropdowns}
                    selectedVariables={this.state.selectedVariables}
					addVariable={this.addVariable} />
                <HospitalSelector className="hospitalSelector"
                    hospitals={this.props.hospitals}
                    hospitalDropdowns={this.state.hospitalDropdowns}
                    selectedHospitals={this.state.selectedHospitals}
                    addHospital={this.addHospital} />
			</div>
        );
    }
}

InteractiveTable.propTypes = {
    variables: PropTypes.array.isRequired,
    hospitals: PropTypes.array.isRequired,
}

export default InteractiveTable;
