import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import './LanguagePicker.css'

/**
* Basic component for selecting the active language
*/
class LanguagePicker extends Component {

    /**
    * onLanguageChange - Changes the language, and after that resends the
    * initApiCall to retrieve the correct variable names.
    */
    onLanguageChange = (code) => {
        this.props.i18n.changeLanguage(code).then(() => {
            this.props.resendInitApiCall();
        });
    }


    /**
    * render - rendes the component
    *
    * @return {JSX}  Component in JSX format
    */
    render () {
        return (
            <div className="languagePicker">
                <p>{this.props.t('language_picker.info')}:</p>
                <button className="langBtn" onClick={() => this.onLanguageChange('de')}>DE</button>
                <button className="langBtn" onClick={() => this.onLanguageChange('fr')}>FR</button>
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
