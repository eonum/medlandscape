import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Slider.css'

/*
* A simple component to change and set the year of the selected Variable in style of a slider.
*/

class Slider extends Component {

    selectYear = (year) => {
        this.props.setYear(year);
    }

    render() {
        return (
            <div className="slider">
                <div className="years">
                    <div className="sliderBar"></div>
                    {
                        (this.props.hasLoaded)
                        ?
                        (
                            this.props.years.map((year) => {
                                let yearString = year;
                                if (this.props.years.length > 12) {
                                    yearString = year.substring(2);
                                }
                                return (
                                    <div
                                        key={this.props.years.indexOf(year)}
                                        className={(year === this.props.selectedYear) ? "year selected" : "year"}
                                        onClick={this.selectYear.bind(this, year)}
                                    >
                                    {yearString}
                                    </div>
                                )
                            })
                        )
                        : null
                    }
                </div>
            </div>
        )
    }
}

/**
 * PropTypes:
 * years: An array representing the list of possible years to choose from.
 * selectedYear: The currently selected year.
 * setYear: The function to call when selecting a year.
 * hasLoaded: A boolean that is true when correlating data has been fetched from the API. The list of available years does not show until this is true.
 */

Slider.propTypes = {
	years: PropTypes.array.isRequired,
    selectedYear: PropTypes.string.isRequired,
    setYear: PropTypes.func.isRequired,
    hasLoaded: PropTypes.bool.isRequired,
}
export default Slider;
