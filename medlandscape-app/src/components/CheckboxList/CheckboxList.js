import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
import './CheckboxList.css'

class CheckboxList extends Component {

    render() {
        return (
            <div className="checkbox-list">
            {
                this.props.objects.map((obj) => (
                    <CheckboxListItem key={this.props.objects.indexOf(obj)} object={obj} checkboxSelectItem={this.props.checkboxSelectItem} />
                ))
            }
            </div>
        );
    }
}

export default CheckboxList;
