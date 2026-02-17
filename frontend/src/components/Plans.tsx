import React, { useEffect, useState } from 'react';
import api from '../api';
import { useIAP } from '../hooks/useIAP';

const Plans = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const { purchase, loading } = useIAP();

    // Fallback data for preview if API fails
    const defaultPlans = [
        {
            id: 'free',
            name: 'Gratuito',
            price: 0,
            features: { 'Listagem Simples': true, 'Sem WhatsApp Direto': true, '1 Foto': true }
        },
        {
            id: 'pro',
            name: 'Profissional',
            price: 49.90,
            features: { 'Destaque na Busca': true, 'WhatsApp Direto': true, 'Selo Verificado': true, 'Galeria Ilimitada': true },
            isPopular: true
        }
    ];

    useEffect(() => {
        api.get('/plans')
            .then((res) => setPlans(res.data.length ? res.data : defaultPlans))
            .catch(() => setPlans(defaultPlans));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Seja um Parceiro</h2>
                <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Escolha o plano ideal para o seu negócio
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    Destaque-se na sua região e receba contatos direto no seu WhatsApp.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl shadow-xl bg-white border-2 flex flex-col p-8 transition-transform transform hover:scale-105 ${plan.isPopular ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-transparent'}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-5xl font-extrabold tracking-tight">
                                    R$ {plan.price.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">/mês</span>
                            </p>
                        </div>

                        <ul className="flex-1 space-y-4 mb-8">
                            {Object.keys(plan.features).map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${plan.price > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <svg className={`h-4 w-4 ${plan.price > 0 ? 'text-green-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-base text-gray-700 font-medium">{feature}</p>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => purchase(plan.google_id || plan.id)}
                            disabled={loading}
                            className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-colors shadow-lg ${plan.price > 0
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {loading ? 'Processando...' : plan.price > 0 ? 'Começar Agora' : 'Continuar Grátis'}
                        </button>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-sm text-gray-500 text-center">
                Pagamento seguro via Google Play, App Store ou Cartão de Crédito. <br />
                Você pode cancelar a qualquer momento nas configurações da sua conta.
            </p>
        </div>
    );
};

export default Plans;
