import React from 'react';
import classnames from 'classnames';

export default function Message({ className, type, header, children, ...other }) {
  return (
    <div className={classnames('ui message', type)}>
      <div className="header">
        {header}
      </div>
      {children}
    </div>
  );
}
