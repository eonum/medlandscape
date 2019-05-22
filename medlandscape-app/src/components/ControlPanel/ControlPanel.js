import React, { Component } from 'react';
import DropdownMenu from '../DropdownMenu/DropdownMenu.js';
import FilterEditor from '../FilterEditor/FilterEditor.js';
import HospitalTypeFilter from '../HospitalTypeFilter/HospitalTypeFilter.js';
import { withTranslation } from 'react-i18next';
import './ControlPanel.css'



class ControlPanel extends Component {

    state = {
        cantonVars : [],
        hospitalVars : [],
        enums : [],
        selectedEnum : undefined,
    }

    componentDidUpdate(prevProps) {
        if (this.props.variables !== prevProps.variables) {
            let cantonVars = [], hospitalVars = [], enums = [];

            // filtering the different variables
            this.props.variables.forEach((variable) => {
                if (variable.variable_model === "Hospital" && variable.variable_type !== "enum") {
                    if (variable.name !== "Ort" && variable.name !== "Adr") { // because those don't make much sense as they are attached to any hospital either way
                        hospitalVars.push(variable);
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
                enums : enums,
            });
        }


        if (!this.props.hasLoaded && prevProps.hasLoaded) {
            if (this.props.selectedVariable !== prevProps.selectedVariable) {
                console.log("FETCHING on CP didUpdate, variable: " + this.props.selectedVariable.name);
                this.fetchData(this.props.selectedVariable).then(() => {
                    this.setState({
                        hasLoaded : true
                    })
                });
            } else {
                console.log("NOTHING on CP didUpdate");
                this.setState({
                    hasLoaded : true
                })
            }
        }
    }

    /**
     * Called when asking for a Variable to be displayed on the map
     * Prepares correct query to ask App.js
     * @param  {Variable Object} variable The selected Variable to apply to Hospitals or Cantons.
     */
    fetchData = (variable) => {
        const {name, variable_model} = variable;
        let key = (variable_model === "Hospital") ? "hospitals" : "cantons";
        let query = key + "?variables=";
        query += encodeURIComponent(name + "$" + this.state.enums[7].name);
        if (this.state.selectedEnum !== undefined && key === "hospitals") {
            query += encodeURIComponent("$" + this.state.selectedEnum.name);
        }
        return this.props.fetchData(query);
    }

    /**
     * Sets the state for selected Enum variable
     * Gets data after changing it
     * @param {Variable Object} variable The chosen variable.
     */
    setEnum = (variable) => {
        this.setState({
            selectedEnum : variable
        }, () => {
            this.fetchData(this.props.selectedVariable);
        });
    }

    /**
     * Sets the state variable selectedVariable to the selected variable from a DropdownMenu Component,
     * then calls fetchData to fetch data from the API.
     * @param  {Variable object} item The selected variable.
     */
    setVariable = (item) => {
        this.setState({
            hasLoaded : false
        }, () => {
            this.props.setVariable(item);
        })
    }

    /**
     * sets the view to be displayed on the ControlPanel.
     */
    setTabView = (view) => {
        let oldView = this.props.view;
        if (oldView !== view) {
            this.props.setView(view);
            document.getElementById('t' + oldView).classList.toggle('selectedTab');
            document.getElementById('t' + view).classList.toggle('selectedTab');
        }
    }

    render() {

        const {t, hasLoaded, unfilteredHospitals, filterByEnum, filterByType, year, selectedVariable, mapView, graphView} = this.props;
        const {hospitalVars, cantonVars, enums, selectedEnum} = this.state;

        let selectedCantonVar, selectedHospitalVar;

        // setting selectedItem for Dropdowns
        if (mapView === 1) {
            selectedHospitalVar = selectedVariable;
        } else {
            selectedCantonVar = selectedVariable;
        }

        let mapViewHospitals = (
            <div className="mapViewHospitals">
                <HospitalTypeFilter
                    hospitals={unfilteredHospitals}
                    filter={filterByType}
                    selectedYear={year}
                    hasLoaded={hasLoaded}
                />
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="hospitalVars"
                    listItems={hospitalVars}
                    selectItem={this.setVariable}
                    selectedItem={selectedHospitalVar}
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
                />
            </div>
        )

        let mapViewCantons = (
            <div className="mapViewCantons">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="cantonVars" listItems={cantonVars} selectItem={this.setVariable} selectedItem={selectedCantonVar} defaultText={t('dropDowns.variablesFallback')}/>
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
            </div>
        );

        let boxPlotView = (
            <div className="graphView">
                <p>{t('mapView.variables')}</p>
                <DropdownMenu id="hospitalVars" listItems={hospitalVars} selectItem={this.setVariable} selectedItem={selectedHospitalVar}  defaultText={t('dropDowns.variablesFallback')}/>
            </div>
        );

        let linRegView = null;

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
