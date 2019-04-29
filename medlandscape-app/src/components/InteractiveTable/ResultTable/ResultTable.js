import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './../../Table.js'
import './ResultTable.css';

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
            for (let hosp of this.props.selectedHospitals) {
                let newRow = [];
                let currentHosp;
                for (let hosp2 of this.props.hospitalData) {
                    if (hosp.name === hosp2.name) {
                        currentHosp = hosp2;
                        break;
                    }
                }
                if (!currentHosp) {
                    window.alert('please select something')
                    break;
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
            this.props.dataGenerated(); //throws warning but still works (?)
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
}

export default ResultTable;
