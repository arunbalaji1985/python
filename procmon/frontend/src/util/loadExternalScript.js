import { useEffect } from 'react';

export default function loadExternalScript({ url, integrity }) {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    if (integrity) {
        script.setAttribute("integrity", integrity);
    }
    script.setAttribute("crossorigin",  "anonymous");
    head.appendChild(script);

    // return () => {
    //     head.removeChild(script);
    // };
};
