<template>
    <div>
        <DataView :value="generalDevices">
            <template #list="slotProps">
                <div class="col-12">
                    <div
                        class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
                    >
                        <a
                            :href="`http://localhost:8080/#/device/${slotProps.data.name}`"
                        >
                            <img
                                class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                :src="`${
                                    slotProps.data.images.length > 0
                                        ? SERVER_URL +
                                          'devices/' +
                                          slotProps.data.name +
                                          '/' +
                                          slotProps.data.images[0]
                                        : defaultDeviceImg
                                }`"
                                :alt="slotProps.data.name"
                            />
                        </a>
                        <div
                            class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
                        >
                            <div
                                class="flex flex-column align-items-center sm:align-items-start gap-3"
                            >
                                <div class="text-2xl font-bold text-900">
                                    {{ slotProps.data.name }}
                                </div>
                                <div class="text-2xl font-bold text-900">
                                    {{ slotProps.data.amount }} шт.
                                </div>
                            </div>
                            <div
                                class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
                            >
                                <span class="text-2xl font-semibold"
                                    >${{ slotProps.data.price }}</span
                                >
                                <div>
                                    <Button
                                        icon="pi pi-plus"
                                        style="
                                            font-size: 1rem;
                                            margin-right: 5px;
                                        "
                                        rounded
                                        @click="
                                            addOneDevice(slotProps.data.name)
                                        "
                                        :disabled="
                                            slotProps.data.inventoryStatus ===
                                            'OUTOFSTOCK'
                                        "
                                    ></Button>
                                    <Button
                                        icon="pi pi-minus"
                                        style="font-size: 1rem"
                                        rounded
                                        @click="
                                            deleteOneDevice(slotProps.data.name)
                                        "
                                        :disabled="
                                            slotProps.data.inventoryStatus ===
                                            'OUTOFSTOCK'
                                        "
                                    ></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <div>
            <div style="margin: 15px;">Общая стоимость:{{ totalSum }} $</div>
            <Button style="mask-type: 15px;" @click="$router.push('/personal')">
                Перейти к оформлению
            </Button>
        </div>
    </div>
</template>

<script setup>
import { $authHost } from '@/http/index';
import { ref, onBeforeMount, onMounted } from 'vue';
import { useDeviceStore } from '@/stores/deviceStore';
import { SERVER_URL, defaultDeviceImg } from '@/utils/consts';
import { computed } from 'vue';
import { ORDERING_ROUTE } from '@/utils/consts';

const deviceStore = useDeviceStore();
const generalDevices = ref([]);

onBeforeMount(async () => {
    const response = await $authHost.get('api/basketDevice');
    const allGeneralDevices = deviceStore.devices;
    for (const basketDevice of response.data) {
        for (const generalDevice of allGeneralDevices) {
            if (basketDevice.device == generalDevice._id) {
                generalDevice.amount = basketDevice.amount;
                generalDevices.value.push(generalDevice);
            }
        }
    }
});

debugger;
const totalSum = computed(() => {
    let sum = 0;
    for (const device of generalDevices.value) {
        sum += device.price * device.amount;
    }
    return sum;
});

const addOneDevice = async (deviceName) => {
    debugger;
    try {
        const res = await $authHost.post('api/basketDevice/' + deviceName);
    } catch (e) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка 😞',
            detail: e.message,
            life: 1500,
        });
    }
};
const deleteOneDevice = async (deviceName) => {
    try {
        await $authHost.delete('api/basketDevice/' + deviceName);
    } catch (e) {
        console.log(e.message);
        // toast.add({
        //     severity: 'error',
        //     summary: 'Ошибка 😞',
        //     detail: e.message,
        //     life: 1500,
        // });
    }
};
</script>

<style scoped></style>
