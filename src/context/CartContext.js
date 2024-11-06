import { type } from '@testing-library/user-event/dist/type';
import React, { useReducer } from 'react';

// 리듀서 함수 정의
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CART':
            const existProduct = state.productsInCart.find((p) => p.productId === action.product.productId);

            let updatedProduct;
            let totalQuantity = (state.totalQuantity += action.product.quantity);

            if (existProduct) {
                // 상품이 이미 카트에 존재한다면
                // 다른 상품은 그대로 유지, id가 같은 상품의 quantity만 수정
                updatedProduct = state.productsInCart.map((p) =>
                    p.productId === action.product.productId ? { ...p, quantity: p.quantity + action.product.quantity } : p,
                );
            } else {
                // 상품이 처음 카트에 담기는 거라면
                updatedProduct = [...state.productsInCart, action.product];
            }

            // 세션 스토리지에 상태 저장
            // 로컬, 세션 스토리지에는 문자열만 저장할 수 있습니다. (객체, 배열은 저장 안됨)
            // JSON 문자열로 변환해서 객체, 배열을 저장
            sessionStorage.setItem('productsInCart', JSON.stringify(updatedProduct));
            sessionStorage.setItem('totalQuantity', totalQuantity);

            return {
                productsInCart: updatedProduct,
                totalQuantity,
            };

        case 'CLEAR_CART':
            sessionStorage.removeItem('productsInCart');
            sessionStorage.removeItem('totalQuantity');
            return {
                productsInCart: [],
                totalQuantity: 0,
            };
    }
};

// 새로운 Context 생성
const CartContext = React.createContext({
    productsInCart: [],
    totalQuantity: 0,
    addCart: () => {},
    clearCart: () => {},
});

export const CartContextProvider = (props) => {
    const [cartState, dispatch] = useReducer(cartReducer, {
        // JSON 문자열로 저정한 객체, 배열을 JS 타입으로 변환하는 JSON.parse()
        // 연산이 필요한 정보는 그 타입에 맞게 변환해야 합니다.
        productsInCart: JSON.parse(sessionStorage.getItem('productsInCart')) || [],
        totalQuantity: parseInt(sessionStorage.getItem('totalQuantity')) || 0,
    });

    const addCart = (product) => {
        dispatch({
            type: 'ADD_CART',
            product,
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    console.log(cartState);

    return (
        <CartContext.Provider
            value={{
                productsInCart: cartState.productsInCart,
                totalQuantity: cartState.totalQuantity,
                addCart,
                clearCart,
            }}
        >
            {props.children}
        </CartContext.Provider>
    );
};

export default CartContext;
