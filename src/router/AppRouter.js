import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Signup from '../components/Signup';
import Login from '../components/Login';
import ProductList from '../components/ProductList';
import OrderPage from '../components/OrderPage';
import Mypage from '../components/Mypage';
import ProductCreate from '../components/ProductCreate';
import PrivateRouter from './PrivateRouter';

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/member/create' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/product/list' element={<ProductList />} />
            <Route path='/order/cart' element={<OrderPage />} />
            <Route path='/mypage' element={<PrivateRouter element={<Mypage />} />} />
            <Route path='/product/manage' element={<PrivateRouter element={<ProductCreate />} requiredRole='ADMIN' />} />
        </Routes>
    );
};

export default AppRouter;
