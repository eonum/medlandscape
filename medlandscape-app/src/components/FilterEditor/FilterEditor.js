import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';

/**
 * Example component to show how to work with react-i18next localization
 */
class FilterEditor extends Component {
	state = {
		variables: [],
        selectedVariable: undefined,
        selectedValues: [],
	};

	componentDidUpdate() {
		if(this.props.hasLoaded && this.state.variables.length == 0){

			let enumVariables = this.findEnumVariables()
			this.setState({variables: enumVariables});
		}
	}

	findEnumVariables = () => {
		let i;
		let enumVariables = [];

		for(i = 0; i < this.props.variables.length; i++){
			if(this.props.variables[i].variable_type == "enum") {
				enumVariables.push(this.props.variables[i]);
			}
		}
		return enumVariables;
	}

	/**
    *
    */
    dropdownSelectItem = (item) => {
        this.setState({
            selectedVariable : item,
            selectedValues : [],
        });
    }

    checkboxSelectItem = (item) => {
        let values = this.state.selectedValues;
        let index = values.indexOf(item);
        if (index !== -1)
            values.splice(index, 1);
        else values.push(item);
        this.setState({
            selectedValues : values,
        });
		this.filter();
        console.log(this.state.selectedValues);
    }

	filter = () => {
		const array = [];
		array.push(this.props.hospitals[0]);
		if (this.props.hasLoaded){
			this.props.updateHospitals(array);
        }
	}

    render () {
        return (
			<div className="control-panel">
				<DropdownMenu id="filterDropDown" listItems={this.state.variables} selectItem={this.dropdownSelectItem} selectedItem={this.state.selectedVariable} />
                {(this.state.selectedVariable !== undefined) ? <CheckboxList objects={this.state.selectedVariable.values} checkboxSelectItem={this.checkboxSelectItem} /> : null}
			</div>
        );
    }
}

export default FilterEditor;
