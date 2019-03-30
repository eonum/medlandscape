import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';

/**
* DropdownMenu-Component that contains a search bar to filter the displayed
*  list items.
*
* Required properties: see PropTypes section below
*/
class DropdownMenu extends Component {

    /**
    * toggleDropdown - toggles whether the DropdownMenu is opened or closed
    */
    toggleDropdown() {
        let dropdownListDiv = document.getElementById(this.props.id);
        dropdownListDiv.classList.toggle('show');
    }

    /**
    * selectItem - informs this.props.selectItem about the item that has been
    * selected from the list. Also closes the menu.
    *
    * @param  {Object} item the list item that was selected
    */
    selectItem(item) {
        this.props.selectItem(item);
        this.toggleDropdown();
    }

    /**
    * filterFunction - filters the displayed listitems using input from the
    * textfield
    */
    filterFunction() {
        let input, filter, a, i, div, txtValue;
        input = document.getElementById(this.props.id);
        filter = input.value.toUpperCase();
        div = document.getElementById("dropdownList");
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

    /**
    * render - renders the component: A button to open and close the menu, a
    * div that contains an input-textfield (for filtering) and every list item
    * from the prop "listItems".
    *
    * @return {JSX}  JSX-Code of components
    */
    render() {
        console.log("rendering");
        return (
            <div className="dropdown">
                <button onClick={this.toggleDropdown.bind(this)} className="dropbtn">{/*this.selectedItem.text*/} ▼</button>
                <div id={this.props.id} className="dropdown-content">
                    <input type="text" placeholder="Suchen..." className="dropdownElem searchbar" onKeyUp={this.filterFunction.bind(this)} />
                    {
                        this.props.listItems.map((item) => (
                            <div className="dropdownElem" key={this.props.listItems.indexOf(item)} onClick={this.selectItem.bind(this, item)}>{item.text}</div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

/**
* PropTypes
*
* listItems: an array containing all list items of the menu
* selectItem: a function that will be called to inform the parent of the item
*  that was
* selectedItem: an object that represents the selected item
*/
DropdownMenu.propTypes = {
    listItems: PropTypes.array.isRequired, // Yes, the comma is necessary
    selectItem: PropTypes.func.isRequired,
    selectedItem: PropTypes.object.isRequired,
}

export default DropdownMenu;
