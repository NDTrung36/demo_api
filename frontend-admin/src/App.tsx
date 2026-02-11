import { Routes, Route } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#001529',
                    padding: '0 24px',
                }}
            >
                <DashboardOutlined style={{ color: '#fff', fontSize: 20, marginRight: 12 }} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                    Flight Booking Admin
                </Title>
            </Header>
            <Content style={{ padding: 24 }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Content>
        </Layout>
    );
}

function Dashboard() {
    return (
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <Title level={2}>🛫 Admin Dashboard</Title>
            <Typography.Text type="secondary">
                Manage flights, bookings, users, and ancillary services.
            </Typography.Text>
        </div>
    );
}

export default App;
