import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import PropTypes from 'prop-types';
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

    /**
     * componentDidUpdate - called just after the component updated
     *
     * @param  {Object} prevProps previous props
     */
    componentDidUpdate(prevProps) {
        if (this.props.selectedYear !== prevProps.selectedYear && prevProps.selectedYear !== "" && Object.keys(this.props.selectedEnum).length > 0) {
            this.filter(this.state.selectedValues);
        }
    }

	/**
	 * componentWillUnmount - called before the component unmounts
	 * 	resets stuff not needed anymore
	 */
	componentWillUnmount() {
		this.props.resetEnum();
		this.props.filter([]);
	}

	/**
	 * Called when a variable is selected in a dropdown
     * Gets the titles of the items, that have been selected in the dropdowns
	 *
	 * @param {Object} item the selected item
     */
    dropdownSelectItem = (item) => {
		let titles = [];
		for (let i = 0; i < item.values.length; i++)
			titles.push(item.values[i] + ": " + item.values_text[i]);

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

    /**
     * render - renders the method
     *
     * @return {JSX}  JSX of the component
     */
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
 * PropTypes:
 *
 * hospitals: An array of hospital objects to filter by enum.
 * filter: A function that is called when the list of recieved hospitals has been filtered by enum.
 * hasLoaded: A boolean that signifies that all data has been fetched by the API and is ready to be manipulated.
 * selectedYear: The year in which to extract the type information from.
 * selectedEnum: A javascript object representing the selected Enum variable to which to filter the hospitals by.
 * variables: An array of Enum variables to load into the DropdownMenu.
 * setEnum: A function that passes the selected enum to the parent component.
 * resetEnum: A function that resets the selected enum in the parent component upon unmounting.
 */

FilterEditor.propTypes = {
	hospitals: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
	hasLoaded: PropTypes.bool.isRequired,
    selectedYear: PropTypes.string.isRequired,
	selectedEnum: PropTypes.object.isRequired,
	variables: PropTypes.array.isRequired,
	setEnum: PropTypes.func.isRequired,
	resetEnum: PropTypes.func.isRequired,
}

/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedFilterEditor = withTranslation()(FilterEditor);
export default LocalizedFilterEditor;
