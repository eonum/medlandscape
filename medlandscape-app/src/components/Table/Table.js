import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './table.css';

/**
 * Table-Component
 *
 * Renders a table
 */
class Table extends Component {

    /**
     * render - Converts the property 'tableData' (see below) into a HTML-table
     * and renders it.
     *
     * @return {JSX}  JSX-Code of component
     */
    render() {
        return (
            <table className="table">
                <tbody>
                { // for each row, each element is added to the DOM
                    this.props.tableData.map((row) => {
                        return (<tr key={this.props.tableData.indexOf(row)}>{row.map((cell) => {
                            return <td key={row.length * this.props.tableData.indexOf(row) + row.indexOf(cell)}>{cell}</td>
                        })}</tr>)
                    })
                }
                </tbody>
            </table>
        );
    }
}

/**
* PropTypes
*
* tableData: a 2d-Array that represents the table
*/
Table.propTypes = {
    tableData: PropTypes.array.isRequired,
}

export default Table;
