import {
    Button,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios-config';

const OrderPage = () => {
    const { onLogout } = useContext(AuthContext);
    const { productsInCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const orderCreate = async () => {
        const orderProducts = productsInCart.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
        }));

        if (orderProducts.lenth < 1) {
            alert('주문 목록이 비어있습니다.');
            return;
        }

        const yesOrNo = confirm(`${orderProducts.length}개의 상품을 주문하시겠습니까?`);

        if (!yesOrNo) {
            alert('주문이 취소되었습니다.');
            return;
        }

        // axios는 200번대 정상 응답이 아닌 모든 것을 예외로 처리하기 때문에 try, catch로 작성해야 함
        // fetch는 예외 발생X
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/order/create`, orderProducts);

            alert('주문이 완료되었습니다.');
            clearCart();
        } catch (e) {
            console.log(e);
            if (e.response.data?.statusMessage === 'EXPIRED_RT') {
                alert('시간이 경과되어 재 로그인이 필요합니다.');
                onLogout();
                navigate('/');
            } else if (e.response.data.message === 'NO_LOGIN') {
                alert('아예 로그인 X');
                navigate('/');
            }
        }
    };

    const removeCartItem = () => {
        if (confirm('장바구니를 비우겠습니까?')) {
            clearCart();
        }
    };

    return (
        <Container>
            <Grid container justifyContent='center' style={{ margin: '20px 0' }}>
                <Typography variant='h5'>장바구니 목록</Typography>
            </Grid>
            <Grid container justifyContent='space-between' style={{ marginBottom: '20px' }}>
                <Button onClick={removeCartItem} color='secondary' variant='contained'>
                    장바구니 비우기
                </Button>
                <Button onClick={orderCreate} color='primary' variant='contained'>
                    주문하기
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>제품ID</TableCell>
                            <TableCell>제품명</TableCell>
                            <TableCell>주문수량</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsInCart.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell>{product.productId}</TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
export default OrderPage;
