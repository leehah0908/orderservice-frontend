import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { NotificationAdd } from '@mui/icons-material';

const Header = () => {
    const { isLoggedIn, userRole, onLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [liveQuantity, setLiveQuantity] = useState(0); // 실시간 주문 수
    const [message, setMessage] = useState('');

    const handelLogout = () => {
        onLogout();
        alert('로그아웃되었습니다.');
        navigate('/');
    };

    useEffect(() => {
        if (userRole === 'ADMIN') {
            // 알림을 받기 위해 서버에 연결 요청 (/subscribe)
            const sse = new EventSourcePolyfill(`${process.env.REACT_APP_API_BASE_URL}/subscribe`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` },
            });

            sse.addEventListener('connect', (event) => {
                console.log(event);
            });

            // 30초마다 발생하는 알림 (연결 유지하기 위해)
            sse.addEventListener('heartbeat', (event) => {});

            sse.addEventListener('ordered', (event) => {
                const orderData = JSON.parse(event.data);
                setLiveQuantity((prev) => prev + 1);
                setMessage(orderData.userEmail + '님이 주문하였습니다.');
            });

            sse.onerror = (error) => {
                console.error(error);
                sse.close();
            };
        }
    }, [userRole]);

    return (
        <AppBar position='static'>
            <Toolbar>
                <Container>
                    <Grid container alignItems='center'>
                        {/* 왼쪽 메뉴 (관리자용) */}
                        <Grid
                            item
                            xs={4}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            {userRole === 'ADMIN' && (
                                <>
                                    <Button color='inherit' component={Link} to='/member/list'>
                                        회원관리
                                    </Button>
                                    <Button color='inherit' component={Link} to='/product/manage'>
                                        상품관리
                                    </Button>
                                    <Button color='inherit' href='/order/list'>
                                        실시간주문
                                        <NotificationAdd /> ({liveQuantity}) {message}
                                    </Button>
                                </>
                            )}
                        </Grid>

                        {/* 가운데 메뉴 */}
                        <Grid item xs={4} style={{ textAlign: 'center' }}>
                            <Button color='inherit' component={Link} to='/'>
                                <Typography variant='h6'>My Shop</Typography>
                            </Button>
                        </Grid>

                        {/* 오른쪽 메뉴 (사용자용) */}
                        <Grid
                            item
                            xs={4}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {isLoggedIn && (
                                <>
                                    <Button color='inherit' component={Link} to='/order/cart'>
                                        장바구니
                                    </Button>
                                    <Button color='inherit' component={Link} to='/mypage'>
                                        마이페이지
                                    </Button>
                                </>
                            )}

                            <Button color='inherit' component={Link} to='/product/list'>
                                상품 목록
                            </Button>

                            {!isLoggedIn && (
                                <>
                                    <Button color='inherit' component={Link} to='/member/create'>
                                        회원가입
                                    </Button>
                                    <Button color='inherit' component={Link} to='/login'>
                                        로그인
                                    </Button>
                                </>
                            )}

                            {isLoggedIn && (
                                <Button color='inherit' onClick={handelLogout}>
                                    로그아웃
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
