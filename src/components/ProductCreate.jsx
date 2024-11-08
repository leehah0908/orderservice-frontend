import { Button, Card, CardContent, CardHeader, Container, Grid, TextField } from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios-config';
import AuthContext from '../context/UserContext';
import { handleAxiosError } from '../config/handleAxiosError';

const ProductCreate = () => {
    const navigate = useNavigate();
    const { onLogout } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [imageThumbnail, setImageThumbnail] = useState(null);
    const [productImage, setProductImage] = useState(null);

    // useRef()를 사용해서 특정 태그를 참조하기
    const $fileTag = useRef();

    // Form Submit 핸들러
    const productCreate = async (e) => {
        e.preventDefault();

        try {
            // form 데이터로 보내기 위한 FormData() 생성
            const registerData = new FormData();
            registerData.append('productName', name);
            registerData.append('category', category);
            registerData.append('price', price);
            registerData.append('stockQuantity', stockQuantity);
            registerData.append('productImage', productImage);

            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/product/create`, registerData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('상품 등록 완료');
            navigate('/product/list');
        } catch (e) {
            handleAxiosError(e, onLogout, navigate);
        }
    };

    const fileUpdate = (e) => {
        // 첨부된 파일 정보 얻기
        const file = $fileTag.current.files[0];

        // 보내는 이미지는 파일 그대로
        setProductImage(file);

        // 보여지는 이미지는 url로 읽어야 함
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setImageThumbnail(reader.result);
        };
    };

    return (
        <Container>
            <Grid container justifyContent='center'>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardHeader title='상품등록' style={{ textAlign: 'center' }} />
                        <CardContent>
                            <form onSubmit={productCreate}>
                                <div
                                    className='thumbnail-box'
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    onClick={() => $fileTag.current.click()}
                                >
                                    <img
                                        src={imageThumbnail || require('../assets/product-add.png')}
                                        alt='prod-img'
                                        style={{ maxWidth: '225px' }}
                                    />
                                </div>

                                <TextField
                                    label='상품명'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    required
                                />
                                <TextField
                                    label='카테고리'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    required
                                />
                                <TextField
                                    label='가격'
                                    type='number'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    required
                                />
                                <TextField
                                    label='재고수량'
                                    type='number'
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    required
                                />
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={fileUpdate}
                                    style={{ display: 'none' }}
                                    ref={$fileTag}
                                    required
                                />
                                <Button type='submit' color='primary' variant='contained' fullWidth>
                                    등록
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductCreate;
