import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import FilterEditor from '../FilterEditor/FilterEditor.js';
import HospitalTypeFilter from '../HospitalTypeFilter/HospitalTypeFilter.js';
import { withTranslation } from 'react-i18next';
import { CSVLink } from "react-csv";
import './ControlPanel.css'

/**
* ControlPanel-Component that contains different DropdownMenus for the selection in the
* Map-Component, aswell as Icons to change to a different Components
*/

class ControlPanel extends Component {

    state = {
        cantonVars : [],
        hospitalVars : [],
        numberVars : [],
        enums : [],
        selectedEnum : {},
        csvData : []
    }

    /**
     * componentDidUpdate - called after the component was updated
     *
     * @param  {type} prevProps previous props
     */
    componentDidUpdate(prevProps) {
        // filtering the different variables after the first initialisation of variables
        if (this.props.variables !== prevProps.variables) {
            let cantonVars = [], hospitalVars = [], numberVars = [], enums = [];

            this.props.variables.forEach((variable) => {
                if (variable.variable_model === "Hospital" && variable.variable_type !== "enum") {
                    if (variable.name !== "Ort" && variable.name !== "Adr") { // because those don't make much sense as they are attached to any hospital either way
                        hospitalVars.push(variable);
                    }
                    if (variable.variable_type === "float" || variable.variable_type === "number" || variable.variable_type === "percentage" || variable.variable_type === "relevance") {
                        numberVars.push(variable);
                    }
                } else if (variable.variable_model === "Canton") {
                    cantonVars.push(variable);
                } else {
                    enums.push(variable);
                }
            });

            this.setState({
                cantonVars : cantonVars,
                hospitalVars : hospitalVars,
                numberVars : numberVars,
                enums : enums,
            });
        }

        if (!this.props.hasLoaded && prevProps.hasLoaded) {
            // if a dropdown has been selected that needs to fetch data
            if (this.props.selectedVariable !== prevProps.selectedVariable && this.props.view !== 2) {
                // specific views in which this can happen
                if (this.props.mapView === prevProps.mapView && this.props.view === 1 && prevProps.view === 1) {
                    this.fetchData(this.props.selectedVariable, this.state.selectedEnum);
                } else if (this.props.graphView === prevProps.graphView && this.props.view === 3 && prevProps.view === 3 && this.props.graphView !== 2) {
                    this.fetchData(this.props.selectedVariable, {});
                }
            }
        }
    }

    /**
     * Called when asking for a Variable to be displayed on the map
     * Prepares correct query to ask App.js
     * @param  {Variable Object} variable The selected Variable to apply to Hospitals or Cantons.
     */
    fetchData = (variable, enumVar) => {
        const {name, variable_model} = variable;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        let query = key + "?variables=";
        query += encodeURIComponent(name)
        if (key === "hospitals") {
            query += encodeURIComponent("$" + this.state.enums[7].name);
            if (Object.keys(enumVar).length > 0) {
                query += encodeURIComponent("$" + enumVar.name);
            }
        }
        return this.props.fetchData(query);
    }

    /**
     * Sets the state for selected Enum variable
     * Gets data after changing it
     * @param {Variable Object} variable The chosen variable.
     */
    setEnum = (variable) => {
        return this.fetchData(this.props.selectedVariable, variable).then(() => {
            this.setState({
                selectedEnum : variable
            });
        });
    }

    /**
     * resetEnum - resets the enum
     */
    resetEnum = () => {
        this.setState({
            selectedEnum : {}
        })
    }

    /**
     * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
     * then calls fetchData to fetch data from the API.
     * @param  {Variable object} item The selected variable.
     */
    setVariable = (item) => {
        this.props.setVariable(item);
    }

    /**
     * sets the view to be displayed on the ControlPanel.
     *
     * @param {Integer} represents the view to change to
     */
    setTabView = (view) => {
        let oldView = this.props.view;
        if (oldView !== view && this.props.hasLoaded) {
            this.props.setView(view);
            document.getElementById('t' + oldView).classList.toggle('selectedTab');
            document.getElementById('t' + view).classList.toggle('selectedTab');
        }

    }

