import React, { Component } from 'react';

class CantonListItem extends Component {

    render() {
        const {name, name_de, selectCanton} = this.props.canton;
        return (
            <div className="canton-list-item">
                <label>
                    <input type="checkbox" className="canton-cb" onChange={this.props.selectCanton.bind(this, this.props.canton)}/>
                    <p className="canton-name" >{name + " " + name_de}</p>
                </label>
            </div>
        );
    }
}

export default CantonListItem;
