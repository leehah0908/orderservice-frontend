import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    Grid,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';
import CartContext from '../context/CartContext';

const ProductList = ({ pageTitle }) => {
    const [searchType, setSearchType] = useState('optional');
    const [searchValue, setSearchValue] = useState('');
    const [productList, setProductList] = useState([]);
    const [selected, setSelected] = useState({});

    const { userRole } = useContext(AuthContext);
    const { addCart } = useContext(CartContext);

    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        loadProduct();
    }, []);

    // 상품 목록을 백엔드에 요청하는 함수
    const loadProduct = async (number, size) => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/product/list`);
        const data = await res.json();
        console.log(data.result);
        setProductList(data.result);
    };

    // 장바구니 클릭 이벤트 핸들러
    const handleAddToCart = () => {
        // 특정 객체에서 key값만 뽑아서 문자열 배열로 리턴해주는 메서드
        const selectedProduct = Object.keys(selected);

        // key값만 뽑아서 selected에 들어있는 상품들 중에 false인 거 빼고 true인 것만 담겠다.
        const filtered = selectedProduct.filter((key) => selected[key]);

        const finalSelected = filtered.map((key) => {
            const product = productList.find((p) => p.productId === parseInt(key));
            return {
                productId: product.productId,
                productName: product.productName,
                quantity: product.quantity,
            };
        });

        console.log('최종 선택: ', finalSelected);

        if (finalSelected.length < 1) {
            alert('장바구니에 추가할 상품을 선택해 주세요!');
            return;
        }
        for (let p of finalSelected) {
            if (!p.quantity) {
                alert('수량이 0개인 상품은 담을 수 없습니다.');
                return;
            }
        }
        if (confirm('상품을 장바구니에 추가하시겠습니까?')) {
            // 카트로 상품을 보내주자.
            finalSelected.forEach((product) => addCart(product));
            alert('선택한 상품이 장바구니에 추가되었습니다.');
        }
    };

    // 체크박스 클릭 이벤트 핸들러
    const handleCheckboxChange = (productId, checked) => {
        // 사용자가 특정 상품을 선택했는지에 대한 상태를 관리 {상품 아이디, 체크 여부}
        setSelected((prevSelected) => ({
            ...prevSelected,
            [productId]: checked,
        }));
    };

    return (
        <Container>
            <Grid container justifyContent='space-between' spacing={2} className='mt-5'>
                <Grid item>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            loadProduct();
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item>
                                <Select value={searchType} onChange={(e) => setSearchType(e.target.value)} displayEmpty>
                                    <MenuItem value='optional'>선택</MenuItem>
                                    <MenuItem value='name'>상품명</MenuItem>
                                    <MenuItem value='category'>카테고리</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <TextField value={searchValue} onChange={(e) => setSearchValue(e.target.value)} label='Search' />
                            </Grid>
                            <Grid item>
                                <Button type='submit'>검색</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                {!isAdmin && (
                    <Grid item>
                        <Button onClick={handleAddToCart} color='secondary'>
                            장바구니
                        </Button>
                    </Grid>
                )}
                {isAdmin && (
                    <Grid item>
                        <Button href='/product/create' color='success'>
                            상품등록
                        </Button>
                    </Grid>
                )}
            </Grid>
            <Card>
                <CardContent>
                    <Typography variant='h6' align='center'>
                        {pageTitle}
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>제품사진</TableCell>
                                <TableCell>제품명</TableCell>
                                <TableCell>가격</TableCell>
                                <TableCell>재고수량</TableCell>
                                {!isAdmin && <TableCell>주문수량</TableCell>}
                                {!isAdmin && <TableCell>주문선택</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productList.map((product) => (
                                <TableRow key={product.productId}>
                                    <TableCell>
                                        <img
                                            src={product.productImage}
                                            alt={product.productName}
                                            style={{ height: '100px', width: 'auto' }}
                                        />
                                    </TableCell>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stockQuantity}</TableCell>
                                    {!isAdmin && (
                                        <TableCell>
                                            <TextField
                                                type='number'
                                                value={product.quantity || 0}
                                                onChange={(e) =>
                                                    // 사용자가 주문 수량을 올릴 때마다
                                                    // 상품 객체에 quantity라는 프로퍼티를 추가해서
                                                    // 추후에 장바구니에 담을 때 꺼내서 활용할 예정.
                                                    setProductList((prevList) =>
                                                        prevList.map((p) =>
                                                            p.productId === product.productId
                                                                ? { ...p, quantity: parseInt(e.target.value) }
                                                                : p,
                                                        ),
                                                    )
                                                }
                                                style={{ width: '70px' }}
                                                InputProps={{
                                                    inputProps: {
                                                        min: 0,
                                                        max: product.stockQuantity,
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {!isAdmin && (
                                        <TableCell>
                                            <Checkbox
                                                checked={!!selected[product.productId]}
                                                onChange={(e) => handleCheckboxChange(product.productId, e.target.checked)}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Container>
    );
};
export default ProductList;
