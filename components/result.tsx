import React, { ReactElement } from 'react';
import { Result } from 'antd';

interface AnotherResultProps {
  icon: ReactElement;
  title: String;
}

const CenteredResult = (data: AnotherResultProps): ReactElement => {
    return (<div style={{display:'table',
        minHeight: '500px',
        margin: '0 auto'}}><Result
            icon={data.icon}
            title={data.title}
            style={{
                display: 'table-cell',
                verticalAlign: 'middle'
            }}
        /></div>);
};

export default CenteredResult;