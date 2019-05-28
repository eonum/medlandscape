import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import InteractiveTable from '../InteractiveTable/InteractiveTable.js';
import BoxPlot from '../Graphs/BoxPlot.js';
import LinearRegression from '../Graphs/LinearRegression.js';
import './centralPanel.css'

/**
* CentralPanel-Component that contains a field which is used to displayed
* the InteractiveTable, BoxPlot and LinearRegression
*
*/

class CentralPanel extends Component {

    state = {
        tableDataLoaded : false
    }

	/* requests the Data tha is going to be used in the table component, depending on the selected Variable */
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

        console.log("FETCHING from CentralPanel");
        this.props.fetchData(query).then(() => {
            this.setState({
                tableDataLoaded : true
            }, () => { if (callback) { callback(); }});
        })
    }

    requestLinRegData = (vars) => {
        let requestedVars = "";

        for (let variable of vars) {
            requestedVars += variable.name + '$';
        }
        requestedVars += "Typ";
        requestedVars = encodeURIComponent(requestedVars);
        let query = "hospitals?variables=" + requestedVars;

        console.log("FETCHING from CentralPanel");
        this.props.fetchData(query);
    }

	/*sets the state of the generated to "not loaded"*/
    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }
	/*sets the state of the generated to "loaded"*/
    retriggerTableGeneration = () => {
        this.setState({
            tableDataLoaded : true
        });
    }

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
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedCentralPanel = withTranslation()(CentralPanel);
export default LocalizedCentralPanel;
