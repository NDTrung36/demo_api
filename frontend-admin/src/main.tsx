import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const antdTheme = {
    token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    },
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConfigProvider theme={antdTheme}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConfigProvider>
        </QueryClientProvider>
    </StrictMode>,
);
