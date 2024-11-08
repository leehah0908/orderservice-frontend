import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { AuthContextProvider } from './context/UserContext';
import { CartContextProvider } from './context/CartContext';
import AppRouter from './router/AppRouter';

function App() {
    return (
        <AuthContextProvider>
            <CartContextProvider>
                <div className='App'>
                    <Header />
                    <div className='content-wrapper'>
                        <AppRouter />
                    </div>
                    <Footer />
                </div>
            </CartContextProvider>
        </AuthContextProvider>
    );
}

export default App;
