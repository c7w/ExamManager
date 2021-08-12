import React, { ChangeEvent, ReactElement, useEffect, useRef, useState, } from 'react';
import Layout from '../components/layout';
import { Avatar, Button, Input, Typography, message, Result  } from 'antd';
import { LoadingOutlined,SmileOutlined, FrownOutlined, WarningOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { BASE_URL, hashPass } from '../components/utils/accounts';
import CenteredResult from '../components/result';

message.config({ maxCount: 3 });

const Login = (): ReactElement => {

    const [uid, setUid] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const sessionId = useRef<String>('');
    const [user, setUser] = useState<Object>({});

    const getSessionId = (sid: String) => {
        sessionId.current = sid;
    };

    const getUser = (user: Object) => {
        setUser(user);
    };

    useEffect(() => {
        if (user.hasOwnProperty('username')) {
            setLogin(<CenteredResult icon={<SmileOutlined/>}
                title="You have already logged in!" />);
            setTimeout(() => window.location.href = '/dashboard', 2000);
        }
    }, [user]);

    const submit = (e: React.MouseEvent<HTMLInputElement>) => {
        const uid = ((document.getElementById('uid')) as HTMLInputElement).value;
        const pass = ((document.getElementById('pass')) as HTMLInputElement).value;
        
        let valid = true;
        const user_id : number = Number(uid);
        if (!user_id) {
            message.warn('Please check your user ID again.');
            valid = false;
        }
        if (pass === '') {
            message.warn('Please input your password.');
            valid = false;
        }
        if (valid) {
            const password: String = hashPass(pass);
            setLogin(<CenteredResult icon={<LoadingOutlined/>}
                title="Trying to log in..." />);
            const data = {
                user_id,
                password,
                sessionId: sessionId.current
            };
            console.debug(JSON.stringify(data));
            fetch(BASE_URL + 'accounts/login', { method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 'ok') {
                        // Success
                        setLogin(<CenteredResult icon={<SmileOutlined/>}
                            title="Login successfully!" />);
                        setTimeout(() => window.location.href = '/dashboard', 2000);
                        
                    } else {
                        // Failed
                        setLogin(<CenteredResult icon={<FrownOutlined/>}
                            title="Unmatched credentials." />);
                        setTimeout(() => window.location.href = '/login', 2000);
                    }
                })
                .catch((err) => {
                    console.debug('Login: ' + err);
                    setLogin(<CenteredResult icon={<WarningOutlined/>}
                        title="A network connection error occurred." />);
                });
        }
    };

    const log_in_input: ReactElement = (
        <div style={{minHeight:'500px',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column'}}>
            <Typography.Text style={{flexGrow: 1}}></Typography.Text>
            <Avatar size={150}
                icon={<UserOutlined></UserOutlined>}></Avatar>
            <div style={{ margin: '1rem',
                flexGrow: 2,
                display: 'table' }}>
                <Typography.Title style={{display:'table-cell',
                    verticalAlign:'middle'}} >Log In</Typography.Title>
            </div>
            <div
                style={{ width: '300px',
                    backgroundColor: 'lightgray',
                    padding: '2rem',
                    borderRadius: '1rem',
                    margin: '1rem' }}>
            User ID
                <Input size='large'
                    id="uid"
                    prefix={<UserOutlined />}
                    style={{
                        borderRadius: '1rem',
                        padding: '0.5rem',
                        margin: '0.2rem auto 1rem'
                    }}
                />
            Password
                <Input size='large'
                    id="pass"
                    prefix={ <KeyOutlined />}
                    type='password'
                    style={{borderRadius: '1rem',
                        padding: '0.5rem',
                        margin:'0.2rem auto 0rem'}}/>
            </div>
            <Button
                type='primary'
                size='large'
                style={{borderRadius: '2rem'}}
                onClick={submit}>Submit</Button>
        </div>
    );
    
    const [login, setLogin] = useState<ReactElement>(log_in_input);

    return (
        <>
            <Layout getSessionId={ getSessionId }
                getUser={getUser}>
                <div>
                    {login}
                </div>
            </Layout>
        </>
    );
};

export default Login;
