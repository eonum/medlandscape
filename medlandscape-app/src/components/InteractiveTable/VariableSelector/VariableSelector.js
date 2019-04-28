import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VariableSelector.css';

/**
 * Represents the part of the table which lets the user choose the desired
 *  variable to display.
 */
class VariableSelector extends Component {


    /**
     * render - renders the component to the screen (all dropdown menus and the
     *  '+' button)
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        return (
            <div className="variableSelector">
                {this.props.variableDropdowns}
                <button className="addVariableButton" onClick={() => this.props.addVariable()}>+</button>
            </div>
        );
    }
}

/**
* PropTypes
*
* variables: array containing all variables one can choose from
* variableDropdowns: array containing all dropdowns to render
* addVariable: function to add a dropdown
*/
VariableSelector.propTypes = {
    variables: PropTypes.array.isRequired,
	variableDropdowns: PropTypes.array.isRequired,
    addVariable: PropTypes.func.isRequired,
}

export default VariableSelector;
