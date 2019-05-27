import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import { withTranslation } from 'react-i18next';
import './FilterEditor.css'


/*
* A component to filter different Variables and Filters, defined through
* Dropdowns or CheckboxLists
*/

class FilterEditor extends Component {
	state = {
        selectedValues : [],
		titles : [],
	};

    componentDidUpdate(prevProps) {
        if (this.props.selectedYear !== prevProps.selectedYear && prevProps.selectedYear !== "" && Object.keys(this.props.selectedEnum).length > 0) {
            console.log("filterUpdate because of year");
            this.filter(this.state.selectedValues);
        }
    }

	componentWillUnmount() {
		// this doesn't work because it triggers filterhospitals from setHospitalsByEnums
		this.props.resetEnum();
		this.props.filter([]);
	}

	/**
	 * Called when a variable is selected in a dropdown
     * Gets the titles of the items, that have been selected in the dropdowns
     */
    dropdownSelectItem = (item) => {
		let titles = [];
		for (let i = 0; i < item.values.length; i++)
			titles.push(item.values[i] + ": " + item.values_text[i]);

		console.log("============================");
		console.log("CHOOSING FILTER VAR");
		this.props.setEnum(item).then(() => {
            this.setState({
                selectedValues : [],
                titles : titles,
            });
        });

	}

    /**
     *Called when a variable is selected in a Checkboxlist
     * @param  {Filter Object} item the selected filter object to apply to Hospitals
     *
     */
    checkboxSelectItem = (item) => {

		if (Object.keys(this.props.selectedEnum).length > 0 && this.props.hasLoaded) {
			// removes item if in selectedValues
			let values = this.state.selectedValues.filter((value) => {
				return (value !== item)
			});

			// adds item if not in selectedValues
			if (values.length === this.state.selectedValues.length) {
				values.push(item);
			}

			console.log("============================");
			console.log("CHOOSING FILTER CB");

			this.setState({
				selectedValues : values
			});

			this.filter(values);
		}

    }

    /**
     * Called when different values have been selected in the filter
     * @param  {Variable Object} selectedValues the selected filter object to apply to Hospitals
     */
	filter = (selectedValues) => {
        console.log("filtering by enum");
		const {selectedYear, hospitals} = this.props;
        const {name} = this.props.selectedEnum;

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
        const { t, hasLoaded } = this.props;
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
					(Object.keys(this.props.selectedEnum).length > 0)
					?
					<div className="filterCheckbox">
						<CheckboxList
                            id="filterCheckboxList"
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
