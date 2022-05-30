'use strict';

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}`; // default value
    const adsPlacement = attr('data-ads-placement') || 'ads'; // default value

    const init = async () => {
        // Convert NodeList to Array
        const nodes = [...document.querySelectorAll(`*[data-${adsPlacement}]`)];
        const placements = nodes.map(node => node.dataset[adsPlacement]);

        const params = new URLSearchParams({
            href: location.href,
            language: navigator.language,
        });
        for (const placement of placements) {
            params.append('placements', placement);
        }
        const url = new URL(`${serverUrl}/api/ads`);
        url.search = params;

        const { data: ads } = await fetch(url, {
            method: 'get',
            headers: {
                'content-type': 'application/json'
            }
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