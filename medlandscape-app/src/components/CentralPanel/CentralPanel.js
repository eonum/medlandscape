import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import InteractiveTable from '../InteractiveTable/InteractiveTable.js';

const apiURL = "https://qm1.ch/";
let apiRequest = "/api/medical_landscape/";

class CentralPanel extends Component {

    state = {
        tableDataLoaded : false
    }

    requestTableData = (vars) => {
        let requestedVars = "";

        for (let variable of vars) {
            requestedVars += variable.name + '$';
        }

        requestedVars = requestedVars.substring(0, requestedVars.length - 1);

        let query = this.props.i18n.language + apiRequest;
        query += 'hospitals' + "?variables=" + requestedVars;

        this.props.fetchData(query).then(() => {
            this.setState({
                tableDataLoaded : true
            })
        })
    }

    tableDataGenerated = () => {
        this.setState({
            tableDataLoaded : false
        });
    }

    render() {

        let hospitalVars = this.props.variables.filter(variable => {
            return (this.props.variable_model === "Hospital")
        })

        let tableView = (
            <InteractiveTable
                variables={hospitalVars}
                hospitals={this.props.hospitals}
                requestData={this.requestTableData}
                tableDataLoaded={this.state.tableDataLoaded}
                tableDataGenerated={this.tableDataGenerated}
                hasLoaded={this.props.hasLoaded}
            />
        );

        let mainView;
        switch (this.props.view) {
            case 1:
                mainView = null;
                break;
            case 2:
                mainView = tableView;
                break;
            case 3:
                mainView = null;
                break;
            default:
                mainView = null;
        }

        return (
            <div className="central-panel">
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