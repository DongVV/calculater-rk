import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Row, Col, Input, Button, Card, List } from 'antd';
import styled from 'styled-components';
import { FIELDS } from './const';

const WrapperStyle = styled.div`
  margin: 10px;

  .ant-card {
    margin-bottom: 15px;
  }
`;

const FormItem = Form.Item;

const Home = () => {
  const [totalRevenueOfM, setTotalRevenueOfM] = useState(0);
  const [totalOriginOfM, setTotalOriginOfM] = useState(0);
  const [totalProfitOfM, setTotalProfitOfM] = useState(0);

  const [totalRevenueOfKD, setTotalRevenueOfKD] = useState(0);
  const [totalOriginOfKD, setTotalOriginOfKD] = useState(0);
  const [totalProfitOfKD, setTotalProfitOfKD] = useState(0);

  const getFields = (cal = true, flag) => {
    const children = [];

    let formItemLayout = {
      labelCol: { span: 9},
      wrapperCol: { span: 15 },
    };
    let colSpan = 4;
    if (cal) {
      formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      }
      colSpan = 24;
    }

    FIELDS.map((field, index) => {
      children.push(
        <Col span={colSpan} key={index}>
          <FormItem
            {...formItemLayout}
            label={field.lable}
            name={cal ? `cal_${flag}_${field.name}` : field.name}
            initialValue={cal ? 0 : field.value}
          >
            <Input placeholder={field.lable} />
          </FormItem>
          {cal && <FormItem
            {...formItemLayout}
            wrapperCol={{ span: 3 }}
            label={`Qty ${field.lable}`}
            name={`number_${flag}_${field.name}`}
            initialValue={0}
          >
            <Input placeholder={field.lable} />
          </FormItem>}
        </Col>
      );
    });

    return children;
  }

  const handleSubmit = data => {
    let totalRevenue = 0;
    let totalOrigin = 0;

    FIELDS.map(field => {
      totalRevenue += eval(data[`cal_M_${field.name}`]);
      totalOrigin += (parseInt(data[field.name]) + parseInt(data['shipping_fee']) * parseInt(data[`number_M_${field.name}`]));
    });
    let totalProfitTmp = totalRevenue - totalOrigin;

    setTotalRevenueOfM(totalRevenue);
    setTotalOriginOfM(totalOrigin);
    setTotalProfitOfM(totalProfitTmp);

    totalRevenue = 0;
    totalOrigin = 0;
    totalProfitTmp = 0;

    FIELDS.map(field => {
      totalRevenue += eval(data[`cal_KD_${field.name}`]);
      totalOrigin += (parseInt(data[field.name]) + parseInt(data['shipping_fee']) * parseInt(data[`number_KD_${field.name}`]));
    });
    totalProfitTmp = totalRevenue - totalOrigin;

    setTotalRevenueOfKD(totalRevenue);
    setTotalOriginOfKD(totalOrigin);
    setTotalProfitOfKD(totalProfitTmp);
  }

  const getList = (totalRevenue, totalOrigin, totalProfit) => {
    return <List
      size="large"
      bordered
      dataSource={[
        `Total Revenue: ${totalRevenue}`,
        `Total Origin: ${totalOrigin}`,
        `Total Profit: ${totalProfit}`,
      ]}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  }

  return (
    <WrapperStyle>
      <Form className="ant-advanced-search-form" onFinish={handleSubmit}>
        <Card title="The Origin Price Without The Shipping Fee">
          <Row gutter={40}>
            {getFields(false)}
          </Row>
          <Row gutter={40}>
            <FormItem
              label="Shipping Fee"
              name="shipping_fee"
              initialValue={20}
            >
              <Input placeholder="Shipping Fee" />
            </FormItem>
          </Row>
        </Card>

        <Card title="Calculate">
          <Row gutter={40}>
            <Col span="12">
              <Card title="Minh">
                <Row gutter={40}>{getFields(true, "M")}</Row>

                {getList(totalRevenueOfM, totalOriginOfM, totalProfitOfM)}
              </Card>
            </Col>
            <Col span="12">
              <Card title="KD">
                <Row gutter={40}>{getFields(true, "KD")}</Row>

                {getList(totalRevenueOfKD, totalOriginOfKD, totalProfitOfKD)}
              </Card>
            </Col>
          </Row>

          {getList(`${totalRevenueOfM + totalRevenueOfKD}`, `${totalOriginOfM + totalOriginOfKD}`, `${totalProfitOfM + totalProfitOfKD}/2 = ${(totalProfitOfM + totalProfitOfKD)/2}`)}
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit">Open bold</Button>
        </Form.Item>
      </Form>
    </WrapperStyle>
  );
};

export default Home;
