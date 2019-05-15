import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DropdownMenu.css';
import { withTranslation } from "react-i18next";

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
        let allDropDowns = document.getElementsByClassName('dropdown-content');
        let thisDropDown = document.getElementById(this.props.id);
        for (let i = 0; i < allDropDowns.length; i++) {
            if (allDropDowns[i] === thisDropDown) {
                allDropDowns[i].classList.toggle('show');
            } else {
                allDropDowns[i].classList.remove('show');
            }
        }
        if (thisDropDown.classList.contains('show')) {
            thisDropDown.firstChild.focus();
        }
    }

    /**
    * selectItem - informs this.props.selectItem about the item that has been
    * selected from the list. Also closes the menu.
    *
    * @param  {Object} item the list item that was selected
    */
    selectItem = (item) => {
        this.props.selectItem(item, this.props.id);
        this.toggleDropdown();
    }

    /**
    * filterFunction - filters the displayed listitems using input from the
    * textfield
    */
    filterFunction = () => {
        let input, filter, a, i, div, txtValue;
        input = document.getElementById(this.props.id).querySelector('.searchbar');
        filter = input.value.toUpperCase();
        div = document.getElementById(this.props.id);
        a = div.getElementsByClassName('dropdownElem');

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
        let varText;
        const {t} = this.props;

        // if an item was passed as selectedItem
        if (this.props.selectedItem) {
            // if dropdown contains hospitals
            if (this.props.selectedItem.text) {
                varText = this.props.selectedItem.text;
            } else { // if contains cantons / variables
                varText = this.props.selectedItem.name;
            }
        } else { // fallback if no item was passed as selectedItem OR no defaultText
            // !! is to check for undefined, known hack
            varText = (!!this.props.defaultText) ? this.props.defaultText : t('dropDowns.fallback');
        }

        return (
            <div className="dropdown">
                <button onClick={this.toggleDropdown.bind(this)} className="dropbtn">{varText} ▼</button>
                <div id={this.props.id} className="dropdown-content">
                    <input type="text" placeholder={t('dropDowns.search')} className="searchbar" onKeyUp={this.filterFunction.bind(this)} />
                    {
                        this.props.listItems.map((item) => (
                            <div className="dropdownElem" key={this.props.listItems.indexOf(item)} onClick={this.selectItem.bind(this, item)}>{item.text ? item.text : item.name}</div>
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
*  that was selected
* selectedItem: an object that represents the selected item
*/
DropdownMenu.propTypes = {
    listItems: PropTypes.array.isRequired,
    selectItem: PropTypes.func.isRequired,
    selectedItem: PropTypes.object.isRequired,
}

const LocalizedDropdownMenu = withTranslation()(DropdownMenu);
export default LocalizedDropdownMenu;
