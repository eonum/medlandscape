import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import CheckboxList from '../CheckboxList/CheckboxList.js';

/**
 * Example component to show how to work with react-i18next localization
 */
class FilterEditor extends Component {
	state = {
		variables: [],
        selectedVariable: undefined,
        selectedValues: [],
		mappingObject: {},
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
		const {mappingObject} = this.state;
		let mapObj = {};
		for (let i = 0; i < item.values.length; i++)
			mapObj[item.values[i]] = item.values_text[i];
		this.setState({
			selectedVariable : item,
			selectedValues : [],
			mappingObject: mapObj,
		});
      }

    checkboxSelectItem = (item) => {
        let values = this.state.selectedValues;
        let index = values.indexOf(item);
        if (index !== -1)
            values.splice(index, 1);
        else values.push(item);
        this.setState({
            selectedValues : values,
        });
		this.filter();
    }

	filter = () => {
		const {selectedYear, hasLoaded} = this.props;

		let hospitals = JSON.parse("[{\"name\":\"Kantonsspital Baden AG\",\"street\":\"Im Ergel\",\"city\":\"5404 Baden\",\"latitude\":47.4546525,\"longitude\":8.2803946,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":4.0,\"2012\":1.0,\"2011\":1.0,\"2014\":4.0,\"2015\":4.0,\"2016\":4.0}}},{\"name\":\"Hirslanden Klinik Aarau\",\"street\":\"Schänisweg 1\",\"city\":\"5000 Aarau\",\"latitude\":47.3906911,\"longitude\":8.0430136,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Kreisspital für das Freiamt\",\"street\":\"Spitalstrasse 144\",\"city\":\"5630 Muri AG\",\"latitude\":47.2775154,\"longitude\":8.3305204,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Spital Zofingen AG\",\"street\":\"Mühlethalstrasse 27\",\"city\":\"4800 Zofingen\",\"latitude\":47.2963202,\"longitude\":7.9472207,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Asana Gruppe AG Spital Menziken\",\"street\":\"Spitalstrasse 1\",\"city\":\"5737 Menziken\",\"latitude\":47.2463691,\"longitude\":8.1899007,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"BGs\",\"2011\":\"MSt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2014\":1.0,\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Asana Gruppe AG Spital Leuggern\",\"street\":\"Kommendeweg 12\",\"city\":\"5316 Leuggern\",\"latitude\":47.5803263,\"longitude\":8.2165737,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Psychiatrische Dienste Aargau AG\",\"street\":\"Zürcherstrasse 241\",\"city\":\"5210 Windisch\",\"latitude\":47.4813578,\"longitude\":8.2154416,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":15.0,\"2014\":11.0,\"2015\":11.0,\"2016\":12.0}}},{\"name\":\"Schützen Rheinfelden AG Klinik \u0026 Ambulatorium\",\"street\":\"Bahnhofstrasse 19\",\"city\":\"4310 Rheinfelden\",\"latitude\":47.5530963,\"longitude\":7.7923168,\"attributes\":{\"WB\":{\"2013\":\"Arzt, BGs\",\"2012\":\"Arzt, BGs\",\"2011\":\"Arzt, BGs\",\"2014\":\"Arzt, BGs\",\"2015\":\"Arzt, BGs\",\"2016\":\"Arzt, BGs\"},\"AnzStand\":{\"2013\":3.0,\"2012\":1.0,\"2011\":1.0,\"2014\":3.0,\"2015\":3.0,\"2016\":3.0}}},{\"name\":\"RehaClinic Zurzach\",\"street\":\"Quellenstrasse 34\",\"city\":\"5330 Bad Zurzach\",\"latitude\":47.5899827,\"longitude\":8.288332,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":3.0,\"2012\":3.0,\"2011\":3.0,\"2014\":3.0,\"2015\":3.0,\"2016\":3.0}}},{\"name\":\"Rehaklinik Bellikon\",\"street\":\"Mutschellenstrasse 2\",\"city\":\"5454 Bellikon\",\"latitude\":47.388215,\"longitude\":8.3434057,\"attributes\":{\"WB\":{\"2013\":\"Arzt, BGs\",\"2012\":\"Arzt, BGs\",\"2011\":\"Arzt, BGs\",\"2014\":\"Arzt, BGs\",\"2015\":\"Arzt, BGs\",\"2016\":\"Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Reha Rheinfelden\",\"street\":\"Salinenstrasse 98\",\"city\":\"4310 Rheinfelden\",\"latitude\":47.5591951,\"longitude\":7.8071142,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"aarReha Schinznach Rehabilitation, Rheumatologie\",\"street\":\"Badstrasse 55\",\"city\":\"5116 Schinznach Bad\",\"latitude\":47.4574952,\"longitude\":8.1642211,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Bad Schinznach AG Privat-Klinik Im Park\",\"street\":\"Badstrasse 50\",\"city\":\"5116 Schinznach Bad\",\"latitude\":47.457959,\"longitude\":8.166283,\"attributes\":{\"WB\":{\"2013\":\"\",\"2012\":\"\",\"2011\":\"\",\"2014\":\"\",\"2015\":\"BGs\",\"2016\":\"BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Privatklinik SALINA Salina Medizin AG\",\"street\":\"Roberstenstrasse 31\",\"city\":\"4310 Rheinfelden\",\"latitude\":47.5579128,\"longitude\":7.8001698,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"BGs\",\"2011\":\"\",\"2014\":\"BGs\",\"2015\":\"BGs\",\"2016\":\"BGs\"},\"AnzStand\":{\"2013\":7.0,\"2012\":1.0,\"2011\":1.0,\"2014\":6.0,\"2015\":6.0,\"2016\":6.0}}},{\"name\":\"Geburtshus Storchenäscht AG\",\"street\":\"Hendschikerstrasse 12\",\"city\":\"5504 Othmarsingen\",\"latitude\":47.3978648,\"longitude\":8.2149798,\"attributes\":{\"WB\":{\"2013\":\"\",\"2012\":\"\",\"2011\":\"\",\"2014\":\"\",\"2015\":\"\",\"2016\":\"BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Kantonales Spital Appenzell\",\"street\":\"Sonnhalde 2a\",\"city\":\"9050 Appenzell\",\"latitude\":47.3344336,\"longitude\":9.4166098,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"BGs\",\"2011\":\"BGs\",\"2014\":\"BGs\",\"2015\":\"BGs\",\"2016\":\"BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Hof Weissbad AG Nachbehandlungs-Zentrum\",\"street\":\"Im Park 1\",\"city\":\"9057 Weissbad\",\"latitude\":47.3099947,\"longitude\":9.4333921,\"attributes\":{\"WB\":{\"2013\":\"\",\"2012\":\"\",\"2011\":\"\",\"2014\":\"\",\"2015\":\"\",\"2016\":\"\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Berit Paracelsus-Klinik AG\",\"street\":\"Steinweg 1\",\"city\":\"9052 Niederteufen\",\"latitude\":47.39008,\"longitude\":9.3628736,\"attributes\":{\"WB\":{\"2013\":\"BGs\",\"2012\":\"BGs\",\"2011\":\"BGs\",\"2014\":\"BGs\",\"2015\":\"BGs\",\"2016\":\"BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Insel Gruppe AG (universitär)\",\"street\":\"Freiburgstrasse 18\",\"city\":\"3010 Bern\",\"latitude\":46.9477087,\"longitude\":7.4255497,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":1.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"Insel Gruppe AG (nicht-universitär)\",\"street\":\"Morillonstrasse 77\",\"city\":\"3007 Bern\",\"latitude\":46.9315721,\"longitude\":7.4337348,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":6.0,\"2012\":6.0,\"2011\":6.0,\"2014\":6.0,\"2015\":6.0,\"2016\":5.0}}},{\"name\":\"Lindenhof AG\",\"street\":\"Bremgartenstrasse 117\",\"city\":\"3012 Bern\",\"latitude\":46.9581208,\"longitude\":7.4277464,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"BGs\",\"2011\":\"BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":3.0,\"2012\":1.0,\"2011\":1.0,\"2014\":4.0,\"2015\":4.0,\"2016\":4.0}}},{\"name\":\"Hirslanden Bern AG\",\"street\":\"Schänzlihalde 11\",\"city\":\"3013 Bern\",\"latitude\":46.9527915,\"longitude\":7.4481958,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":4.0,\"2012\":3.0,\"2011\":0.0,\"2014\":5.0,\"2015\":5.0,\"2016\":5.0}}},{\"name\":\"Spital STS AG\",\"street\":\"Krankenhausstrasse 12\",\"city\":\"3600 Thun\",\"latitude\":46.7611101,\"longitude\":7.6322734,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":4.0,\"2012\":3.0,\"2011\":5.0,\"2014\":4.0,\"2015\":4.0,\"2016\":4.0}}},{\"name\":\"Spitalzentrum Biel AG\",\"street\":\"Vogelsang 84\",\"city\":\"2502 Biel\",\"latitude\":47.1467297,\"longitude\":7.2447292,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":1.0,\"2012\":1.0,\"2011\":2.0,\"2014\":1.0,\"2015\":1.0,\"2016\":1.0}}},{\"name\":\"SRO Spital Region Oberaargau AG\",\"street\":\"St. Urbanstrasse 67\",\"city\":\"4900 Langenthal\",\"latitude\":47.2161037,\"longitude\":7.7938888,\"attributes\":{\"WB\":{\"2013\":\"MSt, Arzt, BGs\",\"2012\":\"MSt, Arzt, BGs\",\"2011\":\"MSt, Arzt, BGs\",\"2014\":\"MSt, Arzt, BGs\",\"2015\":\"MSt, Arzt, BGs\",\"2016\":\"MSt, Arzt, BGs\"},\"AnzStand\":{\"2013\":4.0,\"2012\":2.0,\"2011\":2.0,\"2014\":4.0,\"2015\":4.0,\"2016\":4.0}}}]");

		if (hasLoaded){
			let filteredHospitals = hospitals.filter(
				(item) => {
					let i;
					for(i = 0; i < this.state.selectedValues.length; i++){
						const valueArray = item.attributes[this.state.selectedVariable.name][selectedYear]
							.split(", ");
						if(valueArray.indexOf(this.state.selectedValues[i]) == -1){
							return false;
						}
					}
					return true;
				}
			);
			this.props.updateHospitals(filteredHospitals);
        }
	}

    render () {
        return (
			<div className="control-panel">
				<DropdownMenu id="filterDropDown" listItems={this.state.variables} selectItem={this.dropdownSelectItem} selectedItem={this.state.selectedVariable} />
                {(this.state.selectedVariable !== undefined) ? <CheckboxList objects={this.state.selectedVariable.values} checkboxSelectItem={this.checkboxSelectItem} mappingObject={this.state.mappingObject} /> : null}
			</div>
        );
    }
}

export default FilterEditor;
