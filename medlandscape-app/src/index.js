import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './i18n';

/**
 * As long as i18n did not load translations, this blank screen will be displayed
 *  as for now this is a fraction of a second, later it would may be make sense
 *  to add a loading icon
 */
const Loader = () => (
    <div className="App"></div>
);


/**
 * The app component is wrapped inside a Suspense component. This way the
 * above mentioned effect occurs.
 */
ReactDOM.render(
    (
        <Suspense fallback={<Loader />}>
            <App />
        </Suspense>
    ), document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
