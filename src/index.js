import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 라우터를 사용하려는 컴포넌트를 BrowserRouter로 감싸줘야 함
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
