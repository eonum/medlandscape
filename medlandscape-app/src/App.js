import React, { Component } from 'react';
import DropdrownMenu from './components/DropdownMenu.js';
import Table from './components/Table.js';
import './App.css';

const apiURL = "https://qm1.ch/";
let apiRequest = "de/api/medical_landscape/hospitals";

class App extends Component {

    state = {
        var: [],
        cantons : [],
        hospitals : [],

        selectedVariable: {},
        tableData : []
    }

    constructor(props) {
        super(props);

        this.dropdownSelectItem = this.dropdownSelectItem.bind(this);
    }

    initApiCall = () => {
        fetch(apiURL + "de/api/medical_landscape/variables").then(res => res.json()).then((results) => {
            this.setState({
                var : results.map(variable => {
                    return variable;
                })
            })
            this.dropdownSelectItem(this.state.var[0]);
        });

        fetch(apiURL + "de/api/medical_landscape/cantons").then(res => res.json()).then((results) => {
            this.setState({
                cantons : results.map(canton => {
                    return canton;
                })
            })
            this.create2dArr(this.state.cantons[0]);
        });

        fetch(apiURL + "de/api/medical_landscape/hospitals").then(res => res.json()).then((results) => {
            this.setState({
                hospitals : results.map(hospital => {
                    return hospital;
                }),
            })
        });
    };

    create2dArr = (selectedObject) => {
        let arr = [];
        for (var key in selectedObject) {
            if (typeof selectedObject[key] !== 'object' && selectedObject[key] !== null) {
                arr.push([key, selectedObject[key]]);
            }
        }
        console.log(arr);
        this.setState({
            tableData : arr
        })
    }

    componentDidMount(){
        this.initApiCall();
    }

    dropdownSelectItem(item) {
        this.setState({ selectedVariable: item });
    }

    render() {
        return (
            <div className="App">
                <DropdrownMenu listItems={this.state.var} selectItem={this.dropdownSelectItem}
                    selectedItem={this.state.selectedVariable} />
                <Table tableData={this.state.tableData} />
            </div>
        );
    }
}

export default App;
