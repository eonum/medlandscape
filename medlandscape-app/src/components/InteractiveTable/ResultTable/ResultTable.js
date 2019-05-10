import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '../../Table/Table.js'
import './ResultTable.css';
import { withTranslation } from 'react-i18next';

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

    componentDidUpdate() {
        let tableData = [];
        if (this.props.dataLoaded) {
            // check if all dropdowns selected something, else throw error
            let shouldGenerate = true;
            for (let hosp of this.props.selectedHospitals) {
                if (Object.keys(hosp).length === 0 && hosp.constructor === Object) {
                    shouldGenerate = false;
                    window.alert(this.props.t('tableView.selectSomethingAlert'));
                    break;
                }
            }
            if (shouldGenerate) {
                for (let variable of this.props.selectedVariables) {
                    if (Object.keys(variable).length === 0 && variable.constructor === Object) {
                        shouldGenerate = false;
                        window.alert(this.props.t('tableView.selectSomethingAlert'));
                        break;
                    }
                }
            }
            if (shouldGenerate) {
                for (let hosp of this.props.selectedHospitals) {
                    let newRow = [];
                    let currentHosp;
                    for (let hosp2 of this.props.hospitalData) {
                        if (hosp.name === hosp2.name) {
                            currentHosp = hosp2;
                            break;
                        }
                    }
                    for (let variable of this.props.selectedVariables) {
                        if (variable.is_time_series) {
                            const latestYear = Object.keys(currentHosp.attributes[variable.name])
                                .sort()[Object.keys(currentHosp.attributes[variable.name]).length -1];
                            const obj = currentHosp.attributes[variable.name];
                            newRow.push(obj[latestYear]);
                        } else {
                            newRow.push(currentHosp.attributes[variable.name]);
                        }
                    }
                    tableData.push(newRow);
                }
                this.setState({
                    resultTableData: tableData
                })
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
        return (
            <div>
                <Table tableData={this.state.resultTableData} />
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
*/
ResultTable.propTypes = {
    selectedHospitals: PropTypes.array.isRequired,
    selectedVariables: PropTypes.array.isRequired,
    hospitalData: PropTypes.array.isRequired,
    submitTableData: PropTypes.func.isRequired,
}

const LocalizedResultTable = withTranslation()(ResultTable);
export default LocalizedResultTable;
