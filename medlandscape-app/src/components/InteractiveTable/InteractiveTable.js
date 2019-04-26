import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InteractiveTable.css';
import HospitalSelector from './HospitalSelector/HospitalSelector.js';
import DropdownMenu from './../DropdownMenu/DropdownMenu.js';

import update from 'immutability-helper';


class InteractiveTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedVariables : [],

            nextDropdownId : 0,
            hospitalDropdowns : [],
            selectedHospitals : []

            // selectedYear : ""
        }
    }

    addHospital = () => {
        let newDropdowns = [];
        let newSelectedHospitals = [];

        let newSelectedHospital = {};
        let newDropdown = <DropdownMenu id={this.state.nextDropdownId} listItems={this.props.hospitals} selectItem={this.selectHospital}
                            selectedItem={newSelectedHospital} />

        let nextDropdownIdInc = this.state.nextDropdownId + 1;
        newDropdowns = [...this.state.hospitalDropdowns, newDropdown];
        newSelectedHospitals = [...this.state.selectedHospitals, newSelectedHospital];

        this.setState({
            nextDropdownId: nextDropdownIdInc,
            hospitalDropdowns : newDropdowns,
            selectedHospitals : newSelectedHospitals
        });
    }

    selectHospital = (item, senderId) => {

        let index;

        for (let hD of this.state.hospitalDropdowns) {
            if (hD.props.id === senderId) {
                index = this.state.hospitalDropdowns.indexOf(hD);
            }
        }

        this.setState({
            // selectedHospitals : newList
            selectedHospitals: update(this.state.selectedHospitals, {[index]: {$set: item}}),
            hospitalDropdowns: update(this.state.hospitalDropdowns, {[index]: {props: {selectedItem: {$set: item}}}})
        });
    }

    render() {
        return (
            <div className="InteractiveTable">
                <HospitalSelector hospitals={this.props.hospitals} hospitalDropdowns={this.state.hospitalDropdowns} selectedHospitals={this.state.selectedHospitals}
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
