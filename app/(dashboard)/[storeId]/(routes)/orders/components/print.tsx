"use client"

import React, {forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const PrintContent: React.FC<any> = forwardRef((props, ref) => {
  const { children } = props;
  return (
    <div ref={ref}>
      {children}
    </div>
  );
});

export default PrintContent;
