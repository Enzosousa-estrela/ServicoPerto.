import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledText = styled(Text);

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <StyledText className="text-blue-500 text-lg font-bold">← Voltar</StyledText>
                </TouchableOpacity>
                <StyledText className="text-xl font-bold text-white">Política de Privacidade</StyledText>
            </View>
            <ScrollView className="flex-1 px-6 py-4">
                <StyledText className="text-slate-300 text-base leading-relaxed mb-4">
                    A sua privacidade é importante para nós. É política do ServiçoPerto respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo ServiçoPerto.
                </StyledText>
                <StyledText className="text-white font-bold text-lg mb-2">1. Coleta de Informações</StyledText>
                <StyledText className="text-slate-300 text-base leading-relaxed mb-4">
                    Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
                </StyledText>
                <StyledText className="text-white font-bold text-lg mb-2">2. Uso das Informações</StyledText>
                <StyledText className="text-slate-300 text-base leading-relaxed mb-4">
                    Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                </StyledText>
                <StyledText className="text-slate-300 text-base leading-relaxed mb-8">
                    O uso continuado de nosso aplicativo será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais.
                </StyledText>
            </ScrollView>
        </SafeAreaView>
    );
}
