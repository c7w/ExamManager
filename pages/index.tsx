import { ReactElement, useEffect, useState } from 'react';

import { Image, Row, Col, Typography, Button } from 'antd';

import Layout from '../components/layout';

import { UserOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const unlogged_in: ReactElement = (<><Row justify='center'>
    <Button href='/login'
        size='large'
        type='primary'>
        <UserOutlined /> Log In
    </Button>
</Row>

<Row>
    <br />
</Row>

<Row justify='center'>
    <Button href='/register'
        size='large'
        type='primary'>
        <UserAddOutlined /> Register
    </Button>
</Row></>);

const logged_in: ReactElement = (<Row justify='center'>
    <Button href='/dashboard'
        size='large'
        type='primary'>
        <UserOutlined /> Dashboard
    </Button>
</Row>);

function Index(): ReactElement {
    
    const [login, setLogin] = useState(unlogged_in);
    const [user, setUser] = useState({});
    const getUser = (user: Object) => {
        setUser(user);
    };
    
    useEffect(() => {
        if (user.hasOwnProperty('username')) {
            setLogin(logged_in);
        }
    }, [user]);

    return (
        <>
            <Layout getUser={getUser}>
                <Row align='middle'
                    style={{ position: 'relative' }}>
                    <Col span={12}
                        style={{ textAlign: 'center' }}>
                        <Image src='/image/logo.svg'
                            alt='logo'
                            preview={false}></Image>
                    </Col>

                    <Col span={12}>
                        <Row justify='center'>
                            <Title level={1}>Exam Manager</Title>
                        </Row>

                        <Row justify='center'>
                            <Text style={{ color: 'gray' }}>Your exam manager...</Text>
                        </Row>

                        <Row justify='center'>
                            <br />
                            <br />
                            <br />
                            <br />
                        </Row>

                        {login}

                    </Col>
                </Row>
            </Layout>
        </>
    );
}

export default Index;
