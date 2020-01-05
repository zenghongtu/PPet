import * as Sentry from '@sentry/electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicLayout from './layouts/BasicLayout';
import './index.scss';

Sentry.init({
  dsn: 'https://57b49a715b324bbf928b32f92054c8d6@sentry.io/1872002'
});

ReactDOM.render(<BasicLayout />, document.getElementById('app'));
