import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ProductList from './components/ProductList';
import OrderPage from './components/OrderPage';
import Mypage from './components/Mypage';
import { AuthContextProvider } from './context/UserContext';
import { CartContextProvider } from './context/CartContext';

function App() {
    return (
        <AuthContextProvider>
            <CartContextProvider>
                <div className='App'>
                    <Header />
                    <div className='content-wrapper'>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/member/create' element={<Signup />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/product/list' element={<ProductList />} />
                            <Route path='/order/cart' element={<OrderPage />} />
                            <Route path='/mypage' element={<Mypage />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </CartContextProvider>
        </AuthContextProvider>
    );
}

export default App;
