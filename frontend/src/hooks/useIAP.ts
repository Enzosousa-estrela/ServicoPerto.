import { useState, useEffect } from 'react';
import api from '../api';

// Mock types for simple demonstration
interface Product {
    id: string;
    price: string;
}

export const useIAP = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Detect Platform
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const purchase = async (sku: string) => {
        setLoading(true);
        try {
            if (isAndroid) {
                // Native Bridge Call (Mock)
                // In real app: window.AndroidInterface.buy(sku);
                console.log('Initiating Google Play Purchase for', sku);

                // Mock success callback from Native
                const purchaseToken = `mock_token_${Date.now()}`;
                await verifyPurchase('GOOGLE', sku, purchaseToken);
            } else if (isIOS) {
                console.log('Initiating Apple StoreKit Purchase for', sku);
            } else {
                // Web Fallback
                const response = await api.post('/subscriptions/checkout', { plan_id: sku });
                window.location.href = response.data.checkoutUrl;
            }
        } catch (error) {
            console.error('Purchase failed', error);
            alert('Erro na compra. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const verifyPurchase = async (platform: string, productId: string, token: string) => {
        try {
            await api.post('/iap/verify', {
                platform,
                productId,
                receipt: token,
                providerId: 'current_user_id', // Should come from Auth Context
            });
            alert('Assinatura ativada com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error('Verification failed', error);
            alert('Falha ao validar compra. Contate o suporte.');
        }
    };

    return { purchase, loading, isAndroid, isIOS };
};
