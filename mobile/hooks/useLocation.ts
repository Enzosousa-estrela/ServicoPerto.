import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permissão de acesso à localização foi negada.');
                    Alert.alert("Permissão necessária", "Precisamos da sua localização para encontrar profissionais próximos.");
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error) {
                setErrorMsg('Erro ao obter localização.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { location, errorMsg, loading };
};
