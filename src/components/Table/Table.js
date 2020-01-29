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
        let table;
        if(this.props.tableData.length > 4) {
            table = <tr>Bitte melden Sie sich für grössere Auswertungen an <a href='mailto:info@eonum.ch'>info@eonum.ch</a>.
                Die eonum AG bietet weitergehende Datenanalysen mit zusätzlichen Datenquellen an.
                Weitere Informationen dazu finden Sie <a href='https://eonum.ch/de/allgemein/medical-landscape-schweiz/' target='_blank'>hier</a></tr>;
        } else {
            table = this.props.tableData.map((row, rowIndex) => {
                return (<tr key={this.props.tableData.indexOf(row)}>{row.map((cell, cellIndex) => {
                    return <td key={row.length * rowIndex + cellIndex}>{cell}</td>
                })}</tr>);
            })
        }
            return (
            <table className="table">
                <tbody>
                { table }
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
