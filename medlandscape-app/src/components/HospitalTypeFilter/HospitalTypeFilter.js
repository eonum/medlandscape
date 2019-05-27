import React, { Component } from 'react';
import CheckboxList from '../CheckboxList/CheckboxList.js';
import './hospitalTypeFilter.css';
import { withTranslation } from "react-i18next";

/*
*A component that helps with selcting and separating different types of hospitals
*/

class HospitalTypeFilter extends Component {

    state = {
        selectedValues : []
    }

    componentWillUnmount() {
        console.log("unmounting filterByType");
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
        });

        this.setAPIValues(values);
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


	/*filters through the selected values similar to our FIlterEditor */
    filter = (selectedValues) => {
		const {hospitals} = this.props;
        const name = "Typ"

        let filteredHospitals = [];

        if (selectedValues.length > 0) {
            filteredHospitals = hospitals.filter((hospital) => {
                let counter = 0;
                let keys = Object.keys(hospital.attributes[name]);
                const values = hospital.attributes[name][(keys)[keys.length - 1]]; // wtf hahaha, looks at "Typ" in last year because why would it change? (apparently it does -> ask Tim)
                for (let i = 0; i < selectedValues.length; i++) {
                    if (values.includes(selectedValues[i])) {
                        counter++;
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

        console.log("filteredHospitals in HospitalTypeFilter: ");
        console.log(filteredHospitals);

        this.props.filter(filteredHospitals);
    }

    render() {
        const {t} = this.props;
        let categorizedHospitalTypes = [0, 1, 2, 3, 4, 5];
        let translatedCategorizedHospitalTypes = [t('hospitalTypes.university'), t('hospitalTypes.generic-center'),
            t('hospitalTypes.generic-basic'), t('hospitalTypes.psychiatry') , t('hospitalTypes.rehabilitation'),
            t('hospitalTypes.special')];

        return (
            <div className="hospitalTypeFilter">
                <CheckboxList items={categorizedHospitalTypes} checkboxSelectItem={this.checkboxSelectItem} titles={translatedCategorizedHospitalTypes}/>
            </div>
        )
    }
}

const localizedHospitalTypeFilter = withTranslation()(HospitalTypeFilter);
export default localizedHospitalTypeFilter;
