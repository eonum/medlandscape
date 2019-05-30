import React, { Component } from 'react';
import InteractiveTable from '../InteractiveTable/InteractiveTable.js';
import BoxPlot from '../Graphs/BoxPlot.js';
import LinearRegression from '../Graphs/LinearRegression.js';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './centralPanel.css'

/**
* CentralPanel-Component that contains a div which is used to displayed
* the InteractiveTable, BoxPlot and LinearRegression
*/
class CentralPanel extends Component {

    state = {
        tableDataLoaded : false
    }

	/**
     * requestTableData - requests the Data tha is going to be used in the
     *      table component, depending on the selected Variable
     *
     * @param {array} vars variables to request data of
     * @param {function} callback function that is called when request finished
     */
    requestTableData = (vars, callback) => {
        let requestedVars = "";

        for (let variable of vars) {
            requestedVars += variable.name + '$';
        }

        if (this.props.view === 3) {
            requestedVars += "Typ";
        } else {
            requestedVars = requestedVars.substring(0, requestedVars.length - 1);
        }

        requestedVars = encodeURIComponent(requestedVars);

        let query = "hospitals?variables=" + requestedVars;
        this.props.fetchData(query).then(() => {
            this.setState({
                tableDataLoaded : true
            }, () => { if (callback) { callback(); }});
        })
    }

    /**
     *  requestLinRegData - requests the Data tha is going to be used in the
     *      table component, depending on the selected Variable
     *
     * @param {array} vars variables to request data of
     */
    requestLinRegData = (vars) => {
        let requestedVars = "";

        for (let variable of vars) {
            requestedVars += variable.name + '$';
        }
        requestedVars += "Typ";
        requestedVars = encodeURIComponent(requestedVars);
        let query = "hospitals?variables=" + requestedVars;
        this.props.fetchData(query);
    }

	/**
     *  tableDataGenerated - sets the state of the generated to "not loaded"
     */
    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }
	/*
    * retriggerTableGeneration - sets the state of the generated to "loaded"
    *   informs the table to regenerate
    */
    retriggerTableGeneration = () => {
        this.setState({
            tableDataLoaded : true
        });
    }

    /**
     * render - renders the component
     *
     * @return {JSX}  jsx of the component
     */
    render() {
        const { objects, hasLoaded, selectedVariable, year, setVariable, setCSVData} = this.props;
        const { tableDataLoaded, } = this.state;
        let tableVars = this.props.variables.filter((variable) => {
            return (variable.variable_model === "Hospital");
        });
        let regressionVars = tableVars.filter((variable) => {
            return(variable.variable_type !== "enum" && variable.variable_type !== "string");
        })
        let tableView = (
            <InteractiveTable
                variables={tableVars}
                hospitals={objects}
                requestData={this.requestTableData}
                tableDataLoaded={tableDataLoaded}
                tableDataGenerated={this.tableDataGenerated}
                retriggerTableGeneration={this.retriggerTableGeneration}
                setCSVData={setCSVData}
                hasLoaded={hasLoaded}
            />
        );

        let boxPlot = (
            <BoxPlot
                objects={objects}
                selectedVariable={selectedVariable}
                year={year}
                hasLoaded={hasLoaded}
            />
        )

        let linReg = (
            <LinearRegression
                hospitals={objects}
                selectedVariable={selectedVariable}
                setVariable={setVariable}
                requestData={this.requestLinRegData}
                variables={regressionVars}
                year={year}
                hasLoaded={hasLoaded}
            />
        )

		let graphView = (
			<div>
                {
                    (this.props.graphView === 1)
                    ? boxPlot
                    : linReg
                }
			</div>
		);

        let mainView;
        switch (this.props.view) {
            case 2:
                mainView = tableView;
                break;
            case 3:
                mainView = graphView;
                break;
            default:
                mainView = null;
        }

        return (
			<div className={"central-panel"}>
            	{mainView}
			</div>
        );
    }
}

/**
 * PropTypes:
 * view:
 * graphView:
 * variables: An array of all the variable objects.
 * hasLoaded: A boolean that signifies that all data has been fetched by the API and is ready to be manipulated.
 * fetchData: A function that is called when new data is needed from the API.
 * objects: An array of hospital objects.
 * setVariable: A function that passes the newly selected Variable to the parent component.
 * selectedVariable: A variable object (or array of two objects) that represent the currently selected Variable.
 * setCSVData: A function that passes a 2D array to be exported into csv to the parent component.
 * year: The currently selected year.
 */

CentralPanel.propTypes = {
	view: PropTypes.number.isRequired,
    graphView: PropTypes.number.isRequired,
    variables: PropTypes.array.isRequired,
	hasLoaded: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
    objects: PropTypes.array.isRequired,
    setVariable: PropTypes.func.isRequired,
    selectedVariable: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    setCSVData: PropTypes.func.isRequired,
    year: PropTypes.string.isRequired,
}


/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedCentralPanel = withTranslation()(CentralPanel);
export default LocalizedCentralPanel;
