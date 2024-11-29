import Script from 'next/script';
import { useEffect } from 'react';

const GTM_CODE = 'GTM-5XDMSHB';

const loadGTM = () => {
    (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        const dl = l !== 'dataLayer' ? `&l=${l}` : '';
        j.async = true;
        j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_CODE);
};

export const GTM = () => {
    useEffect(() => {
        const checkVWO = () => {
            if (window.VWO) {
                loadGTM();
                clearInterval(checkVWOInterval);
            }
        };

        const checkVWOInterval = setInterval(checkVWO, 300);

        return () => clearInterval(checkVWOInterval); // Limpa o intervalo ao desmontar
    }, []);

    return (
        <Script strategy="afterInteractive" id="gtm" />
    );
};