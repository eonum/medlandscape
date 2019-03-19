import React, { Component } from 'react';
import CantonListItem from './CantonListItem.js'
import './CantonList.css'

class CantonList extends Component {

    render() {
        return (
            <div className="canton-list">
            {
                this.props.cantons.map((canton) => (
                    <CantonListItem key={this.props.cantons.indexOf(canton)} canton={canton} selectCanton={this.props.selectCanton} />
                ))
            }
            </div>
        );
    }
}

export default CantonList;
