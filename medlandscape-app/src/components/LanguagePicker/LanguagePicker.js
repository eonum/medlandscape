import React, { Component } from 'react';
import { withTranslation } from "react-i18next";

/**
 * Basic Component for selecting the active langue
 */

class LanguagePicker extends Component {

    onLanguageChange = (code) => {
        this.props.i18n.changeLanguage(code).then(() => {
            this.props.resendInitApiCall();
        });
    }

    render () {
        return (
            <div className="languagePicker">
                <p>{this.props.t('language_picker.info')}:</p>
                <button onClick={() => this.onLanguageChange('de')}>DE</button>
                <button onClick={() => this.onLanguageChange('fr')}>FR</button>
            </div>
        );
    }
}
const LocalizedLanguagePicker = withTranslation()(LanguagePicker)
export default LocalizedLanguagePicker;