    /**
     * render - renders the component
     *
     * @return {JSX}  JSX of the component
     */
    render() {

        const {t, hasLoaded, unfilteredHospitals, filterByEnum, filterByType, filterLinRegByType, year, selectedVariable, mapView, graphView, csvData} = this.props;
        const {hospitalVars, cantonVars, numberVars, enums, selectedEnum} = this.state;

        let selectedCantonVar, selectedHospitalVar;

        let mapViewHospitals = (
            <div className="mapViewHospitals">
                <HospitalTypeFilter
                    id="mapViewHTF"
                    hospitals={unfilteredHospitals}
                    filter={filterByType}
                    selectedYear={year}
                    hasLoaded={hasLoaded}
                />
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="hospitalVars"
                    listItems={hospitalVars}
                    selectItem={this.setVariable}
                    selectedItem={selectedVariable}
                    defaultText={t('dropDowns.variablesFallback')}
                />
                <p>{t('mapView.filter')}</p>
                <FilterEditor
                    hospitals={unfilteredHospitals}
                    filter={filterByEnum}
                    hasLoaded={hasLoaded}
                    selectedYear={year}
                    selectedEnum={selectedEnum}
                    variables={enums}
                    setEnum={this.setEnum}
                    resetEnum={this.resetEnum}
                />
            </div>
        )

        let mapViewCantons = (
            <div className="mapViewCantons">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="cantonVars" listItems={cantonVars} selectItem={this.setVariable} selectedItem={selectedVariable} defaultText={t('dropDowns.variablesFallback')}/>
            </div>
        )

        let mapViews = (
            <div className="view1">
                <div className="header">
                    <h1>{t('mapView.title')}</h1>
                    <div className="viewSwitcher">
                        <p className={(mapView === 1) ? "label selectedLabel" : "label"} onClick={this.props.setMapView.bind(this, 1)}>{t('mapView.hospitals')}</p>
                        <p className="separator">|</p>
                        <p className={(mapView === 2) ? "label selectedLabel" : "label"} onClick={this.props.setMapView.bind(this, 2)}>{t('mapView.cantons')}</p>
                    </div>
                </div>
                {
                    (mapView === 1)
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
                    <CSVLink
                        data={csvData}
                        filename="medlandscapeCSV.csv"
                        className="btnCreateCSV"
                        ref={(r) => this.csvLink = r}
                        target="_blank"
                    >
                        {t('tableView.btnCreateCSV')}
                    </CSVLink>
            </div>
        );

        let boxPlotView = (
            <div className="graphView">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="hospitalVars" listItems={numberVars} selectItem={this.setVariable} selectedItem={selectedVariable}  defaultText={t('dropDowns.variablesFallback')}/>
            </div>
        );

        let linRegView = (
            <div className="graphView">
                <HospitalTypeFilter
                    id="graphViewHTF"
                    hospitals={unfilteredHospitals}
                    filter={filterLinRegByType}
                    selectedYear={year}
                    hasLoaded={hasLoaded}
                />
            </div>
        );

        let graphViews = (
            <div className="view3">
                <div className="header">
                    <h1>{t('graphView.title')}</h1>
                    <div className="viewSwitcher">
                        <p className={(graphView === 1) ? "label selectedLabel" : "label"} onClick={this.props.setGraphView.bind(this, 1)}>{t('graphView.boxPlot')}</p>
                        <p className="separator">|</p>
                        <p className={(graphView === 2) ? "label selectedLabel" : "label"} onClick={this.props.setGraphView.bind(this, 2)}>{t('graphView.regression')}</p>
                    </div>
                </div>
                {
                    (graphView === 1)
                    ? boxPlotView
                    : linRegView
                }
            </div>
        );

        let controlPanelView;
        switch(this.props.view) {
            case 1:
                controlPanelView = mapViews;
                break;
            case 2:
                controlPanelView = tableView;
                break;
            case 3:
                controlPanelView = graphViews;
                break;
            default:
                controlPanelView = mapViews;
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
