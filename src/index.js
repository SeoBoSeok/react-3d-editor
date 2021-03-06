import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const render = (Component) => {
    const rootElement = document.getElementById('root');
    ReactDom.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        rootElement,
    );
};

render(App);
if (module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    })
}

registerServiceWorker();