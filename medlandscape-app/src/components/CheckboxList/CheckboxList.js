import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
import './CheckboxList.css'

class CheckboxList extends Component {

    render() {
        return (
            <div className="checkbox-list">
            {
                this.props.items.map((item) => (
                    <CheckboxListItem key={this.props.items.indexOf(item)} item={item} checkboxSelectItem={this.props.checkboxSelectItem} mappingObject={this.props.mappingObject}/>
                ))
            }
            </div>
        );
    }
}

export default CheckboxList;
