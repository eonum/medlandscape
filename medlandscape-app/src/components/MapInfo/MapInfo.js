import React, { Component } from 'react';
import Control from 'react-leaflet-control';
import { withTranslation } from 'react-i18next';

import './mapInfo.css';

class MapInfo extends Component {

    render() {
        const {mapView, year, selectedVariable, nrOfObjects, t} = this.props;

        let variableIsTypeHospital = (selectedVariable.variable_model === "Hospital");
        let selectedMap, selectedVar, mapInfo, yearInfo, filterInfo;
        selectedMap = (mapView === 1) ? t('mapInfo.hospitals') : t('mapInfo.cantons');
        mapInfo = t('mapInfo.map') + ": " + selectedMap;

        if ((mapView === 1 && variableIsTypeHospital) || (mapView === 2 && !variableIsTypeHospital)) {
            selectedVar = t('mapInfo.variable') +  ": " + selectedVariable.text;
            yearInfo = t('mapInfo.year') + ": " + year;
            filterInfo = t('mapInfo.filter') + " " + selectedMap + ": " + nrOfObjects;
        } else {
            selectedVar = t('mapInfo.noVariable');
        }

        return (
            <Control position="topleft">
        		<div className="mapInfo">
                    <h1>{mapInfo}</h1>
                    <h2>{selectedVar}</h2>
                    <h2>{(variableIsTypeHospital) ? filterInfo : ""}</h2>
                    <h2>{yearInfo}</h2>
        		</div>
            </Control>
        );
    }
}

/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedMapInfo = withTranslation()(MapInfo);
export default LocalizedMapInfo;
