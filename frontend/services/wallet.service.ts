import { api } from '@/api/axios';

export const getWalletData = async (page: number) => {
    const response = await api.get(`/wallet?page=${page}`);
    return response.data;
}

export const createRazorpayOrder = async (amount: number) => {
    const response = await api.post('/wallet/create-order', { amount });
    return response.data;
};

export const verifyPayment = async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string, amount: number }) => {
    const response = await api.post('/wallet/verify-payment', data);
    return response.data;
};