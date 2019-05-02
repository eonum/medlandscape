import React, { Component } from 'react';
import Control from 'react-leaflet-control';
import { withTranslation } from 'react-i18next';

import './mapInfo.css';

class MapInfo extends Component {

    render() {
        const {year, selectedVariable, nrOfObjects, t} = this.props;

        let isCanton = (selectedVariable.variable_model === "Canton");
        let selectedMap = isCanton ? t('mapInfo.cantons') : t('mapInfo.hospitals');
        let mapInfo = t('mapInfo.map') + ": " + selectedMap;
        let yearInfo = t('mapInfo.year') + ": " + year;
        let filterInfo = t('mapInfo.filter') + " " + selectedMap + ": " + nrOfObjects;

        return (
            <Control position="topleft">
        		<div className="mapInfo">
                    <h1>{mapInfo}</h1>
                    <h2>{(!isCanton) ? filterInfo : ""}</h2>
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
