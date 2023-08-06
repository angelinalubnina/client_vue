<template>
    <div class="flex" v-if="isDeviceLoaded">
        <div class="card flex justify-content-center">
            <Galleria
                :value="images"
                :responsiveOptions="responsiveOptions"
                :numVisible="5"
                :circular="true"
                containerStyle="max-width: 640px"
                :showItemNavigators="true"
                :showThumbnails="false"
            >
                <template #item="slotProps">
                    <img
                        :src="slotProps.item.name"
                        :alt="'Заглушка'"
                        style="width: 100%; display: block"
                    />
                </template>
                <template #thumbnail="slotProps">
                    <img
                        :src="slotProps.item.name"
                        :alt="'Заглушка'"
                        style="display: block"
                    />
                </template>
            </Galleria>
        </div>
        <div class="col-12 lg:col-6 py-0 lg:pl-5 w-25rem">
            <div class="flex justify-content-around flex-wrap">
                <h2>
                    {{ nameDevice }}
                </h2>
            </div>
            <div class="flex justify-content-around flex-wrap">
                <div style="margin-right: 20px">${{ getPrice() }}</div>
                <Rating :modelValue="rating" readonly :cancel="false"></Rating>
            </div>
            <div>
                <p class="p-0 mt-15 mb-3 line-height-3 text-700 text-justify">
                    {{ getDescription() }}
                </p>
            </div>
            <div>
                <div>
                    <div
                        v-for="(color, index) in getColors()"
                        :key="index"
                        class="color-option"
                    >
                        <input
                            type="radio"
                            :id="color.code"
                            :value="color.name"
                            v-model="selectedColor"
                        />
                        <label
                            :for="color"
                            :style="{ backgroundColor: color.code }"
                        ></label>
                    </div>
                    <p>Выбранный цвет: {{ selectedColor.name }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else>Идет загрузка!</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { $host } from '../http/index';
import { SERVER_URL, defaultDeviceImg, DEVICE_ROUTE } from '../utils/consts';
import { PhotoService } from '@/PhotoService/PhotoService';

const images = ref([]);
const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4,
    },
    {
        breakpoint: '767px',
        numVisible: 3,
    },
    {
        breakpoint: '575px',
        numVisible: 1,
    },
]);

const route = useRoute();
const name = route.params.name;
const device = ref(null);

const nameDevice = ref('');
const getPrice = () => {
    return device.value.price;
};
// const getRating = () => {
//     return device.value.rating;
// };

const rating = computed(() => {
    debugger;
    return device.value === null ? 0 : device.value.rating;
});

const getDescription = () => {
    return device.value.description;
};

const getColors = () => {
    return device.value.colors;
};

const selectedColor = ref('');

async function findPictures() {
    const response = await $host.get('api/device/' + name);
    device.value = response.data;
    debugger;
    if (device.value.images.length > 0) {
        for (const name of device.value.images) {
            images.value.push({
                name: SERVER_URL + 'devices/' + device.value.name + '/' + name,
            });
        }
    } else {
        images.value.push({ name: defaultDeviceImg });
    }
    nameDevice.value = device.value.name;
}

const isDeviceLoaded = computed(() => {
    if (
        device !== null &&
        device.value !== null &&
        device.value !== undefined
    ) {
        return true;
    } else {
        return false;
    }
});



onBeforeMount(async () => {
    findPictures();
});
</script>

<style scoped>
.color-option {
    display: inline-block;
    margin-right: 10px;
}

.color-option input[type='radio'] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.color-option label {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ccc;
    cursor: pointer;
}

.color-option label:hover {
    border: 1px solid #000;
}
</style>
