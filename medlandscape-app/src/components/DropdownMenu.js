import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';

class DropdownMenu extends Component {

  state = { dropdownContentClasses: "dropdown-content hide" }

  toggleDropdown() {
    var css = (this.state.dropdownContentClasses === "dropdown-content hide") ? "dropdown-content show" : "dropdown-content hide";
    this.setState({ dropdownContentClasses:css });
  }

  selectItem(item) {
    this.props.selectItem(item);
    this.toggleDropdown();
  }

  filterFunction() {
    let input, filter, a, i, div, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("div");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  render() {
    return (
      <div className="dropdown">
      <button onClick={this.toggleDropdown.bind(this)} className="dropbtn">{this.props.selectedItem.name_de} ▼</button>
      <div id="myDropdown" className={this.state.dropdownContentClasses}>
      <input type="text" placeholder="Suchen..." id="myInput" onKeyUp={this.filterFunction.bind(this)} />
      {
        this.props.listItems.map((item) => (
            <div key={this.props.listItems.indexOf(item)} onClick={this.selectItem.bind(this, item)}>{item.name_de}</div>
        ))
      }
      </div>
      </div>
    );
  }
}

// PropTypes
DropdownMenu.propTypes = {
  listItems: PropTypes.array.isRequired, // Yes, the comma is necessary
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
}

export default DropdownMenu;
