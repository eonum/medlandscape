import React, { Component } from 'react';
<<<<<<< HEAD
import DropdrownMenu from './components/DropdownMenu.js';
import CantonList from './components/CantonList.js';
=======
import CantonMap from './components/CantonMap/CantonMap.js';
>>>>>>> 3e16a9cdb998c4a84ece03abc9e63e56fb53847a
import './App.css';

const apiURL = "https://qm1.ch/";
let apiRequest = "de/api/medical_landscape/hospitals";

class App extends Component {

    state = {
        var: [],
        cantons : [],
        hospitals : [],

        selectedVariable : {},
        selectedCantons : []
    }

    componentDidMount(){
        this.initApiCall();
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
        this.setState({ selectedVariable: item });
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

    render() {
        return (
            <div className="App">
<<<<<<< HEAD
                <DropdrownMenu listItems={this.state.var} selectItem={this.dropdownSelectItem}
                    selectedItem={this.state.selectedVariable} />
                <CantonList cantons={this.state.cantons} selectCanton={this.selectCanton} selectedCantons={this.selectedCanton}/>
=======
                <h1>Hello world</h1>
                <CantonMap/>
>>>>>>> 3e16a9cdb998c4a84ece03abc9e63e56fb53847a
            </div>
        );
    }
}

export default App;
