<script lang="ts">
    import { getWeather } from '$lib/weather.remote';

    // 親から渡された lat, lng がここに入ります
    let { lat, lng } = $props();

    // 座標をもとに自動でフェッチ
    let weatherPromise = $derived(
        (lat && lng) ? getWeather({ lat, lng }) : null
    );
</script>

<div class="font-sans w-[320px] text-left">
    {#if weatherPromise}
        {#await weatherPromise}
            <div class="flex flex-col items-center justify-center py-6 text-gray-500">
                <div class="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                <span class="text-sm">天気情報を取得中...</span>
            </div>
        {:then data}
            <div class="flex flex-col gap-3">
                <!-- Header: City & Time -->
                <div class="border-b border-gray-200 pb-2">
                    <h3 class="text-lg font-bold text-gray-800 m-0 leading-tight">{data.city}</h3>
                    <p class="text-xs text-gray-500 m-0 mt-1">
                        {new Date(data.time).toLocaleString('ja-JP', { 
                            month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' 
                        })}
                    </p>
                </div>

                <!-- Main Weather Info -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        {#if data.iconLink}
                            <img src={data.iconLink} alt={data.skyDesc} class="w-16 h-16 object-contain" />
                        {/if}
                        <div>
                            <div class="text-3xl font-bold text-gray-900">{data.temp}°C</div>
                            <div class="text-sm text-gray-600 max-w-[120px] leading-tight">{data.skyDesc || data.description}</div>
                        </div>
                    </div>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500">湿度</span>
                        <span class="font-medium text-gray-700">{data.humidity}%</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-500">風</span>
                        <span class="font-medium text-gray-700">{data.windDesc} ({data.windSpeed} km/h)</span>
                    </div>
                    <div class="col-span-2 mt-1 pt-2 border-t border-gray-200 text-xs text-gray-500">
                         {data.description}
                    </div>
                </div>
            </div>
        {:catch error}
            <div class="flex flex-col items-center justify-center py-4 text-red-500">
                <span class="font-bold">エラーが発生しました</span>
                <span class="text-xs mt-1 text-center text-red-400">{error.message}</span>
            </div>
        {/await}
    {:else}
        <div class="flex items-center justify-center py-6 text-gray-400 text-sm">
            データなし
        </div>
    {/if}
</div>