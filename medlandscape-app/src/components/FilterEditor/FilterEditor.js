import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import { withTranslation } from 'react-i18next';
import './FilterEditor.css'

/**
 * Example component to show how to work with react-i18next localization
 */
class FilterEditor extends Component {
	state = {
        selectedEnum: undefined,
        selectedValues: [],
		mappingObject: {},
	};

	/**
    *
    */
    dropdownSelectItem = (item) => {
		let mapObj = {};
		for (let i = 0; i < item.values.length; i++)
			mapObj[item.values[i]] = item.values_text[i];

		this.props.fetchData(item).then(() => {
			this.setState({
				selectedEnum : item,
				selectedValues : [],
				mappingObject : mapObj,
			});
		})
	}

    checkboxSelectItem = (item) => {
        let values = this.state.selectedValues;
        let index = values.indexOf(item);
        if (index !== -1)
            values.splice(index, 1);
        else values.push(item);

        this.setState({
            selectedValues : values
        });

		this.filter();
    }

	filter = () => {
		const {selectedYear, hasLoaded, hospitals} = this.props;

		if (hasLoaded) {
			let filteredHospitals = hospitals.filter((item) => {
				for(let i = 0; i < this.state.selectedValues.length; i++){
					if (item.attributes[this.state.selectedEnum.name][selectedYear]) {
						const valueArray = item.attributes[this.state.selectedEnum.name][selectedYear].split(", ");
						if (valueArray.indexOf(this.state.selectedValues[i]) === -1) {
							return false;
						}
					} else {
						return false;
					}
				}
				return true;
			});

			this.props.updateHospitals(filteredHospitals);
        }
	}

    render () {
        return (
			<div className="filter-editor">
				<DropdownMenu id="filterDropDown" listItems={this.props.variables} selectItem={this.dropdownSelectItem} selectedItem={this.state.selectedEnum} defaultText="Filter Variabeln"/>
                {
					(this.state.selectedEnum !== undefined)
					?
					<div className="filterCheckbox">
						<p>{this.props.t('filter.checkbox')}</p>
						<CheckboxList objects={this.state.selectedEnum.values} checkboxSelectItem={this.checkboxSelectItem} mappingObject={this.state.mappingObject} />
					</div>
					: null
				}
			</div>
        );
    }
}
/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedFilterEditor = withTranslation()(FilterEditor);
export default LocalizedFilterEditor;
