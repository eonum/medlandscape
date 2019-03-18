import React, { Component } from 'react';

/**
 * Table-Component
 *
 * Renders a table
 */
class Table extends Component {

    /**
     * render - Converts the property (see below) into a HTML-table and renders
     *      it.
     *
     * @return {JSX}  JSX-Code of component
     */
    render() {
        return (
            <div className="table">
                <table>
                    {
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

export default Table;
