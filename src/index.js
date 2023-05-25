import React from 'react';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import common_en from "../src/translations/en/common.json"
import common_vi from "../src/translations/vi/common.json"
import { AuthProvider } from './context/auth';

i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
      en: {
          common: common_en               // 'common' is our custom namespace
      },
      vi: {
          common: common_vi
      },
  },
});

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>,
    </AuthProvider>
  </I18nextProvider>,
  document.getElementById('root')
)
