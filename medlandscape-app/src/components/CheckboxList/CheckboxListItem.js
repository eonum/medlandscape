import React, { Component } from 'react';
/*
*The item that is selected in the CheckboxList is bound as a CheckboxListItem here
*/
class CheckboxListItem extends Component {

    render() {
       // const {name, text, checkboxSelectItem} = this.props.object;
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

export default CheckboxListItem;
