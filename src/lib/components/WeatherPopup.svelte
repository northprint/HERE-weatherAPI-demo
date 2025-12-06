<script lang="ts">
    import { getWeather } from '$lib/weather.remote';

    // 親から渡された lat, lng がここに入ります
    let { lat, lng } = $props();

    // 座標をもとに自動でフェッチ
    let weatherPromise = $derived(
        (lat && lng) ? getWeather({ lat, lng }) : null
    );
</script>

<div class="text-center font-sans min-w-[140px] min-h-[80px]">
    <h3 class="m-0 mb-2.5 p-0 pb-[5px] border-b border-[#eee] text-base">気温情報</h3>
    
    {#if weatherPromise}
        {#await weatherPromise}
            <div class="flex flex-col items-center justify-center mt-2.5 text-[#888]">
                <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mb-1"></div>
                <span class="text-xs">読み込み中...</span>
            </div>
        {:then data}
            <div>
                <span class="text-[1.8rem] font-bold text-[#e65100]">{data.temp}{data.unit}</span>
                <br>
                <span>風速: {data.wind} km/h</span>
            </div>
        {:catch error}
            <div class="text-red-500 mt-2.5">データ取得エラー</div>
        {/await}
    {:else}
        <div class="text-[#888] mt-2.5">データなし</div>
    {/if}
</div>