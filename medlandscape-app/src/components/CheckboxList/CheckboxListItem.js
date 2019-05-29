import React, { Component } from 'react';
import PropTypes from 'prop-types';
/*
* Represents a single checkbox with label as part of a CheckboxList.
*/
class CheckboxListItem extends Component {

    render() {
        return (
            <div className="checkbox-list-item">
                <label>
                    <input type="checkbox" className="list-item-cb" onChange={this.props.checkboxSelectItem.bind(this, this.props.item)}/>
                    <div className="list-item-name">
                        {this.props.title}
                    </div>
                </label>
            </div>
        );
    }
}

/**
 * PropTypes:
 * item: the javascript object (or in case of HospitalTypeFilter, a number) bound to this CheckboxListItem
 * checkboxSelectItem: the function to call when this component's checkbox is clicked.
 * title: a String to display next to the checkbox as information.
 */

CheckboxListItem.propTypes = {
    item: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
    ]).isRequired,
    checkboxSelectItem: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
}
export default CheckboxListItem;
