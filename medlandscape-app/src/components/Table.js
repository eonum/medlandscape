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
                    { // for each row, each element is added to the DOM
                        this.props.tableData.map((row) => {
                            return (<tr>{row.map((cell) => {
                                return <td>{cell}</td>
                            })}</tr>)
                        })
                    }
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
