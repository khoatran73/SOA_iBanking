import React from 'react';
import { Provider } from 'react-redux';
import { AppProvider } from '~/providers/AppProvider';
import { AppRoute } from '~/routes';
import './App.scss';
import store from './AppStore';

const App: React.FC = (): JSX.Element => {
    return (
        <React.Fragment>
            <Provider store={store}>
                <AppProvider>
                    <AppRoute />
                </AppProvider>
            </Provider>
        </React.Fragment>
    );
};

export default App;
