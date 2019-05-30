import React, { Component } from 'react';
import { withTranslation } from "react-i18next";

/**
 * Example component to show how to work with react-i18next localization
 */
class LocalizationExample extends Component {

    render () {

        /**
         * You can either access the translation function this way using destructuring
         *  or access it directly using this.props.t()
         */
        const {t} = this.props;

        return (
            {/*
                In here you can now use the t() function to display translated text.
                The strings are stored in JSON fromat at '/medlandscape_app/public/locales/'
                You need to add your strings in all languages, but as a fallback,
                german will be used (this can be changed in the 'i18n.js' file).
            */}
            <p>{t('localization_example.example')}</p>
        );
    }
}

/**
 * When working with class components, it is necessary to convert the exported
 *  component using the withTranslation() function. Only this way you gain
 *  access to the required props, like the t() function.
 *
 * In the end, export the converted component, not the original one.
 *
 * And yes, the two pairs of brackets are required
 */
const LocalizedLocalizationExample = withTranslation()(LocalizationExample)
export default LocalizedLocalizationExample;
