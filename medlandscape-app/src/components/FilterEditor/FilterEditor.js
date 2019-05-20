import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import { withTranslation } from 'react-i18next';
import './FilterEditor.css'

class FilterEditor extends Component {
	state = {
        selectedValues : [],
		titles : [],
	};

	// filters again when a new selectedVariable has been selected, with the same selected Enum as before the change.
	componentDidUpdate(prevProps) {
		if (this.props.hospitals !== prevProps.hospitals && this.props.selectedEnum === prevProps.selectedEnum && this.props.selectedEnum !== undefined) {
			this.filter(this.state.selectedValues);
		}
	}

	/**
    *
    */
    dropdownSelectItem = (item) => {
		let titles = [];
		for (let i = 0; i < item.values.length; i++)
		titles.push(item.values[i] + ": " + item.values_text[i]);

		this.props.setEnum(item);

		this.setState({
			selectedValues : [],
			titles : titles,
		});
	}

    /**
     *
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    checkboxSelectItem = (item) => {

		if (this.props.selectedEnum !== undefined) {
			// removes item if in selectedValues
			let values = this.state.selectedValues.filter((value) => {
				return (value !== item)
			});

			// adds item if not in selectedValues
			if (values.length === this.state.selectedValues.length) {
				values.push(item);
			}

			this.setState({
				selectedValues : values
			});

			this.filter(values);
		}

    }

    /**
     * [filter description]
     * @param  {[type]} selectedValues [description]
     * @return {[type]}                [description]
     */
	filter = (selectedValues) => {
		const {selectedYear, hospitals} = this.props;
        const {name} = this.props.selectedEnum;

		console.log("name of selected Enum: " + name);
		console.log(hospitals);

		let filteredHospitals =  [];

		// type of filtering (inclusive:true = OR)
		let inclusive = (name === "KT" || name === "LA" || name === "RForm" || name === "Typ");

		if (selectedValues.length > 0) {
			filteredHospitals = hospitals.filter((hospital) => {
				// Enum variables to be filtered with "OR"
				if (inclusive) {
					let counter = 0;
					if (selectedYear in hospital.attributes[name]) {
						const values = hospital.attributes[name][selectedYear];
						for (let i = 0; i < selectedValues.length; i++) {
							if (values.includes(selectedValues[i])) {
								counter++;
							}
						}
					}
					if (counter === 0) {
						return false;
					}
				} else { // Enum variables to be filtered with "AND"
					if (selectedYear in hospital.attributes[name]) {
						const values = hospital.attributes[name][selectedYear];
						for (let i = 0; i < selectedValues.length; i++) {
							if (!values.includes(selectedValues[i])) {
								return false;
							}
						}
					} else {
						return false;
					}
				}
				return true;
			});
			if (filteredHospitals.length === 0) {
				// no hits
				filteredHospitals[0] = 0;
			}
		} else {
			// if nothing is selected, return all of the hospitals
			filteredHospitals = hospitals;
		}

		this.props.filter(filteredHospitals);
	}

    render () {
        const { t } = this.props;
        return (
			<div className="filter-editor">
				<DropdownMenu
					id="filterDropDown"
					listItems={this.props.variables}
					selectItem={this.dropdownSelectItem}
					selectedItem={this.props.selectedEnum}
					defaultText={t('dropDowns.filterFallback')}
				/>
                {
					(this.props.selectedEnum !== undefined)
					?
					<div className="filterCheckbox">
						<CheckboxList
							items={this.props.selectedEnum.values}
							checkboxSelectItem={this.checkboxSelectItem}
							titles={this.state.titles}
						/>
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
