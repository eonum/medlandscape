import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';

/**
 * Example component to show how to work with react-i18next localization
 */
class FilterEditor extends Component {
	state = {
		variables: []
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
        console.log(item);
    }
	
	
	
	filter = () => {
		if (this.props.hasLoaded){
		var i;
		var array = [];
		for(i = 0; i < 10; i++){
			array.push(this.props.hospitals[i]);
		}
		this.props.updateHospitals(array);
		}
	}

    render () {
        return (
			<div className="control-panel">
				<button onClick={this.filter}>
					First 10 Hospitals
				</button>
				<DropdownMenu id="filterDropDown" listItems={this.state.variables} selectItem={this.dropdownSelectItem} selectedItem={this.state.variables[0]} />
			</div>
        );
    }
}

export default FilterEditor;
