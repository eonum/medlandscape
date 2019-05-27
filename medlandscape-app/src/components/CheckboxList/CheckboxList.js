import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
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
                        let uniqueKey = object + "Of" + this.props.id;
                        return <CheckboxListItem key={uniqueKey} item={object} checkboxSelectItem={this.props.checkboxSelectItem} title={this.props.titles[this.props.items.indexOf(object)]}/>
                    })
                }
            </div>
        );
    }
}

export default CheckboxList;
