import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Table-Component
 *
 * Renders a table
 */
class Table extends Component {

    /**
     * render - Converts the property 'tableData' (see below) into a HTML-table and renders
     *      it.
     *
     * @return {JSX}  JSX-Code of component
     */
    render() {
        return (
            <div className="table">
                <table>
                    <tbody>
                    { // for each row, each element is added to the DOM
                        this.props.tableData.map((row) => {
                            return (<tr key={row}>{row.map((cell) => {
                                return <td key={cell}>{cell}</td>
                            })}</tr>)
                        })
                    }
                    </tbody>
                </table>
            </div>
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
