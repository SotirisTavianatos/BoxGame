import "./styles/main.css";
import "./font/Lato/Lato.css";
import WebFont from "webfontloader";
import App from "./App";
import assets from "./assets";

const loadApp = (props) => {
    const canvas = document.getElementById("game-canvas");
    new App({ ...props, canvas });
};

const props = { x: 0, y: 0, width: 1334, height: 750, assets, antialias: true };

const webFontConfig = {
    custom: {
        families: [ "Lato-Hairline" ]
    },
    timeout: 2000,
    active: () => {
        props[ "fontFamily" ] = "Lato-Hairline";
        loadApp(props);
    },
    inactive: () => {
        loadApp(props);
    }
};

WebFont.load(webFontConfig);
