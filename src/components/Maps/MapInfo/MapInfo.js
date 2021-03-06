import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Control from 'react-leaflet-control';
import { withTranslation } from 'react-i18next';
import './mapInfo.css';

/*
* Displays the Information to the map that is displayed at the moment.
* Included are infos to the selected Variable, selected Year and the map itself
*/

class MapInfo extends Component {

    render() {
        const {mapView, hasLoaded, year, selectedVariable, nrOfObjects, t} = this.props;
        let selectedMap, selectedVar, mapInfo, yearInfo, filterInfo;

        selectedMap = (mapView === 1) ? t('mapInfo.hospitals') : t('mapInfo.cantons');
        mapInfo = t('mapInfo.map') + ": " + selectedMap;

        if (Object.keys(selectedVariable).length !== 0) {
            selectedVar = t('mapInfo.variable') +  ": " + selectedVariable.text;
            if (hasLoaded) {
                yearInfo = (year.length > 0) ? t('mapInfo.year') + ": " + year : "";
                filterInfo = t('mapInfo.filter') + " " + selectedMap + ": " + nrOfObjects;
            }
        } else {
            selectedVar = t('mapInfo.noVariable');
        }

        return (
            <Control position="topleft">
        		<div className="mapInfo">
                    <h1>{mapInfo}</h1>
                    <h2>{selectedVar}</h2>
                    <h2>{filterInfo}</h2>
                    <h2>{yearInfo}</h2>
        		</div>
            </Control>
        );
    }
}

/**
 *PropTypes:
 * selectedVarialbe: The Variable that has been selected in the Controlpanel
 * view: The View selected, deciding if the map, table or statistics view is shown
 * mapView: The view that decides if either the HospitalMap or the CantonMap is shown
 * year: The year picked in the Slider componentToRender
 * t: used to translate
 * nrOfObjects: Displays how many Hospitals or Cantons are currently displayed
 */
 MapInfo.propTypes = {
	 mapView: PropTypes.number.isRequired,
	 hasLoaded: PropTypes.bool.isRequired,
	 year: PropTypes.string.isRequired,
	 selectedVariable: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	 nrOfObjects: PropTypes.number.isRequired,
	 t: PropTypes.func.isRequired
 }
/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedMapInfo = withTranslation()(MapInfo);
export default LocalizedMapInfo;
