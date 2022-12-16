import { store } from "./store";
import { loadingProgress } from "./reducer/loading";
import { assetsAreLoaded } from "./reducer/app";

export default class Loader {
    constructor(props) {
        const { loader, assets } = props;

        this._loader = loader;
        this._assets = assets;

        this._loader.onProgress.add(this._dispatchProgress);
        this._loader.onComplete.add(this._dispatchAssetsAreLoaded);

        this._loadAssets();
    }

    load() {
        this._loader.load();
    }

    _loadAssets() {
        this._assets.forEach(asset => {
            this._loader.add(asset);
        });
    }

    _dispatchProgress(loader) {
        store.dispatch(
            loadingProgress({
                progress: Math.ceil(loader.progress)
            })
        );
    }

    _dispatchAssetsAreLoaded() {
        store.dispatch(assetsAreLoaded());
    }
}
