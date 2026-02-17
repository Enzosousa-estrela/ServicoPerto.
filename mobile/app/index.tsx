import { Link, Stack, useRouter } from 'expo-router';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouch = styled(TouchableOpacity);

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View className="px-6 py-4 flex-row justify-between items-center bg-slate-900/80 blur-md sticky top-0 z-50">
                    <StyledText className="text-blue-500 font-extrabold text-2xl tracking-tight">
                        Serviço<StyledText className="text-white">Perto</StyledText>
                    </StyledText>
                    <StyledView className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center border border-blue-400">
                        <StyledText className="text-white font-bold text-sm">EL</StyledText>
                    </StyledView>
                </View>

                {/* Hero Section */}
                <View className="px-6 pt-6 pb-8">
                    <StyledText className="text-4xl font-extrabold text-white leading-tight">
                        Encontre <StyledText className="text-blue-500">profissionais</StyledText>{"\n"}
                        perto de você.
                    </StyledText>
                    <StyledText className="mt-4 text-lg text-slate-400 font-medium leading-relaxed">
                        Eletricistas, encanadores e muito mais a um toque de distância.
                    </StyledText>

                    {/* Action Buttons */}
                    <View className="mt-8 space-y-4">
                        <StyledTouch
                            className="w-full bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-900/50 flex-row items-center justify-center space-x-2"
                            activeOpacity={0.9}
                        >
                            {/* Simple icon representation */}
                            <StyledText className="text-white font-bold text-lg">🔍 Buscar no Mapa</StyledText>
                        </StyledTouch>

                        <StyledTouch
                            onPress={() => router.push('/plans')}
                            className="w-full bg-white py-4 rounded-2xl shadow-sm flex-row items-center justify-center space-x-2"
                            activeOpacity={0.9}
                        >
                            <StyledText className="text-slate-900 font-bold text-lg">Sou Profissional</StyledText>
                        </StyledTouch>
                    </View>
                </View>

                {/* Results Simulation (Static for now) */}
                <View className="px-6 mt-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <StyledText className="font-bold text-white text-lg">Resultados Próximos</StyledText>
                        <StyledView className="bg-green-900/40 px-3 py-1 rounded-full border border-green-800">
                            <StyledText className="text-xs font-bold text-green-400">● Ao vivo</StyledText>
                        </StyledView>
                    </View>

                    <View className="space-y-4">
                        {/* Provider 1 */}
                        <StyledView className="bg-slate-800 p-4 rounded-3xl border border-slate-700 flex-row items-center space-x-4">
                            <View className="w-14 h-14 bg-slate-600 rounded-2xl" />
                            <View className="flex-1">
                                <StyledText className="font-bold text-white text-lg">Carlos Silva</StyledText>
                                <View className="flex-row items-center space-x-2 mt-1">
                                    <StyledView className="bg-blue-900/50 px-2 py-0.5 rounded">
                                        <StyledText className="text-blue-400 text-xs font-bold">Eletricista</StyledText>
                                    </StyledView>
                                    <StyledText className="text-amber-400 text-xs font-bold">★ 4.9</StyledText>
                                </View>
                            </View>
                            <StyledText className="text-xs font-bold text-slate-500">0.8km</StyledText>
                        </StyledView>

                        {/* Provider 2 */}
                        <StyledView className="bg-slate-800 p-4 rounded-3xl border border-slate-700 flex-row items-center space-x-4">
                            <View className="w-14 h-14 bg-slate-600 rounded-2xl" />
                            <View className="flex-1">
                                <StyledText className="font-bold text-white text-lg">João Souza</StyledText>
                                <View className="flex-row items-center space-x-2 mt-1">
                                    <StyledView className="bg-slate-700 px-2 py-0.5 rounded">
                                        <StyledText className="text-slate-300 text-xs font-bold">Encanador</StyledText>
                                    </StyledView>
                                    <StyledText className="text-amber-400 text-xs font-bold">★ 4.8</StyledText>
                                </View>
                            </View>
                            <StyledText className="text-xs font-bold text-slate-500">1.2km</StyledText>
                        </StyledView>
                    </View>
                </View>

                {/* Categories */}
                <View className="px-6 py-8">
                    <StyledText className="text-lg font-bold text-white mb-4">Categorias</StyledText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-0">
                        {['Elétrica', 'Hidráulica', 'Pintura', 'Limpeza'].map((cat, i) => (
                            <StyledView key={cat} className={`items-center mr-4 ${i === 0 ? 'ml-0' : ''}`}>
                                <StyledView className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-3xl items-center justify-center mb-2">
                                    <StyledText className="text-2xl">{i === 0 ? '⚡' : i === 1 ? '🔧' : i === 2 ? '🎨' : '🧹'}</StyledText>
                                </StyledView>
                                <StyledText className="text-xs font-bold text-slate-500">{cat}</StyledText>
                            </StyledView>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
