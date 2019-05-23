import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import './LanguagePicker.css'

/**
* Basic component for selecting the active language
*/
class LanguagePicker extends Component {

    state = {
        lang : 'de'
    }

    /**
    * onLanguageChange - Changes the language, and after that resends the
    * initApiCall to retrieve the correct variable names.
    */
    onLanguageChange = () => {
        let code = (this.state.lang === 'de') ? 'fr' : 'de';
        this.props.i18n.changeLanguage(code).then(() => {
            this.props.resendInitApiCall();
        });
        this.setState({
            lang : code
        })
    }


    /**
    * render - rendes the component
    *
    * @return {JSX}  Component in JSX format
    */
    render () {
        return (
            <div className="languagePicker">
                <button className="langBtn" onClick={() => this.onLanguageChange()}>{this.state.lang.toUpperCase()}</button>
            </div>
        );
    }
}

/**
 * Convert the component using withTranslation() to have access to t() function
 *  and other i18next props. Then export it.
 */
const LocalizedLanguagePicker = withTranslation()(LanguagePicker)
export default LocalizedLanguagePicker;
