import { useEffect, useState } from 'react';
import Purchases, { PurchasesPackage, CustomerInfo, API_KEYS } from 'react-native-purchases';
import { Platform } from 'react-native';

const APIKeys = {
    apple: "appl_your_apple_api_key", // Replace with actual key from RevenueCat
    google: "goog_your_google_api_key", // Replace with actual key from RevenueCat
};

export const useIAP = () => {
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isPro, setIsPro] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (Platform.OS === 'ios') {
                await Purchases.configure({ apiKey: APIKeys.apple });
            } else if (Platform.OS === 'android') {
                await Purchases.configure({ apiKey: APIKeys.google });
            }

            try {
                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                console.error("Error fetching offerings", e);
            }

            try {
                const customerInfo = await Purchases.getCustomerInfo();
                setCustomerInfo(customerInfo);
                updateEntitlements(customerInfo);
            } catch (e) {
                console.error("Error fetching customer info", e);
            }
        };

        init();
    }, []);

    const updateEntitlements = (info: CustomerInfo) => {
        setIsPro(typeof info.entitlements.active['pro'] !== "undefined");
        setIsPremium(typeof info.entitlements.active['premium'] !== "undefined");
    };

    const purchase = async (pack: PurchasesPackage) => {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            setCustomerInfo(customerInfo);
            updateEntitlements(customerInfo);
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error("Purchase error", e);
            }
        }
    };

    const restore = async () => {
        try {
            const info = await Purchases.restorePurchases();
            setCustomerInfo(info);
            updateEntitlements(info);
        } catch (e) {
            console.error("Restore error", e);
        }
    }

    return { packages, isPro, isPremium, purchase, restore };
};
