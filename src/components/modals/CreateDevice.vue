<template>
    <div class="card flex justify-content-center" style="margin-top: 30px">
        <Button
            class="add"
            label="Добавить товар"
            icon="pi pi-mobile"
            @click="visible = true"
        />
        <Dialog
            v-model:visible="visible"
            modal
            header="Добавить товар"
            :style="{ width: '60vw' }"
        >
            <div class="flex justify-content-start flex-wrap">
                <MultiSelect
                    v-model="selectedType"
                    :options="typeOptions"
                    optionLabel="name"
                    placeholder="Тип"
                    :maxSelectedLabels="1"
                    class="w-full md:w-20rem"
                    selectionLimit="1"
                    selectedItemsLabel="больше 1"
                />
            </div>
            <div
                class="flex justify-content-start flex-wrap"
                style="margin-top: 15px"
            >
                <MultiSelect
                    v-model="selectedBrand"
                    :options="brandOptions"
                    optionLabel="name"
                    placeholder="Бренд"
                    :maxSelectedLabels="1"
                    class="w-full md:w-20rem"
                    selectionLimit="1"
                />
            </div>
            <div class="card flex justify-content-center">
                <MultiSelect
                    v-model="selectedColors"
                    :options="colorOptions"
                    optionLabel="name"
                    placeholder="Цвета"
                    display="chip"
                    class="w-full md:w-20rem"
                >
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>
                                <span
                                    :style="{
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: slotProps.option.code,
                                        borderRadius: '50%',
                                        marginRight: '5px',
                                    }"
                                ></span>
                                {{ slotProps.option.name }}
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="py-2 px-3">
                            <b>{{
                                selectedCountries ? selectedCountries.length : 0
                            }}</b>
                            item{{
                                (selectedCountries
                                    ? selectedCountries.length
                                    : 0) > 1
                                    ? 's'
                                    : ''
                            }}
                            selected.
                        </div>
                    </template>
                </MultiSelect>
            </div>
            <div
                class="flex justify-content-start flex-wrap"
                style="margin-top: 15px"
            >
                <InputText
                    type="text"
                    v-model="name"
                    placeholder="Название"
                    style="width: 500px"
                />
            </div>
            <div
                class="flex justify-content-start flex-wrap"
                style="margin-top: 15px"
            >
                <InputNumber
                    v-model="price"
                    inputId="minmaxfraction"
                    :minFractionDigits="2"
                    :maxFractionDigits="2"
                    placeholder="Цена"
                    style="width: 500px"
                />
            </div>
            <div class="card flex justify-content-center">
                <Textarea v-model="description" rows="5" cols="30" />
            </div>
            <div>
                <div class="card" style="margin-top: 15px">
                    <Toast />
                    <FileUpload
                        :chooseLabel="'Выбрать фото'"
                        name="demo[]"
                        style="font-size: 14px"
                        @select="selectImages"
                        :multiple="true"
                        accept=".png,.jpeg,.jpg"
                        :maxFileSize="10000000"
                        mode="basic"
                    >
                        <!-- <template #empty>
                            <p>Перетащите сюда картинки для загрузки.</p>
                        </template> -->
                    </FileUpload>
                </div>
                <!-- <h3 v-if="!fileupload" @select="selectImages">Файл не выбран</h3> -->
            </div>

            <div class="card p-fluid">
                <DataTable
                    :value="selectedProperties"
                    editMode="cell"
                    @cell-edit-complete="onCellEditComplete"
                    tableClass="editable-cells-table"
                    tableStyle="min-width: 50rem"
                    showGridlines="true"
                    stripedRows="true"
                >
                    <Column
                        v-for="col of columns"
                        :key="col.field"
                        :field="col.field"
                        :header="col.header"
                        style="width: 50%"
                    >
                        <template #body="{ data, field }">
                            {{ getFieldValue(data, field) }}
                        </template>
                        <template #editor="{ data, field }">
                            <template v-if="field === 'value'">
                                <InputText v-model="data[field]" autofocus />
                            </template>
                            <template v-else>
                                <Dropdown
                                    v-model="data[field]"
                                    :options="propertyOptions"
                                    optionLabel="name"
                                    class="w-full md:w-14rem"
                                />
                            </template>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="flex justify-content-end flex-wrap">
                <Button
                    v-if="enabledButton"
                    label="Добавить"
                    severity="success"
                    @click.stop="addDevice"
                />
                <Button v-else label="Добавить" severity="success" disabled />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDeviceStore } from '@/stores/deviceStore';
import { $authHost, $host } from '@/http/index';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount } from 'vue';

const deviceStore = useDeviceStore();

const typeOptions = deviceStore.types;
const selectedType = ref([typeOptions[0]]);

const brandOptions = deviceStore.brands;
const selectedBrand = ref([brandOptions[0]]);

const visible = ref(false);

const name = ref('qwe');
const price = ref(1234);
const description = ref('dffg');

const images = ref([]);
const selectImages = async (event) => {
    images.value = event.files;
    debugger;
};

const enabledButton = computed(() => {
    if (
        selectedType.value.length === 1 &&
        selectedBrand.value.length === 1 &&
        name.value &&
        price.value &&
        description.value
    ) {
        return true;
    }
    return false;
});

const toast = useToast();

const addDevice = async () => {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('price', `${price.value}`);
    formData.append('brandName', selectedBrand.value[0].name);
    formData.append('typeName', selectedType.value[0].name);
    formData.append('description', description.value);
    formData.append('propsStr', JSON.stringify(selectedProperties.value.slice(0, -1)));
    formData.append('colorsStr', JSON.stringify(selectedColors.value))
    for (const img of images.value) {
        formData.append('images', img);
    }
    try {
        await $authHost.post('api/device', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.add({
            severity: 'info',
            summary: 'Удачно 😊',
            detail: 'Девайс создан',
            life: 1000,
        });
    } catch (e) {
        toast.add({
            severity: 'info',
            summary: 'Error',
            detail: e.message,
            life: 1000,
        });
    }

    name.value = '';
    selectedType.value = [];
    selectedBrand.value = [];
    price.value = 0;
    description.value = '';

    setTimeout(() => {
        visible.value = false;
    }, 1000);
};

const columns = ref([
    { field: 'property', header: 'Имя свойства' },
    { field: 'value', header: 'Значение свойства' },
]);
const getFieldValue = (data, field) => {
    if (field === 'property') {
        return data['name'];
    } else if (field === 'value') {
        return data[field];
    }
    return 'ошибка';
};
const selectedProperties = ref([]);
const propertyOptions = ref([]);

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;

    const lastName =
        selectedProperties.value[selectedProperties.value.length - 1].name;
    if (data.name === lastName) {
        selectedProperties.value.push({ name: '', value: '', _id: '' });
    }

    switch (field) {
        case 'value':
            data[field] = newValue;
            break;
        case 'property':
            data.name = newValue.name;
            data._id = newValue._id
            break;
        default:
            data[field] = newValue;
            break;
    }
};
const fetchProperties = async () => {
    const { data } = await $host.get('/api/property');
    for (const property of data) {
        property.value = 'тест';
    }
    propertyOptions.value = data;
    selectedProperties.value = [{ name: '', value: '', _id: '' }];
};

const selectedColors = ref([]);
const colorOptions = ref([]);

const fetchColors = async () => {
    const { data } = await $authHost.get('/api/color');
    colorOptions.value = data;
};

onBeforeMount(() => {
    fetchProperties();
    fetchColors();
});
</script>

<style scoped>
.add {
    width: 500px;
}
</style>
