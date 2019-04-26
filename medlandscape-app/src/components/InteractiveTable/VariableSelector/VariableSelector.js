import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VariableSelector.css';


class VariableSelector extends Component {

    componentDidMount() {

    }

    render() {

        return (
            <div className="VariableSelector">
                {this.props.variableDropdowns}
                <button className="addVariableButton" onClick={() => this.props.addVariable()}>+</button>
            </div>
        );
    }
}

VariableSelector.propTypes = {
    variables: PropTypes.array.isRequired,
	variableDropdowns: PropTypes.array.isRequired,
	selectedVariables: PropTypes.array.isRequired,
    addVariable: PropTypes.func.isRequired,
}

export default VariableSelector;
