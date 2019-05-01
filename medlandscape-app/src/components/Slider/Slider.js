import React, { Component } from 'react';
import './Slider.css'

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
                        this.props.years.map((year) => {
                            let yrStr = year;
                            if (this.props.years.length > 15) {
                                let yrStr = "'" + yrStr.slice(-2);
                            }
                            return <div key={this.props.years.indexOf(year)} className={(year === this.props.selectedYear) ? "year selected" : "year"} onClick={this.selectYear.bind(this, year)}>{yrStr}</div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Slider;
