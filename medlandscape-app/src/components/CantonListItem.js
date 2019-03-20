import React, { Component } from 'react';

class CantonListItem extends Component {

    render() {
        const {name, name_de, selectCanton} = this.props.canton;
        return (
            <div className="canton-list-item">
                <label>
                    <input type="checkbox" className="list-item-cb" onChange={this.props.selectCanton.bind(this, this.props.canton)}/>
                    <div className="canton-name">
                        {name + " " + name_de}
                    </div>
                </label>
            </div>
        );
    }
}

export default CantonListItem;
