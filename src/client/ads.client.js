'use strict';

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}/ads`; // default value
    const adsPlaceholder = attr('data-ads-placeholder') || 'ads'; // default value

    const init = async () => {
        // Convert NodeList to Array
        const nodes = [...document.querySelectorAll(`*[data-${adsPlaceholder}]`)];
        const placeholders = nodes.map(node => node.dataset[adsPlaceholder]);
        const body = {
            href: location.href,
            language: navigator.language,
            placeholders
        };

        const { data: ads } = await fetch(serverUrl, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json());

        for (const ad of ads) {
            const node = nodes.find(v => v.dataset[adsPlaceholder] === ad.placeholder);

            if (node) {
                node.innerHTML = ad.html;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();