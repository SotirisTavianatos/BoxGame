import { isMobile } from "@pixi/utils";

/**
 * @typedef {Object} CanvasResize - Canvas resize properties
 * @property {string} nextStyleWidth - The style width of canvas.
 * @property {string} nextStyleHeight - The style height of canvas.
 * @property {number} nextWidth - The width of canvas.
 * @property {number} nextHeight - The height of canvas.
 */
let _targetWidth;
let _targetHeight;
let _resizeCanvas;
let _onResize;
let _app;
/**
 * @function module:Application.ResizeHandler._getSize
 * @private
 * @return {CanvasResize} - Canvas resize properties
 */
function _getSize() {
    let size;
    if (
        isMobile.apple.device ||
        isMobile.apple.tablet ||
        isMobile.apple.phone ||
        isMobile.apple.ipod
    ) {
        size = { width: window.document.documentElement.clientWidth, height: window.document.documentElement.clientHeight };
    } else {
        size = { width: window.innerWidth, height: window.innerHeight };
    }
    const tempSizeWidth = size.width;
    const tempSizeHeight = size.height;

    let orientation = "landscape";
    let targetWidth = _targetWidth;
    let targetHeight = _targetHeight;
    if (tempSizeWidth < tempSizeHeight) {
        orientation = "portrait";
        targetWidth = _targetHeight;
        targetHeight = _targetWidth;
    }
    const nextStyleWidth = tempSizeWidth + "px";
    const nextStyleHeight = tempSizeHeight + "px";

    let nextWidth = targetWidth;
    let nextHeight = targetHeight;

    if (orientation === "landscape") {
        const scaleWidth = tempSizeWidth / _targetWidth;
        const scaleHeight = tempSizeHeight / _targetHeight;
        if (scaleWidth < scaleHeight) {
            nextHeight = Math.round(tempSizeHeight / scaleWidth);
        } else if (scaleWidth > scaleHeight) {
            nextWidth = Math.round(tempSizeWidth / scaleHeight);
        }
    } else {
        const scaleWidth = tempSizeWidth / targetWidth;
        const scaleHeight = tempSizeHeight / targetHeight;
        if (scaleWidth < scaleHeight) {
            nextHeight = Math.round(tempSizeHeight / scaleWidth);
        } else if (scaleWidth > scaleHeight) {
            nextWidth = Math.round(tempSizeWidth / scaleHeight);
        }
    }
    return { nextStyleWidth, nextStyleHeight, nextWidth, nextHeight };
}

/**
 * @function module:Application.ResizeHandler._updateStyleSize
 * @private
 * @return {boolean} Returns true if the style of the canvas has been updated
 */
function _updateStyleSize( nextStyleWidth, nextStyleHeight ) {
    if (_resizeCanvas.style.width !== nextStyleWidth || _resizeCanvas.style.height !== nextStyleHeight) {
        _resizeCanvas.style.width = nextStyleWidth;
        _resizeCanvas.style.height = nextStyleHeight;
        return true;
    }
}

/**
 * @function module:Application.ResizeHandler._updateSize
 * @private
 * @return {boolean} Returns true if the width or height of the canvas has been updated
 */
function _updateSize( nextWidth, nextHeight ) {
    if (_resizeCanvas.width !== nextWidth || _resizeCanvas.height !== nextHeight) {
        _resizeCanvas.width = nextWidth;
        _resizeCanvas.height = nextHeight;
        return true;
    }
}

/**
 * @function module:Application.ResizeHandler._resize
 * @private
 * @return {void}
 */
function _resize() {
    const { nextStyleWidth, nextStyleHeight, nextWidth, nextHeight } = _getSize();
    const isStyleUpdated = _updateStyleSize(nextStyleWidth, nextStyleHeight);
    const isSizeUpdated = _updateSize(nextWidth, nextHeight);

    if (isStyleUpdated || isSizeUpdated) {
        const nextX = Math.floor((nextWidth - _targetWidth) / 2);
        const nextY = Math.floor((nextHeight - _targetHeight) / 2);
        _app.stage.x = nextX;
        _app.stage.y = nextY;
        _app.renderer.resize(nextWidth, nextHeight);
        window.scrollTo(0, 1);
        if (typeof _onResize === "function") {
           _onResize({
                x: nextX,
                y: nextY,
                width: nextWidth,
                height: nextHeight
            });
        }
    }
}

/**
 * @function module:Application.ResizeHandler.handle
 * @param {Object} props - The Application initialization properties.
 * @return {void}
 */
function handle(props) {
    _targetWidth = props.width;
    _targetHeight = props.height;
    _resizeCanvas = props.canvas;
    _onResize = props.onResize;
    _app = props.app;
    _resize();
    window.addEventListener("resize", () => {
        setTimeout(() => {
            _resize();
        }, 0);
    });
}

export default handle;