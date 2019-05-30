import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
import PropTypes from 'prop-types';
import './CheckboxList.css'

/*Creates a CheckboxList-Component which is used in the selection of different Variables,
* such hospital-type and different filters.
*/
class CheckboxList extends Component {

    render() {
        return (
            <div className="checkbox-list">
                {
                    this.props.items.map((object) => {
                        // Each CheckboxListItem component need a unique key to avoid checkboxes keep appearing checked after CheckboxList.js props have changed
                        let uniqueKey = object + "Of" + this.props.id;
                        return <CheckboxListItem key={uniqueKey} item={object} checkboxSelectItem={this.props.checkboxSelectItem} title={this.props.titles[this.props.items.indexOf(object)]}/>
                    })
                }
            </div>
        );
    }
}

/**
 * PropTypes:
 * id: A string used to create unique keys for the CheckboxListItems generated by this component.
 * items: An array of javascript objects (or numbers) defining the elements that get bound to CheckboxListItem components.
 * checkboxSelectItem: The function called when a checkbox is clicked.
 * titles: An array of strings describing the different checkboxes.
 */

CheckboxList.propTypes = {
	id: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    checkboxSelectItem: PropTypes.func.isRequired,
    titles: PropTypes.array.isRequired,
}
export default CheckboxList;
