import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import './LanguagePicker.css'

/**
* Basic component for selecting the active language
*/
class LanguagePicker extends Component {

    state = {
        lang : 'de',
        otherLang : 'fr'
    }

    /**
    * onLanguageChange - Changes the language, and after that resends the
    * initApiCall to retrieve the correct variable names.
    */
    onLanguageChange = () => {
        let code, other;
        if (this.state.lang === 'de') {
            code = 'fr';
            other = 'de';
        } else {
            code = 'de';
            other = 'fr';
        }
        this.props.i18n.changeLanguage(code).then(() => {
            this.props.changeLanguage();
        });
        this.setState({
            lang : code,
            otherLang : other
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
                <button className="langBtn">
                    {this.state.lang.toUpperCase()}
                </button>
                <button className="hiddenLangBtn" onClick={() => this.onLanguageChange()}>
                    {this.state.otherLang.toUpperCase()}
                </button>
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
