import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import { AuthContextProvider } from './context/UserContext';

function App() {
    return (
        <AuthContextProvider>
            <div className='App'>
                <Header />
                <div className='content-wrapper'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/member/create' element={<Signup />} />
                        <Route path='/login' element={<Login />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </AuthContextProvider>
    );
}

export default App;
