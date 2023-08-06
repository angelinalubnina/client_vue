<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import ListBox from '@/components/UI/ListBox.vue';
import { Estock } from '@/service/ProductService';
import { $host, $authHost } from '@/http/index';
import { SERVER_URL, defaultDeviceImg } from '@/utils/consts';
import { useUserStore } from '@/stores/userStore';
import { useDeviceStore } from '@/stores/deviceStore';
import jwt_decode from 'jwt-decode';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const deviceStore = useDeviceStore();

const selectedType = ref();
const typeOptions = ref([])
const resetSelectionType = () => {
    selectedType.value = null;
};

const selectedBrand = ref();
const brandOptions = ref([])
const resetSelectionBrand = () => {
    selectedBrand.value = null;
};

//отображение сеткой или построчно
const layout = ref('list');

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
];
const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

// наличие товара
const getSeverity = (device) => {
    return Estock.INSTOCK;
};
const getInvertoryStatus = (device) => {
    return Estock[Estock.INSTOCK];
};

const devices = ref([])
// const devices = computed(() => {
//     console.trace()
//     const t1 = []
//     const t = deviceStore.devices.length === 0 ? [] : deviceStore.devices;
//     for (const type of t) {
//         t1.push({...type})
//     }
//     return t1;
// });

const filteredProducts = computed(() => {
    let filterProducts = [];
    // if (devices.value.length === 0) {
    //     return filteredProducts;
    // }
    let selectedTypeId = selectedType?.value?.name;
    let selectedBrandId = selectedBrand?.value?.name;
    if (selectedTypeId && !selectedBrandId) {
        for (const device of devices.value) {
            if (device.type === selectedTypeId) {
                filterProducts.push(device);
            }
        }
    } else if (!selectedTypeId && selectedBrandId) {
        for (const device of devices.value) {
            if (device.brand === selectedBrandId) {
                filterProducts.push(device);
            }
        }
    } else if (selectedTypeId && selectedBrandId) {
        for (const device of devices.value) {
            if (
                device.type === selectedTypeId &&
                device.brand === selectedBrandId
            ) {
                filterProducts.push(device);
            }
        }
    } else if (!selectedTypeId && !selectedBrandId) {
        for (const device of devices.value) {
            filterProducts.push(device);
        }
    }
    return filterProducts;
});

const fetchData = () => {
    devices.value = deviceStore.devices
    brandOptions.value = deviceStore.brands;
    typeOptions.value = deviceStore.types;
};
onBeforeMount(fetchData);

const deviceName = ref();

const toast = useToast();

const addOneDevice = async (deviceName) => {
    try {
        const res = await $authHost.post('api/basketDevice/' + deviceName, {
            name: deviceName,
        });
        debugger;
        toast.add({
            severity: 'success',
            summary: 'Удачно 😊',
            detail: 'Девайс добавлен в корзину',
            life: 1500,
        });
    } catch (e) {
        toast.add({
            severity: 'error',
            summary: 'Ошибка 😞',
            detail: e.message,
            life: 1500,
        });
    }
    // deviceName.value = null;
};

const visible = computed(() => {
    if(filteredProducts.value.length === 0) {
        return true
    }
    return false
})

</script>

<template>
    <div  class="container">
        <div>
            <div class="selected">
                <list-box
                    v-model="selectedType"
                    placeholder="Поиск..."
                    :options="typeOptions"
                ></list-box>
                <button @click="resetSelectionType">Сбросить выбор</button>
            </div>
            <div>
                <list-box
                    v-model="selectedBrand"
                    placeholder="Поиск..."
                    :options="brandOptions"
                ></list-box>
                <button @click="resetSelectionBrand">Сбросить выбор</button>
            </div>
        </div>
        <div v-show="!visible" class="card">
            <DataView
                :value="filteredProducts"
                paginator
                :rows="5"
                :sortOrder="sortOrder"
                :sortField="sortField"
                :layout="layout"
            >
                <template #header>
                    <Dropdown
                        v-model="sortKey"
                        :options="sortOptions"
                        optionLabel="label"
                        placeholder="Sort By Price"
                        @change="onSortChange($event)"
                    />
                    <div class="flex justify-content-end">
                        <DataViewLayoutOptions v-model="layout" />
                    </div>
                </template>
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
                                    <Rating
                                        :modelValue="slotProps.data.rating"
                                        readonly
                                        :cancel="false"
                                    ></Rating>
                                    <div class="flex align-items-center gap-3">
                                        <span
                                            class="flex align-items-center gap-2"
                                        >
                                            <i class="pi pi-tag"></i>
                                            <span class="font-semibold">{{
                                                slotProps.data.type
                                            }}</span>
                                            <span class="font-semibold">{{
                                                slotProps.data.brand
                                            }}</span>
                                        </span>
                                        <Tag
                                            :value="
                                                getInvertoryStatus(
                                                    slotProps.data,
                                                )
                                            "
                                            :severity="
                                                getSeverity(slotProps.data)
                                            "
                                        ></Tag>
                                    </div>
                                </div>
                                <div
                                    class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
                                >
                                    <span class="text-2xl font-semibold"
                                        >${{ slotProps.data.price }}</span
                                    >
                                    <Toast />
                                    <Button
                                        icon="pi pi-shopping-cart"
                                        rounded
                                        :disabled="false"
                                        @click="
                                            addOneDevice(slotProps.data.name)
                                        "
                                    ></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #grid="slotProps">
                    <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                        <div
                            class="p-4 border-1 surface-border surface-card border-round"
                        >
                            <div
                                class="flex flex-wrap align-items-center justify-content-between gap-2"
                            >
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-tag"></i>
                                    <span class="font-semibold">{{
                                        slotProps.data.type
                                    }}</span>
                                    <span class="font-semibold">{{
                                        slotProps.data.brand
                                    }}</span>
                                </div>
                                <Tag
                                    :value="slotProps.data.inventoryStatus"
                                    :severity="getSeverity(slotProps.data)"
                                ></Tag>
                            </div>
                            <div
                                class="flex flex-column align-items-center gap-3 py-5"
                            >
                                <a
                                    :href="`http://localhost:8080/#/device/${slotProps.data.name}`"
                                >
                                    <img
                                        class="w-9 shadow-2 border-round"
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

                                <div class="text-2xl font-bold">
                                    {{ slotProps.data.name }}
                                </div>
                                <Rating
                                    :modelValue="slotProps.data.rating"
                                    readonly
                                    :cancel="false"
                                ></Rating>
                            </div>
                            <div
                                class="flex align-items-center justify-content-between"
                            >
                                <span class="text-2xl font-semibold"
                                    >${{ slotProps.data.price }}</span
                                >
                                <Button
                                    icon="pi pi-shopping-cart"
                                    rounded
                                    :disabled="true"
                                />
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div v-show="visible">Нет элементов удовлетворяющих фильтрации</div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}
.selected {
    margin-right: 10px;
}
.p-dataview .p-dataview-header {
    color: #343a40;
    border: 1px solid #388bde;
    border-width: 1px 0 1px 0;
    padding: 1rem 1rem;
    font-weight: 700;
}
</style>
