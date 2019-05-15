import React, { Component } from 'react';
import CheckboxList from '../../CheckboxList/CheckboxList.js';

class HospitalTypeFilter extends Component {

    state = {
        mappingObject : {},
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
            switch (values) {
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

        // call prop function here
    }




    render() {
        const {values, values_text} = this.props.item;
        let categorizedHospitalTypes = ["Universitätsspital", "Allgemeinspital, Zentrumversorgung", "Allgemeinspital, Grundversorgung", "Psychiatrische Klinik", "Rehabilitationsklinik", "Spezialklinik"];

        return (
            <CheckboxList items={categorizedHospitalTypes} checkboxSelectItem={this.checkboxSelectItem} titles={categorizedHospitalTypes}/>
        )
    }
}

export default HospitalTypeFilter;
