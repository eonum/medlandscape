import React, { Component } from 'react';
import CheckboxList from '../CheckboxList/CheckboxList.js';

class HospitalTypeFilter extends Component {

    state = {
        selectedValues : []
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
                case ("Universitätsspital"):
                    apiValues.push("K111");
                    break;
                case ("Allgemeinspital, Zentrumversorgung"):
                    apiValues.push("K112");
                    break;
                case ("Allgemeinspital, Grundversorgung"):
                    apiValues.push("K121");
                    apiValues.push("K122");
                    apiValues.push("K123");
                    break;
                case ("Psychiatrische Klinik"):
                    apiValues.push("K211");
                    apiValues.push("K212");
                    break;
                case ("Rehabilitationsklinik"):
                    apiValues.push("K221");
                    break;
                case ("Spezialklinik"):
                    apiValues.push("K231");
                    apiValues.push("K232");
                    apiValues.push("K233");
                    apiValues.push("K234");
                    apiValues.push("K235");
                    break;
            }
        }

        this.setState({
            selectedValues : values
        })

        this.props.setSelectedHospitalTypes(apiValues);
        if (values.length === 0) {

        }
        this.filter(apiValues);
    }

    filter = (selectedValues) => {
		const {selectedYear, hospitals} = this.props;
        const name = "Typ"

        let filteredHospitals = [];

        if (selectedValues.length > 0) {
            filteredHospitals = hospitals.filter((hospital) => {
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
                return true;
            });
        }
        
        this.props.filter(filteredHospitals);
    }

    render() {
        let categorizedHospitalTypes = ["Universitätsspital", "Allgemeinspital, Zentrumversorgung", "Allgemeinspital, Grundversorgung", "Psychiatrische Klinik", "Rehabilitationsklinik", "Spezialklinik"];

        return (
            <CheckboxList items={categorizedHospitalTypes} checkboxSelectItem={this.checkboxSelectItem} titles={categorizedHospitalTypes}/>
        )
    }
}

export default HospitalTypeFilter;
