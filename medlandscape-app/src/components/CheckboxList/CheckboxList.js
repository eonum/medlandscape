import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
import './CheckboxList.css'

/*Creates a CheckboxList-Component which is used in the selection of different Variables,
* such hospital-type and different filters.
*/
class CheckboxList extends Component {

    render() {
        let listItems = [];
        for (var i = 0; i < this.props.items.length; i++) {
            listItems.push((<CheckboxListItem key={i} item={this.props.items[i]} checkboxSelectItem={this.props.checkboxSelectItem} title={this.props.titles[i]}/>));
        }
        return (
            <div className="checkbox-list">
                {listItems}
            </div>
        );
    }
}

export default CheckboxList;
