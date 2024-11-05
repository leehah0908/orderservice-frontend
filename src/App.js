import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';

function App() {
    return (
        <div className='App'>
            <Header />
            <div className='content-wrapper'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/member/create' element={<Home />} />
                    <Route path='/login' element={<Home />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
