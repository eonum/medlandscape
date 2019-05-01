import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import FilterEditor from '../FilterEditor/FilterEditor.js';
import { withTranslation } from 'react-i18next';
import './ControlPanel.css'

let apiRequest = "/api/medical_landscape/";

class ControlPanel extends Component {

    state = {
        mapView : 1
    }


    /**
     * Called when asking for a Variable to be displayed on the map
     * Prepares correct query to ask App.js
     * @param  {Variable Object} variable The selected Variable to apply to Hospitals or Cantons.
     */
    fetchMapData = (variable) => {
        const {name, variable_model} = variable;
        let query = this.props.i18n.language + apiRequest;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        query += key + "?variables=";
        query += encodeURIComponent(variable.name);
        return this.props.fetchData(key, query);
    }

    /**
     * Called when filtering Hospital variables.
     * Prepares correct query to ask App.js
     * @param  {Variable Object} variable The selected Variable to apply to Hospitals or Cantons.
     */
    fetchEnumData = (variable) => {
        const {name} = variable;
        let query = this.props.i18n.language + apiRequest + "hospitals?variables=";
        query += encodeURIComponent(this.props.selectedVariable.name + "$");
        query += encodeURIComponent(name);
        return this.props.fetchData("hospitals", query);
    }


    /**
     * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
     * then calls fetchMapData to fetch data from the API.
     * @param  {Variable object} item The selected variable.
     */
    selectVariable = (item) => {
        this.props.selectVariable(item);
        return this.fetchMapData(item);
    }

    setTabView = (view) => {
        let oldView = this.props.view;
        if (oldView !== view) {
            this.props.setView(view);
            document.getElementById('t' + oldView).classList.toggle('selectedTab');
            document.getElementById('t' + view).classList.toggle('selectedTab');
        }
    }

    setMapView = (view) => {
        if (this.state.view !== view) {
            this.setState({
                mapView : view
            });
        }
    }

    render() {
        let cantonVars = [], hospitalVars = [], years = [], enums = [];
        let selectedCanton = {}, selectedHospital = {};

        // filtering variables
        this.props.variables.filter(variable => {
            if (variable.variable_model === "Hospital" && variable.variable_type !== "enum") {
                hospitalVars.push(variable);
            } else if (variable.variable_model === "Canton") {
                cantonVars.push(variable);
            } else {
                enums.push(variable);
            }
        });

        // setting selectedItem for Dropdowns
        if (this.props.selectedVariable.variable_model === "Hospital") {
            selectedHospital = this.props.selectedVariable;
            selectedCanton = cantonVars[0];
        } else {
            selectedCanton = this.props.selectedVariable;
            selectedHospital = hospitalVars[0];
        }

        const { t } = this.props;

        let mapViewHospitals = (
            <div className="mapViewHospitals">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="hospitalVars" listItems={hospitalVars} selectItem={this.selectVariable} selectedItem={selectedHospital} defaultText="Spitalsvariabeln"/>
                <p>{t('filter.title')}</p>
                <FilterEditor hospitals={this.props.hospitals} updateHospitals={this.props.updateHospitals} fetchData={this.fetchEnumData} hasLoaded={this.props.hasLoaded} selectedYear={this.props.year} variables={enums} />
            </div>
        )

        let mapViewCantons = (
            <div className="mapViewCantons">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="cantonVars" listItems={cantonVars} selectItem={this.selectVariable} selectedItem={selectedCanton} defaultText="Kantonsvariabeln"/>
            </div>
        )

        let mapView = (
            <div className="view1">
                <div className="header">
                    <h1>{t('mapView.title')}</h1>
                    <div className="viewSwitcher">
                        <p id="l1" className={(this.state.mapView === 1) ? "label selectedLabel" : "label"} onClick={this.setMapView.bind(this, 1)}>{t('mapView.hospitals')}</p>
                        <p className="separator">|</p>
                        <p id="l2" className={(this.state.mapView === 2) ? "label selectedLabel" : "label"} onClick={this.setMapView.bind(this, 2)}>{t('mapView.cantons')}</p>
                    </div>
                </div>
                {
                    (this.state.mapView === 1)
                    ? mapViewHospitals
                    : mapViewCantons
                }
            </div>
        );

        let tableView = (
            <div className="view2">
                <div className="header">
                    <h1>{t('tableView.title')}</h1>
                </div>
            </div>
        );

        let graphView = (
            <div className="view3">
                <div className="header">
                    <h1>{t('graphView.title')}</h1>
                </div>
            </div>
        );

        let controlPanelView;
        switch(this.props.view) {
            case 1:
                controlPanelView = mapView;
                break;
            case 2:
                controlPanelView = tableView;
                break;
            case 3:
                controlPanelView = graphView;
                break;
            default:
                controlPanelView = mapView;
        }

        return (
			<div className="control-panel">
                <div className="tabs">
                    <div id="t1" className="tab selectedTab" onClick={this.setTabView.bind(this, 1)}></div>
                    <div id="t2" className="tab" onClick={this.setTabView.bind(this, 2)}></div>
                    <div id="t3" className="tab" onClick={this.setTabView.bind(this, 3)}></div>
                </div>
                <div className="tabContent">
                    {controlPanelView}
                </div>
			</div>
        );
    }
}

/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedControlPanel = withTranslation()(ControlPanel);
export default LocalizedControlPanel;
