import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HospitalSelector.css';

/**
 * Represents the part of the table which lets the user choose the desired
 *  hospitals to display.
 */
class HospitalSelector extends Component {

    /**
     * render - renders the component to the screen (all dropdown menus and the
     *  '+' button)
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        return (
            <div className="hospitalSelector">
                {this.props.hospitalDropdowns}
                <button className="addHospitalButton addButton" onClick={() => this.props.addHospital()}>+</button>
            </div>
        );
    }
}

/**
* PropTypes
*
* hospitals: array containing all hospitals one can choose from
* hospitalDropdowns: array containing all dropdowns to render
* addHospital: function to add a dropdown
*/
HospitalSelector.propTypes = {
    hospitals: PropTypes.array.isRequired,
    hospitalDropdowns: PropTypes.array.isRequired,
    addHospital: PropTypes.func.isRequired,
}

export default HospitalSelector;
