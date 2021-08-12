import React, { ReactElement, useEffect, useState } from 'react';
import {
    LoadingOutlined,
    WarningOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { Result } from 'antd';
import { BASE_URL, generateSessionId } from '../components/utils/accounts';

const Logout = (): ReactElement => {
    const [content, setContent] = useState<ReactElement>(
        <Result
            icon={<LoadingOutlined />}
            title='Logging out...'
            subTitle='You are currently logging out.'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column'
            }}
        />
    );

    useEffect(() => {
    // Get SessionID
        const cookieList = document.cookie
            .split(';')
            .map(entry => entry.trim().split('='));
        let sessionId;
        for (const entry of cookieList) {
            if (entry[0] === 'sessionId') {
                sessionId = entry[1];
            }
        }
        if (!sessionId) {
            // Generate a new sessionId and write it to cookies.
            sessionId = generateSessionId();
            document.cookie = `sessionId=${sessionId}`;
        }

        const could_not_log_out: ReactElement = (
            <Result
                icon={<WarningOutlined />}
                title='An error occurred during logging out.'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column'
                }}
            />
        );

        const successfully_log_out: ReactElement = (
            <Result
                icon={<CheckOutlined />}
                title='Successfully logged out.'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column'
                }}
            />
        );

        const url = BASE_URL + 'accounts/expire?sessionId=' + sessionId;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    setContent(successfully_log_out);
                } else {
                    setContent(could_not_log_out);
                }
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            })
            .catch(err => {
                setContent(could_not_log_out);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            });
    }, []);

    return (
        <div style={{ position: 'absolute',
            width: '100%',
            height: '100%' }}>
            {content}
        </div>
    );
};

export default Logout;
