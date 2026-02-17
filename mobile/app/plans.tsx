import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouch = styled(TouchableOpacity);

import { Platform } from 'react-native';
import { CONFIG } from '../constants/Config';

const Plans = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);

    useEffect(() => {
        // Initialize RevenueCat
        const setup = async () => {
            try {
                const apiKey = Platform.OS === 'ios' ? CONFIG.REVENUECAT_APPLE_KEY : CONFIG.REVENUECAT_GOOGLE_KEY;
                Purchases.configure({ apiKey });

                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                console.log("RevenueCat setup error", e);
            }
        };
        setup();
    }, []);

    const tiers = [
        {
            id: 'trial',
            name: 'Teste Grátis',
            price: '30 Dias',
            subPrice: 'Depois R$ 49,90/mês',
            features: ['Acesso Completo', 'Sem Compromisso', 'Cancele Quando Quiser'],
            bgColor: 'bg-white',
            borderColor: 'border-blue-100',
            textColor: 'text-gray-900',
            btnColor: 'bg-blue-50',
            btnText: 'text-blue-600',
            popular: false,
            badge: null
        },
        {
            id: 'pro_monthly',
            name: 'Profissional',
            price: 'R$ 49,90',
            subPrice: '/mês',
            features: ['WhatsApp Direto', 'Selo Verificado', 'Galeria Ilimitada', 'Suporte Prioritário'],
            bgColor: 'bg-blue-600',
            borderColor: 'border-blue-500',
            textColor: 'text-white',
            btnColor: 'bg-white',
            btnText: 'text-blue-600',
            popular: true,
            badge: 'Melhor Custo-Benefício'
        },
        {
            id: 'premium_monthly',
            name: 'Premium',
            price: 'R$ 99,90',
            subPrice: '/mês',
            features: ['Topo das Buscas', 'Gestor Dedicado', 'Destaque na Newsletter', 'Relatórios Semanais'],
            bgColor: 'bg-slate-900',
            borderColor: 'border-amber-400',
            textColor: 'text-white',
            btnColor: 'bg-amber-400',
            btnText: 'text-slate-900',
            popular: false,
            badge: 'Exclusivo'
        }
    ];

    const handlePurchase = async (tier: any) => {
        if (tier.id === 'trial') {
            Alert.alert("Bem-vindo!", "Seus 30 dias de teste grátis começaram agora. Aproveite!");
            return;
        }

        setLoading(true);
        try {
            // Simulated IAP Flow
            // In a real app, you would find the package matching tier.id and call:
            // const { customerInfo } = await Purchases.purchasePackage(package);

            setTimeout(() => {
                setLoading(false);
                Alert.alert(
                    "Assinatura Iniciada",
                    "O Google Play / App Store irá processar seu pagamento. Assim que confirmado, seu acesso será liberado.",
                    [{ text: "OK", onPress: () => router.back() }]
                );
            }, 1000);
        } catch (e: any) {
            setLoading(false);
            if (!e.userCancelled) {
                Alert.alert("Erro", "Não foi possível processar a compra: " + e.message);
            }
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header with Back Button */}
            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <StyledText className="text-blue-600 font-bold text-lg">← Voltar</StyledText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/privacy')}>
                    <StyledText className="text-gray-400 text-sm font-medium">Privacidade</StyledText>
                </TouchableOpacity>
            </View>

            <View className="px-6 pb-6">
                <StyledText className="text-4xl font-extrabold text-gray-900 mb-2">
                    Escolha seu <Text className="text-blue-600">Plano</Text>
                </StyledText>
                <StyledText className="text-lg text-gray-500 font-medium">
                    Comece com 30 dias grátis. Cancele a qualquer momento.
                </StyledText>
            </View>

            <View className="px-4 space-y-6">
                {tiers.map((tier) => (
                    <StyledView
                        key={tier.id}
                        className={`p-6 rounded-3xl shadow-lg ${tier.bgColor} border ${tier.borderColor} relative overflow-hidden`}
                        style={{ elevation: 5 }}
                    >
                        {tier.popular && (
                            <StyledView className="absolute top-0 right-0 bg-blue-500 px-4 py-1 rounded-bl-2xl">
                                <StyledText className="text-white text-xs font-bold uppercase tracking-wider">Popular</StyledText>
                            </StyledView>
                        )}
                        {tier.badge && !tier.popular && (
                            <StyledView className="absolute top-0 right-0 bg-amber-400 px-4 py-1 rounded-bl-2xl">
                                <StyledText className="text-slate-900 text-xs font-bold uppercase tracking-wider">{tier.badge}</StyledText>
                            </StyledView>
                        )}

                        <View>
                            <StyledText className={`text-lg font-medium mb-1 opacity-80 ${tier.textColor}`}>
                                {tier.name}
                            </StyledText>
                            <View className="flex-row items-baseline">
                                <StyledText className={`text-4xl font-extrabold ${tier.textColor}`}>
                                    {tier.price}
                                </StyledText>
                                <StyledText className={`text-lg font-medium ml-1 opacity-80 ${tier.textColor}`}>
                                    {tier.subPrice}
                                </StyledText>
                            </View>
                        </View>

                        <View className="mt-6 space-y-3">
                            {tier.features.map((feature, idx) => (
                                <View key={idx} className="flex-row items-center">
                                    <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${tier.id === 'pro_monthly' ? 'bg-blue-400/30' : 'bg-green-500/20'}`}>
                                        <StyledText className={`text-xs font-bold ${tier.id === 'pro_monthly' || tier.id === 'premium_monthly' ? 'text-white' : 'text-green-600'}`}>✓</StyledText>
                                    </View>
                                    <StyledText className={`text-base font-medium ${tier.textColor} opacity-90`}>
                                        {feature}
                                    </StyledText>
                                </View>
                            ))}
                        </View>

                        <StyledTouch
                            onPress={() => handlePurchase(tier)}
                            disabled={loading}
                            className={`mt-8 py-4 rounded-2xl items-center ${tier.btnColor} shadow-sm`}
                        >
                            {loading ? (
                                <ActivityIndicator color={tier.id === 'pro_monthly' || tier.id === 'premium_monthly' ? '#fff' : '#2563eb'} />
                            ) : (
                                <StyledText className={`font-bold text-base ${tier.btnText} uppercase tracking-wide`}>
                                    {tier.id === 'trial' ? 'Começar Teste de 30 Dias' : 'Assinar Agora'}
                                </StyledText>
                            )}
                        </StyledTouch>
                    </StyledView>
                ))}
            </View>

            <View className="mt-10 px-6 items-center">
                <StyledText className="text-gray-400 text-xs text-center leading-relaxed">
                    As assinaturas serão cobradas através da sua conta da loja de aplicativos. Você pode cancelar a qualquer momento nas configurações da sua conta.
                </StyledText>
            </View>
        </ScrollView>
    );
};

export default Plans;
