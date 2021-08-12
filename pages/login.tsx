import React, { ReactElement, useState, } from 'react';
import Layout from '../components/layout';
import { Avatar, Button, Input, Typography  } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import classes from '../styles/page/login.module.css';
import { hashPass } from '../components/utils/accounts';

const Login = (): ReactElement => {

    const [submitEnabled, setSubmitEnabled] = useState<Boolean>(false);

    const submit = (e: Event) => {
        const uid = ((document.getElementById('uid')) as HTMLInputElement).value;
        const pass = ((document.getElementById('pass')) as HTMLInputElement).value;
        console.debug(hashPass(uid + pass));
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
            <div className={classes.login_input}
                style={{ width: '300px',
                    backgroundColor: 'lightgray',
                    padding: '2rem',
                    borderRadius: '1rem',
                    margin: '1rem' }}>
            User ID
                <Input size='large'
                    id="uid"
                    prefix={ <UserOutlined /> }
                    style={{borderRadius: '1rem',
                        padding: '0.5rem',
                        margin:'0.2rem auto 1rem'}}/>
            Password
                <Input size='large'
                    id="pass"
                    prefix={ <KeyOutlined />}
                    type='password'
                    style={{borderRadius: '1rem',
                        padding: '0.5rem',
                        margin:'0.2rem auto 0rem'}}/>
            </div>
            <Button className={classes.login_input}
                type='primary'
                size='large'
                style={{borderRadius: '2rem'}}
                onClick={submit}
                disabled>Submit</Button>
        </div>
    );
    const [login, setLogin] = useState<ReactElement>(log_in_input);
  
    return (
        <>
            <Layout>
                {login}
            </Layout>
        </>
    );
};

export default Login;
