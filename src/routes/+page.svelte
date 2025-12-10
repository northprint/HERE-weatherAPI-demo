<script lang="ts">
    import { onMount, onDestroy, mount, unmount } from 'svelte';
    import { MapLibre, NavigationControl } from 'svelte-maplibre-gl';
    import maplibregl from 'maplibre-gl';
    import WeatherPopup from '$lib/components/WeatherPopup.svelte';

    // 現在のポップアップと、その中のSvelteアプリのインスタンスを保持
    let currentPopup: maplibregl.Popup | null = null;
    let mountedComponent: any = null;

    function handleMapClick(e: any) {
        const { lng, lat } = e.lngLat;
        const mapInstance = e.target; // 地図インスタンス

        // 1. 掃除: 既存のポップアップとコンポーネントを破棄
        if (mountedComponent) {
            unmount(mountedComponent);
            mountedComponent = null;
        }
        if (currentPopup) {
            currentPopup.remove();
        }

        // 2. DOMの入れ物を作る
        const container = document.createElement('div');

        // 3. Svelte 5 の mount で、コンポーネントを入れ物にレンダリング
        // ここで座標(props)を渡します
        mountedComponent = mount(WeatherPopup, {
            target: container,
            props: { lat, lng }
        });

        // 4. MapLibre標準のPopupを作って地図に追加
        currentPopup = new maplibregl.Popup({ 
                closeOnClick: false,
                closeButton: false,
                maxWidth: 'none'
            })
            .setLngLat([lng, lat])
            .setDOMContent(container) // 作ったDOMをセット
            .addTo(mapInstance);
            
        // ポップアップが閉じられた時の掃除イベント
        currentPopup.on('close', () => {
            if (mountedComponent) {
                unmount(mountedComponent);
                mountedComponent = null;
            }
        });
    }
</script>


<MapLibre
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    center={[139.7671, 35.6812]}
    zoom={13}
    onclick={handleMapClick}
    class="h-[100vh]"
>
    <NavigationControl position="top-right" />
</MapLibre>