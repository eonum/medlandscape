import React, { Component } from 'react';

/**
 * Example component to show how to work with react-i18next localization
 */
class FilterEditor extends Component {

	filter = () => {
		if (this.props.hasLoaded){
		var i;
		var array = [];
		for(i = 0; i < 10; i++){
			array.push(this.props.hospitals[i]);
		}
		this.props.updateHospitals(array);
		}
	}

    render () {
        return (
            <button onClick={this.filter}>
				First 10 Hospitals
			</button>
        );
    }
}

export default FilterEditor;
