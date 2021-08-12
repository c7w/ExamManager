import { Menu, Typography, Layout, Row, Col, Badge, Button, Dropdown } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { MenuOutlined, MailOutlined, LoginOutlined, LogoutOutlined, LoadingOutlined, UserOutlined, UserAddOutlined, WarningOutlined } from '@ant-design/icons';
import { checkSessionId, generateSessionId } from './utils/accounts';

const { Title, Text, Link } = Typography;
const { Header, Content, Footer } = Layout;

interface LayoutProps {
  children: ReactElement | never[],
}

const DefaultLayout = ({children} : LayoutProps) : ReactElement => {
  
    const title = 'ExamManager';
    const [rightElements, setRightElements] = useState<ReactElement>(<LoadingOutlined className="NavbarIcon" />);

    useEffect(() => {
        const cookieList = document.cookie.split(';').map(entry => entry.trim().split('='));
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
    
        checkSessionId(sessionId).then(result => {
            if (!result.logged_in) {
                const login_menu: ReactElement = <Menu className="NavbarLoginMenu">
                    <Menu.Item key="login"><Link href="/login"><UserOutlined />Log In</Link></Menu.Item>
                    <Menu.Item key="register"><Link href="/register"><UserAddOutlined />Register</Link></Menu.Item>
                </Menu>;
                setRightElements(
                    <Link href="/login"><Dropdown overlay={login_menu}
                        placement="bottomRight"><LoginOutlined className="NavbarIcon" /></Dropdown></Link>
                );
            } else {
                setRightElements(
                    <Row gutter={24}
                        align='middle'>
                        <Col><Badge size="default"
                            count={result.prompts}
                            title={`You have ${result.prompts} unread message${((result.prompts as Number) > 1) ? 's' : ''}.`} ><MailOutlined className="NavbarIcon" /></Badge></Col>
                        <Col><Title level={4}>{result.username}</Title></Col>
                        <Col><Link href="/logout"
                            title="Logout"><LogoutOutlined className="NavbarIcon" /></Link></Col>
                    </Row>
                );
            }
        }).catch(err => {
            setRightElements(
                <WarningOutlined className="NavbarIcon"
                    title="Could not connect to remote API." />
            );
            console.error(err);
        });

    }, []);

    return (<>
        <Layout>
            <Header>
                <Row gutter={48}
                    align='middle'
                    className="Navbar">
                    <Col><MenuOutlined className="NavbarIcon" /></Col>
                    <Col flex='auto'><Title level={3}>{title}</Title></Col>
                    <Col>{rightElements}</Col>
                </Row>
            </Header>
            <Content style={{ padding: '50px 50px 0 50px' }}>
                <div className="site-layout-content">
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <Text>
          Powered by React.js & Antd.<br />[<Link href='https://github.com/c7w/ExamManager'
                        target='_blank'>ExamManager</Link>] © c7w 2021.
                </Text>
            </Footer>
        </Layout>
    </>);
};

export default DefaultLayout;