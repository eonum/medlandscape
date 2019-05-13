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
        selectedEnum : undefined,
        selectedValues : [],
		mappingObject : {},
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
        })

		this.filter(values);
    }

	filter = (selectedValues) => {
		const {selectedYear, hospitals} = this.props;
        const {name} = this.state.selectedEnum;

		let filteredHospitals = hospitals.filter((item) => {
            // or
            if (name === "KT" || name === "LA" || name === "RForm" || name === "Typ") {
                let counter = 0;
                for (let i = 0; i < selectedValues.length; i++) {
                    if (item.attributes[name][selectedYear]) {
                        const values = item.attributes[name][selectedYear];
                        if (values.includes(selectedValues[i])) {
                            counter++;
                        }
                    }
                }
                if (counter === 0) {
                    return false;
                }
            } else { // and
                for (let i = 0; i < selectedValues.length; i++) {
                    if (item.attributes[name][selectedYear]) {
                        const values = item.attributes[name][selectedYear];
                        if (!values.includes(selectedValues[i])) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
			return true;
		});

		this.props.updateHospitals(filteredHospitals);
	}

    render () {
        const { t } = this.props;
        return (
			<div className="filter-editor">
				<DropdownMenu id="filterDropDown" listItems={this.props.variables} selectItem={this.dropdownSelectItem} selectedItem={this.state.selectedEnum} defaultText={t('dropDowns.filterFallback')}/>
                {
					(this.state.selectedEnum !== undefined)
					?
					<div className="filterCheckbox">
						<p>{t('mapView.checkbox')}</p>
						<CheckboxList items={this.state.selectedEnum.values} checkboxSelectItem={this.checkboxSelectItem} mappingObject={this.state.mappingObject} />
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
