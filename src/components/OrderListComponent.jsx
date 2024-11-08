import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../config/axios-config';
import AuthContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { handleAxiosError } from '../config/handleAxiosError';

const OrderListComponent = ({ isAdmin }) => {
    const [orderList, setOrderList] = useState([]);
    const { onLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const url = isAdmin ? '/order/list' : '/order/myorder';
            try {
                const res = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}${url}`);
                setOrderList(res.data.result);
            } catch (e) {
                handleAxiosError(e, onLogout, navigate);
            }
        };

        fetchOrders();
    }, []);

    const cancelOrder = async (orderId) => {
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/order/${orderId}/cancel`);

            // 주문 취소를 백엔드로 보내고, 이상이 없으면 주문 목록을 다시 랜더링해야 함
            setOrderList((prevList) => {
                return prevList.map((order) => (order.orderId === orderId ? { ...order, orderStatus: 'CANCELED' } : order));
            });
        } catch (e) {
            handleAxiosError(e, onLogout, navigate);
        }
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>회원 EMAIL</TableCell>
                        <TableCell>주문상태</TableCell>
                        <TableCell>액션</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderList.map((order) => (
                        <React.Fragment key={order.orderId}>
                            <TableRow>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>{order.userEmail}</TableCell>
                                <TableCell>{order.orderStatus}</TableCell>
                                <TableCell>
                                    {isAdmin && order.orderStatus === 'ORDERED' && (
                                        <Button color='secondary' onClick={() => cancelOrder(order.orderId)} size='small'>
                                            CANCEL
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                            {/* 확장된 행 (주문 세부 사항) */}
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>주문 세부 사항 (클릭 시 열립니다!)</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <ul>
                                                {order.orderDetail.map((orderItem) => (
                                                    <li key={orderItem.id}>
                                                        {orderItem.productName} - {orderItem.count} 개
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionDetails>
                                    </Accordion>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrderListComponent;
