import React from 'react';
import Plans from './components/Plans';
import AdminDashboard from './pages/AdminDashboard';
import Privacy from './pages/Privacy';

const App = () => {
    const path = window.location.pathname;

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            {path === '/admin' ? (
                <AdminDashboard />
            ) : path === '/privacy' ? (
                <Privacy />
            ) : (
                <>
                    {/* Navigation */}
                    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center">
                                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                        ServiçoPerto
                                    </span>
                                </div>
                                <div className="hidden md:flex space-x-8">
                                    <a href="/" className="text-gray-500 hover:text-gray-900 font-medium">Buscar Profissional</a>
                                    <a href="/provider/plans" className="text-blue-600 hover:text-blue-700 font-bold">Sou Prestador</a>
                                    <a href="/admin" className="text-gray-400 hover:text-gray-600 text-xs flex items-center">Admin</a>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main>
                        {path === '/provider/plans' ? (
                            <Plans />
                        ) : (
                            /* Hero Section for Home */
                            <div className="relative overflow-hidden">
                                <div className="max-w-7xl mx-auto">
                                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                            <div className="sm:text-center lg:text-left">
                                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                                    <span className="block xl:inline">O profissional certo,</span>{' '}
                                                    <span className="block text-blue-600 xl:inline">no bairro vizinho.</span>
                                                </h1>
                                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                                    Encontre eletricistas, encanadores e pintores de confiança a poucos metros de você. Sem intermediários, fale direto no WhatsApp.
                                                </p>
                                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                                    <div className="rounded-md shadow">
                                                        <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                                            Buscar Serviço
                                                        </a>
                                                    </div>
                                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                                        <a href="/provider/plans" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                                            Cadastrar meu Serviço
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </main>
                                    </div>
                                </div>
                                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
                                    {/* Placeholder for Hero Image */}
                                    <div className="text-gray-300 font-bold text-4xl">
                                        <img src="https://images.unsplash.com/photo-1581578731117-10d521d536fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Profissional" className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Simple Footer with Privacy Link */}
                    <footer className="bg-gray-50 border-t border-gray-100 py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} ServiçoPerto. Todos os direitos reservados.
                                <a href="/privacy" className="ml-4 text-blue-500 hover:underline">Política de Privacidade</a>
                            </p>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default App;
