import React from 'react';
import classnames from 'classnames';

import Segment from '../Segment/Segment';
import Loader from '../Loader/Loader';

import './page-loader.css';

export default function PageLoader({ className, children, ...other }) {
  return (
    <Segment className={classnames('jr-page-loader', className)} {...other}>
      <Loader>{children || 'Loading'}</Loader>
    </Segment>
  );
}
