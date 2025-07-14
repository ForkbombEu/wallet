import { writable } from 'svelte/store';
import type { Service } from './components/organisms/scanner/tools';
import { getStructuredPreferences, setStructuredPreferences } from './preferences'; // adjust path as needed

const STORE_KEY = 'credentialOfferStore';

function createCredentialOfferStore() {
    const { subscribe, set, update } = writable<Service | undefined>(undefined);

    // Load persisted value on initialization
    getStructuredPreferences<Service>(STORE_KEY).then((value) => {
        if (value) set(value);
    });

    return {
        subscribe,
        set: (value: Service | undefined) => {
            set(value);
            if (value) {
                setStructuredPreferences<Service>(STORE_KEY, value);
            } else {
                setStructuredPreferences<Service | undefined>(STORE_KEY, undefined);
            }
        },
        update: (updater: (value: Service | undefined) => Service | undefined) => {
            update((current) => {
                const updated = updater(current);
                if (updated) {
                    setStructuredPreferences<Service>(STORE_KEY, updated);
                } else {
                    setStructuredPreferences<Service | undefined>(STORE_KEY, undefined);
                }
                return updated;
            });
        }
    };
}

export const credentialOfferStore = createCredentialOfferStore();
