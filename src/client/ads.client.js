'use strict';

const camelCase = require('lodash.camelcase');
const { ENDPOINT_VERSION, ENDPOINT_NAME } = require('../constants');

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}`; // default value
    const placementAttr = `${ENDPOINT_NAME}-placement`;
    const filtersAttr = `${ENDPOINT_NAME}-filters`;

    const style = document.createElement('style');
    style.innerHTML = `
        a.${ENDPOINT_NAME}, 
        a.${ENDPOINT_NAME}:hover, 
        a.${ENDPOINT_NAME}:focus, 
        a.${ENDPOINT_NAME}:active {
            text-decoration: none;
            color: inherit;
        }
    `;
    document.head.appendChild(style);

    const onNodeClick = (ad) => {
        const url = `${serverUrl}/api/${ENDPOINT_VERSION}/click`;

        return async () => {
            const body = {
                ad: {
                    id: ad.id,
                    name: ad.name,
                    placement: ad.placement
                },
                url: location.href,
                referrer: document.referrer
            };

            const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
            const queued = navigator.sendBeacon(url, blob);

            return (queued)
                ? { status: 'success', event_id: 'sendBeacon' }
                : { status: 'error', message: 'User agent failed to queue the data transfer' };
        }
    };

    const init = async () => {
        // Convert NodeList to Array
        const nodes = [...document.querySelectorAll(`*[data-${placementAttr}]`)];
        if (nodes.length === 0) return;

        /*
            HTMLElement.dataset

            Name conversion dash-style to camelCase conversion
            A custom data attribute name is transformed to a key for the DOMStringMap entry.
         */
        const params = new URLSearchParams();
        const placementAttrCamelCase = camelCase(placementAttr);
        const filtersAttrCamelCase = camelCase(filtersAttr);

        nodes.map(node => {
                const name = node.dataset[placementAttrCamelCase];
                const filters = node.dataset[filtersAttrCamelCase] || '';

                params.append('name', name);
                params.append('filters', filters);
                return { name, filters };
            }
        );

        const url = new URL(`${serverUrl}/api/${ENDPOINT_VERSION}/${ENDPOINT_NAME}`);
        url.search = params.toString();

        const { data } = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());

        for (const entry of data) {
            const node = nodes.find(v => v.dataset[placementAttrCamelCase] === entry.placement);

            if (node) {
                const id = entry.id;
                const href = `${serverUrl}/api/${ENDPOINT_VERSION}/${ENDPOINT_NAME}/${id}/click`;
                node.innerHTML = `<a class="${ENDPOINT_NAME}" href="${href}" referrerpolicy="origin">${entry.html}</a>`;
            }
        }
    };

    if (document.readyState === 'complete' ||
        document.readyState === 'loaded' ||
        document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            init();
        });
    }
})();