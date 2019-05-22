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

        requestedVars = requestedVars.substring(0, requestedVars.length - 1);

        let query = "hospitals?variables=" + requestedVars;

        console.log("FETCHING from CentralPanel");
        this.props.fetchData(query).then(() => {
            this.setState({
                tableDataLoaded : true
            }, () => { if (callback) { callback(); }});
        })
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

        let hospitalVars = this.props.variables.filter(variable => {
            return (variable.variable_model === "Hospital")
        });
        let tableView = (
            <InteractiveTable
                variables={hospitalVars}
                hospitals={this.props.objects}
                requestData={this.requestTableData}
                tableDataLoaded={this.state.tableDataLoaded}
                tableDataGenerated={this.tableDataGenerated}
                retriggerTableGeneration={this.retriggerTableGeneration}
                hasLoaded={this.props.hasLoaded}
            />
        );

        let boxPlot = (
            <BoxPlot
                objects={this.props.objects}
                variableInfo={this.props.variableInfo}
                year={this.props.year}
                hasLoaded={this.props.hasLoaded}
            />
        )

        let linReg = (
            <LinearRegression
                hospitals={this.props.hospitals}
                requestData={this.requestTableData}
                tableDataLoaded={this.state.tableDataLoaded}
                tableDataGenerated={this.tableDataGenerated}
                variables={hospitalVars}
                year={this.props.year}
                hasLoaded={this.props.hasLoaded}
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
