import React, { Component } from 'react';

class CheckboxListItem extends Component {

    render() {
        const {name, name_de, checkboxSelectItem} = this.props.canton;
        return (
            <div className="checkbox-list-item">
                <label>
                    <input type="checkbox" className="list-item-cb" onChange={this.props.checkboxSelectItem.bind(this, this.props.canton)}/>
                    <div className="list-item-name">
                        {name + " " + name_de}
                    </div>
                </label>
            </div>
        );
    }
}

export default CheckboxListItem;
