import React, { Component } from 'react';
import DropdrownMenu from './components/DropdownMenu.js';
import Table from './components/Table.js';
import CantonList from './components/CantonList.js';
import CantonMap from './components/CantonMap/CantonMap.js';
import './App.css';

const apiURL = "https://qm1.ch/";
let apiRequest = "de/api/medical_landscape/";

class App extends Component {

    state = {
        var: [],
        cantons : [],
        hospitals : [],

        selectedVariable : {},
        selectedCantons : [],
        tableData : []
    }

    apiCall = (selectedVar) => {
        let query = apiRequest + "hospitals?variables=" + selectedVar;
        fetch(apiURL + query).then(res => res.json()).then((results) => {
            this.setState({
                hospitals : results.map(hospital => {
                    return hospital;
                })
            })
        });

        query = apiRequest + "cantons?variables=" + selectedVar;
        fetch(apiURL + query).then(res => res.json()).then((results) => {
            this.setState({
                cantons : results.map(canton => {
                    return canton;
                })
            })
        });
    }

    initApiCall = () => {
        fetch(apiURL + "de/api/medical_landscape/variables").then(res => res.json()).then((results) => {
            this.setState({
                var : results.map(variable => {
                    return variable;
                }),
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
                })
            })
        });
    };

    dropdownSelectItem = (item) => {
        this.setState({ selectedVariable : item });
        this.apiCall(item.name);
    }

    selectCanton = (canton) => {
        if (this.state.selectedCantons.includes(canton)) {
            this.setState({
                selectedCantons : this.state.selectedCantons.filter(checkedCanton => {
                    return checkedCanton !== canton;
                })
            })
        } else {
            this.setState({
                selectedCantons : [...this.state.selectedCantons, canton]
            })
        }
    }

    create2dArr = (selectedObject) => {
        let arr = [];
        for (var key in selectedObject) {
            if (typeof selectedObject[key] !== 'object' && selectedObject[key] !== null) {
                arr.push([key, selectedObject[key]]);
            }
        }
        this.setState({
            tableData : arr
        })
    }

    componentDidMount() {
        this.initApiCall();
    }

    render() {
        return (
            <div className="App">
                <DropdrownMenu listItems={this.state.var} selectItem={this.dropdownSelectItem} selectedItem={this.state.selectedVariable} />
                {/*<CantonList cantons={this.state.cantons} selectCanton={this.selectCanton} selectedCantons={this.selectedCanton}/>*/}
                <CantonMap cantons={this.state.cantons} />
                {/*<HospitalMap hospitals={this.state.hospitals}*/}
                {/*<Table tableData={this.state.tableData} />*/}
            </div>
        );
    }
}

export default App;
