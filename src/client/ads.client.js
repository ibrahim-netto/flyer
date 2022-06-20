'use strict';

const camelCase = require('lodash.camelcase');
const { ENDPOINT_VERSION, ENDPOINT_NAME } = require('../constants');

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}`; // default value
    const placementAttr = `${ENDPOINT_NAME}-placement`;
    const filtersAttr = `${ENDPOINT_NAME}-filters`;

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
            /*
                A problem with sending analytics is that a site often wants to send analytics when the user
                has finished with a page: for example, when the user navigates to another page. In this situation
                the browser may be about to unload the page, and in that case the browser may choose not to send
                asynchronous XMLHttpRequest requests.
            */
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
        const placementAttrCamelCase = camelCase(placementAttr);
        const filtersAttrCamelCase = camelCase(filtersAttr);
        const placements = nodes.map(node => {
                const name = node.dataset[placementAttrCamelCase];
                const filters = node.dataset[filtersAttrCamelCase] ?
                    JSON.parse(node.dataset[filtersAttrCamelCase]) :
                    null;
                return { name, filters };
            }
        );

        const body = {
            placements
        };

        const url = `${serverUrl}/api/${ENDPOINT_VERSION}/${ENDPOINT_NAME}`;

        const { data } = await fetch(url, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json());

        for (const entry of data) {
            const node = nodes.find(v => v.dataset[placementAttrCamelCase] === entry.placement);

            if (node) {
                node.innerHTML = entry.html;
                node.addEventListener('click', onNodeClick(entry), true);
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