import React from 'react';
import classnames from 'classnames';

export default function Container({ children, className, ...other }) {
  return (
    <div className={classnames('ui container', className)} {...other}>
      {children}
    </div>
  );
}
