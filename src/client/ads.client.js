'use strict';

const { ENDPOINT_NAME } = require('../constants');

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}`; // default value
    const adsPlacement = attr(`data-${ENDPOINT_NAME}-placement`) || ENDPOINT_NAME; // default value

    const init = async () => {
        // Convert NodeList to Array
        const nodes = [...document.querySelectorAll(`*[data-${adsPlacement}]`)];
        if (nodes.length === 0) return;

        const placements = nodes.map(node => node.dataset[adsPlacement]);

        const params = new URLSearchParams({
            href: location.href,
            language: navigator.language,
        });
        for (const placement of placements) {
            params.append('placements', placement);
        }
        const url = new URL(`${serverUrl}/api/${ENDPOINT_NAME}`);
        url.search = params;

        const { data } = await fetch(url, {
            method: 'get',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());

        for (const entry of data) {
            const node = nodes.find(v => v.dataset[adsPlacement] === entry.placement);

            if (node) {
                node.innerHTML = entry.placeholder.html;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();