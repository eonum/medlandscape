import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HospitalSelector.css';


class HospitalSelector extends Component {

    componentDidMount() {

    }

    render() {

        return (
            <div className="HospitalSelector">
                {this.props.hospitalDropdowns}
                <button className="addHospitalButton" onClick={() => this.props.addHospital()}>+</button>
            </div>
        );
    }
}

HospitalSelector.propTypes = {
    hospitals: PropTypes.array.isRequired,
    hospitalDropdowns: PropTypes.array.isRequired,
    selectedHospitals: PropTypes.array.isRequired,
    addHospital: PropTypes.func.isRequired,
}

export default HospitalSelector;
