import React, { Component } from 'react';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import './hospitalTypeFilter.css';

/*
*A component that helps with selecting and separating different types of hospitals
*/
class HospitalTypeFilter extends Component {

    state = {
        selectedValues : []
    }

    /**
     * componentDidUpdate - called after the component was updated
     *
     * @param  {Object} prevProps the previous props
     */
    componentDidUpdate(prevProps) {
        if (this.props.selectedYear !== prevProps.selectedYear && this.state.selectedValues.length > 0) {
            this.setAPIValues(this.state.selectedValues);
        }
        if (this.props.filter !== prevProps.filter) {
            this.setState({
                selectedValues : []
            }, () => {
                this.props.filter([]);
            })
        }
    }

    /**
     * componentWillUnmount - called before the component unmounts.
     *  used to reset the filter
     */
    componentWillUnmount() {
        this.props.filter([]);
    }

    /**
     * Adds the value of the selected hospital category to selectedValues.
     * @param {String} item The selected hospital category to be added.
     */
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
        }, () => {
            this.setAPIValues(values);
        });

    }

    /**
     * Helper method.
     * Converts the values into API specific hospital categories.
     * Calls filter after converting the values.
     * @param {Array} values the selected hospital categories.
     */
    setAPIValues = (values) => {
        // categories for different hospitals
        // University: K111
        // Allgemeinspital, Zentrumversorgung: K112
        // Allgemeinspital, Grundversorgung: K121, K122, K123
        // Psychiatrische Klinik: K211, K212
        // Rehabilitationsklinik: K221
        // Spezialklinik: K231, K232, K233, K234, K235

        let apiValues = [];

        for (let i = 0; i < values.length; i++) {
            switch (values[i]) {
                case (0):
                    apiValues.push("K111");
                    break;
                case (1):
                    apiValues.push("K112");
                    break;
                case (2):
                    apiValues.push("K121");
                    apiValues.push("K122");
                    apiValues.push("K123");
                    break;
                case (3):
                    apiValues.push("K211");
                    apiValues.push("K212");
                    break;
                case (4):
                    apiValues.push("K221");
                    break;
                case (5):
                    apiValues.push("K231");
                    apiValues.push("K232");
                    apiValues.push("K233");
                    apiValues.push("K234");
                    apiValues.push("K235");
                    break;
                default:
                    apiValues.push("K111");
            }
        }
        this.filter(apiValues);
    }


	/**
     * filter - filters through the selected values similar to our FIlterEditor
     *
     * @param {Array} selectedValues
     */
    filter = (selectedValues) => {
		const {hospitals, selectedYear} = this.props;
        const name = "Typ"

        let filteredHospitals = [];

        if (selectedValues.length > 0) {
            filteredHospitals = hospitals.filter((hospital) => {
                let counter = 0;
                let years = Object.keys(hospital.attributes[name]);
                if (selectedYear.length > 0) {
                    if (years.includes(selectedYear)) {
                        let values = hospital.attributes[name][selectedYear];
                        for (let i = 0; i < selectedValues.length; i++) {
                            if (values.includes(selectedValues[i])) {
                                counter++;
                            }
                        }
                    }
                } else {
                    let values = hospital.attributes[name][(years)[years.length - 1]]; // wtf hahaha, looks at "Typ" in last year because why would it change? (apparently it does -> ask Tim)
                    for (let i = 0; i < selectedValues.length; i++) {
                        if (values.includes(selectedValues[i])) {
                            counter++;
                        }
                    }
                }
                return (counter !== 0);
            });
            if (filteredHospitals.length === 0) {
                // no hits, did not match anything (example spezialausrüstung: litho)
                filteredHospitals[0] = 0;
            }
        } else {
            filteredHospitals = hospitals;
        }

        this.props.filter(filteredHospitals);
    }

    /**
     * render - renders the component
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        const {t, id} = this.props;
        let categorizedHospitalTypes = [0, 1, 2, 3, 4, 5];
        let translatedCategorizedHospitalTypes = [t('hospitalTypes.university'), t('hospitalTypes.generic-center'),
            t('hospitalTypes.generic-basic'), t('hospitalTypes.psychiatry') , t('hospitalTypes.rehabilitation'),
            t('hospitalTypes.special')];

        return (
            <div className="hospitalTypeFilter">
                <CheckboxList
                    id={id}
                    items={categorizedHospitalTypes}
                    checkboxSelectItem={this.checkboxSelectItem}
                    titles={translatedCategorizedHospitalTypes}
                />
            </div>
        )
    }
}

/**
 * PropTypes:
 *
 * hospitals: An array of hospital objects to filter by type.
 * filter: A function that is called when the list of recieved hospitals has been filtered by type.
 * selectedYear: The year in which to extract the type information from.
 * hasLoaded: A boolean that signifies that all data has been fetched by the API and is ready to be manipulated.
 */

HospitalTypeFilter.propTypes = {
	id: PropTypes.string.isRequired,
    hospitals: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
    selectedYear: PropTypes.string.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
}

const localizedHospitalTypeFilter = withTranslation()(HospitalTypeFilter);
export default localizedHospitalTypeFilter;
