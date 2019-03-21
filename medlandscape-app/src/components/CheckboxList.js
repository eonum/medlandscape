import React, { Component } from 'react';
import CheckboxListItem from './CheckboxListItem.js'
import './CheckboxList.css'

class CheckboxList extends Component {

    render() {
        return (
            <div className="checkbox-list">
            {
                this.props.cantons.map((canton) => (
                    <CheckboxListItem key={this.props.cantons.indexOf(canton)} canton={canton} checkboxSelectItem={this.props.checkboxSelectItem} />
                ))
            }
            </div>
        );
    }
}

export default CheckboxList;
