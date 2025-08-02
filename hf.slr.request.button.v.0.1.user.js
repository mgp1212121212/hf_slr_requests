// ==UserScript==
// @name         HF SLR REQUEST BUTTON
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract scene info and open a prefilled link
// @match        https://www.sexlikereal.com/scenes/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Utility: Encode and truncate
    const sanitize = (str, maxLen = 1000) => {
        if (!str) return '';
        return encodeURIComponent(str.trim().substring(0, maxLen));
    };

    // Add button to bottom right
    const button = document.createElement('button');
button.innerHTML = `
    <div style="position: relative; width: 24px; height: 24px;">
        <img src="https://www.happyfappy.org/favicon.ico?v=1612648267" style="width: 24px; height: 24px;">
        <span style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; font-weight: bold; font-size: 16px; text-align: center; line-height: 24px; color: black;">Rq</span>
    </div>
`;



    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '4px',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        try {
            const titleElem = document.querySelector('[data-qa="scene-title"]');
            const studioElem = document.querySelector('[data-qa="page-scene-studio-name"]');
            const descElem = document.querySelector('[data-qa="scene-about-tab-text"]');
            const actressElem = document.querySelector('[data-qa="scene-model-list-item-name"]');
            const dateElem = document.querySelector('[data-qa="page-scene-studio-date"]');

            const title = sanitize(titleElem?.textContent, 200);
            const studio = sanitize(studioElem?.textContent, 100);
            const description = sanitize(descElem?.textContent, 1000);
            const actress = sanitize(actressElem?.textContent, 100);
            const date = sanitize(dateElem?.getAttribute('datetime') || '');
            const slr_url = encodeURIComponent(window.location.href);
            const actress_tag = actress.replace(/%20/g, '.').toLowerCase();
            const studio_tag = studio.replace(/%20/g, '.').toLowerCase();

            const baseUrl = 'https://www.happyfappy.org/requests.php?action=new&category=7';
            const fullUrl = `${baseUrl}&title=[SLR-${studio}]+${actress}+-+${title}+[K]&studio=${studio}&description=${slr_url}%0A%0A${description}%0A%0AThank you&actress=${actress}&date=${date}&url=${slr_url}&amount_box=50&tags=sexlikereal.com+virtual.reality+${actress_tag}+${studio_tag}`;


            window.open(fullUrl, '_blank');
        } catch (e) {
            alert('Failed to extract scene info.');
            console.error('Tampermonkey script error:', e);
        }
    });
})();