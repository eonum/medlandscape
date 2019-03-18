import React, { Component } from 'react';

class Table extends Component {
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
