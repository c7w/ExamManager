import { ReactElement } from "react";

import { Image, Row, Col, Typography, Button } from "antd";

import Layout from "../components/layout";

import { UserOutlined, UserAddOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

function Index (): ReactElement {
  return (
    <>
      <Layout>
        <Row align='middle' style={{ position: "relative" }}>
          <Col span={12} style={{ textAlign: "center" }}>
            <Image src='/image/logo.svg' alt='logo' preview={false}></Image>
          </Col>

          <Col span={12}>
            <Row justify='center'>
              <Title level={1}>Exam Manager</Title>
            </Row>

            <Row justify='center'>
              <Text style={{ color: "gray" }}>Your exam manager...</Text>
            </Row>

            <Row justify='center'>
              <br />
              <br />
              <br />
              <br />
            </Row>

            <Row justify='center'>
              <Button href='/login' size='large' type='primary'>
                <UserOutlined /> Log In
              </Button>
            </Row>

            <Row>
              <br />
            </Row>

            <Row justify='center'>
              <Button href='/register' size='large' type='primary'>
                <UserAddOutlined /> Register
              </Button>
            </Row>
          </Col>
        </Row>
      </Layout>
    </>
  );
}

export default Index;
