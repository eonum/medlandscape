import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '../../Table/Table.js'
import './ResultTable.css';
import { withTranslation } from 'react-i18next';
import { numberFormat } from './../../../utils.mjs';

/**
 * Represents the part of the table which displays the results
 */
class ResultTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultTableData: []
        }
    }

    /**
     * canTableBeGenerated - checks if in each dropdown something is selected,
     *  and if the data has been fetched for these selected things.
     *
     * @return {bool} true, if everything is selected and the data is loaded,
     *  false otherwise
     */
    canTableBeGenerated = () => {
        let shouldGenerate = true;

        // check if in each hospital dropdown something was selected
        for (let hosp of this.props.selectedHospitals) {
            if (!hosp || (Object.keys(hosp).length === 0 && hosp.constructor === Object)) {
                shouldGenerate = false;
                break;
            }
        }
        // check the same for variables
        if (shouldGenerate) {
            for (let variable of this.props.selectedVariables) {
                if (!variable || (Object.keys(variable).length === 0 && variable.constructor === Object)) {
                    shouldGenerate = false;
                    break;
                }
                // also check if for the selected variables the data was fetched
                if (typeof(this.props.hospitalData[0].attributes[variable.name]) === 'undefined') {
                    shouldGenerate = false;
                    break;
                }
            }
        }
        if (!shouldGenerate) {
            window.alert(this.props.t('tableView.missingData'));
        }
        return shouldGenerate;
    }

    /**
     * componentDidUpdate - generates a 2D-array of values taken from selectedVariables and
     *  selectedHospitals and sets the state.
     *
     * @return {type}  description
     */
    componentDidUpdate() {
        let tableData = [];

        if (this.props.dataLoaded) {
            if (this.canTableBeGenerated()) {
                for (let hospital of this.props.selectedHospitals) {
                    let newRow = [];
					
					let currentHosp = this.props.hospitalData.find((hosp) => {return hosp.name === hospital.name;});
					
                    for (let i = 0; i < this.props.selectedVariables.length; i++) {
                        let variable = this.props.selectedVariables[i];
                        if (variable.is_time_series) {
                            // const latestYear = Object.keys(currentHosp.attributes[variable.name])
                            //     .sort()[Object.keys(currentHosp.attributes[variable.name]).length -1];
                            const year = this.props.selectedYears[i];
                            const obj = currentHosp.attributes[variable.name];
                            let value = "-";
                            if (typeof obj[year] !== 'undefined' && obj[year] !== '') {
                                value = numberFormat(obj[year]); //nice formatting for numbers, e.g 1'000'000
                            }
                            newRow.push(value);
                        } else {
							let value = currentHosp.attributes[variable.name];
							if(value === "")
								newRow.push("-");
							else 
								newRow.push(value);
                        }
                    }
                    tableData.push(newRow);
                }
                this.setState({
                    resultTableData: tableData
                })
                this.props.changeAcknowledged();
                this.props.submitTableData(tableData);
            }
            this.props.dataGenerated()
        }
    }

    /**
     * render - renders the component to the screen
     *
     * @return {JSX}  JSX of the component
     */
    render() {
        let table;
        if (!this.props.selectionChanged) {
            table = (<Table tableData={this.state.resultTableData} />);
        }
        return (
            <div className="resultTableData">
                {table}
            </div>
        );
    }
}

/**
* PropTypes
*
* selectedHospitals: array containing all selected hospitals
* selectedVariables: array containing all selected variables
* hospitals: array containing all hospitals and values of the selected variables
* submitTableData: function that is called to give the generated 2D-array to
*   the parent component
*/
ResultTable.propTypes = {
    selectedHospitals: PropTypes.array.isRequired,
    selectedVariables: PropTypes.array.isRequired,
    selectedYears: PropTypes.array.isRequired,
    hospitalData: PropTypes.array.isRequired,
    dataLoaded: PropTypes.bool.isRequired,
    submitTableData: PropTypes.func.isRequired,
    selectionChanged: PropTypes.bool.isRequired,
    changeAcknowledged: PropTypes.func.isRequired
}

const LocalizedResultTable = withTranslation()(ResultTable);
export default LocalizedResultTable;
