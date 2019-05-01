import React, { Component } from 'react';

class CheckboxListItem extends Component {

    render() {
       // const {name, text, checkboxSelectItem} = this.props.object;
        return (
            <div className="checkbox-list-item">
                <label>
                    <input type="checkbox" className="list-item-cb" onChange={this.props.checkboxSelectItem.bind(this, this.props.item)}/>
                    <div className="list-item-name">
                        {this.props.item}: {this.props.mappingObject[this.props.item]}
                    </div>
                </label>
            </div>
        );
    }
}

export default CheckboxListItem;
