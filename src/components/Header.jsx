import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/UserContext';

const Header = () => {
    const { isLoggedIn, userRole, onLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handelLogout = () => {
        onLogout();
        alert('로그아웃되었습니다.');
        navigate('/');
    };

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
                                        {/* 실시간주문 ({liveQuantity}) */}
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
