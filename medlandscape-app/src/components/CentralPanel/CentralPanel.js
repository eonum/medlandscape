import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import InteractiveTable from '../InteractiveTable/InteractiveTable.js';
import BoxPlot from '../Graphs/BoxPlot.js';
import LinearRegression from '../Graphs/LinearRegression.js';
import './centralPanel.css'

const apiURL = "https://qm1.ch/";
let apiRequest = "/api/medical_landscape/";

class CentralPanel extends Component {

    state = {
        tableDataLoaded : false
    }

    requestTableData = (vars, callback) => {
        let requestedVars = "";

        for (let variable of vars) {
            requestedVars += variable.name + '$';
        }

        requestedVars = requestedVars.substring(0, requestedVars.length - 1);

        let query = "hospitals?variables=" + requestedVars;

        this.props.fetchData("hospitals", query).then(() => {
            this.setState({
                tableDataLoaded : true
            }, () => { callback() })
        })
    }

    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }

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
                hospitals={this.props.hospitals}
                requestData={this.requestTableData}
                tableDataLoaded={this.state.tableDataLoaded}
                tableDataGenerated={this.tableDataGenerated}
                retriggerTableGeneration={this.retriggerTableGeneration}
                hasLoaded={this.props.hasLoaded}
            />
        );

		let graphView = (
			<div>
				<BoxPlot
					objects={this.props.objects}
					variableInfo={this.props.variableInfo}
					year={this.props.year}
					hasLoaded={this.props.hasLoaded}
				/>
				<LinearRegression
					hospitals={this.props.hospitals}
					requestData={this.requestTableData}
					tableDataLoaded={this.state.tableDataLoaded}
					tableDataGenerated={this.tableDataGenerated}
					variables={hospitalVars}
					year={this.props.year}
					hasLoaded={this.props.hasLoaded}
				/>
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
