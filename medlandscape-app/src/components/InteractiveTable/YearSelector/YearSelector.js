import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './YearSelector.css';

/**
 * Represents the part of the table which lets the user choose the desired
 *  hospitals to display.
 */
class YearSelector extends Component {

    /**
     * render - renders the component to the screen (all dropdown menus and the
     *  '+' button)
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        return (
            <div className="yearSelector">
                {this.props.yearDropdowns}
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
YearSelector.propTypes = {
    yearDropdowns: PropTypes.array.isRequired,
}

export default YearSelector;
