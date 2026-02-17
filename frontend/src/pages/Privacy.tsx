import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Política de Privacidade</h1>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">1. Coleta de Informações</h2>
                    <p className="text-gray-600 leading-relaxed">
                        No ServiçoPerto, levamos a sua privacidade a sério. Coletamos apenas informações essenciais para o funcionamento do serviço, como nome, e-mail e dados de contato que você opta por compartilhar ao se cadastrar.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">2. Uso de Dados</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Seus dados são utilizados exclusivamente para conectar prestadores de serviços a clientes. Não vendemos ou compartilhamos suas informações pessoais com terceiros para fins publicitários.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">3. Localização</h2>
                    <p className="text-gray-600 leading-relaxed">
                        O app utiliza sua localização para mostrar profissionais próximos a você. Esses dados são processados em tempo real e não são armazenados de forma a rastrear seus movimentos históricos.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">4. Seus Direitos</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Você pode solicitar a exclusão de sua conta e de todos os seus dados a qualquer momento através das configurações do aplicativo ou entrando em contato com nosso suporte.
                    </p>
                </section>

                <footer className="mt-12 pt-8 border-t text-sm text-gray-400">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
