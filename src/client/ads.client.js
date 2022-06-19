'use strict';

const camelCase = require('lodash.camelcase');
const ENDPOINT_NAME = require('../constants').ENDPOINT_NAME;

(() => {
    const script = document.currentScript;
    const attr = script.getAttribute.bind(script);

    const serverUrl = attr('data-server-url') || `${location.origin}`; // default value
    const placementAttr = `${ENDPOINT_NAME}-placement`;
    const filtersAttr = `${ENDPOINT_NAME}-filters`;

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

        const url = new URL(`${serverUrl}/api/v1/${ENDPOINT_NAME}`);

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