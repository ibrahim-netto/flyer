'use strict';

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}/ads`; // default value
    const adsPlacement = attr('data-ads-placement') || 'ads'; // default value

    const init = async () => {
        // Convert NodeList to Array
        const nodes = [...document.querySelectorAll(`*[data-${adsPlacement}]`)];
        const placements = nodes.map(node => node.dataset[adsPlacement]);
        const body = {
            href: location.href,
            language: navigator.language,
            placements
        };

        const { data: ads } = await fetch(serverUrl, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json());

        for (const ad of ads) {
            const node = nodes.find(v => v.dataset[adsPlacement] === ad.placement);

            if (node) {
                node.innerHTML = ad.placeholder.html;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();