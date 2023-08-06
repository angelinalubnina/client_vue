<template>
    <div class="card flex justify-content-center">
        <Listbox v-bind="modelValue" @change="updateListbox" :options="options" filter optionLabel="name" class="w-full md:w-14rem" />
    </div>
</template>

<script name="list-box">
import { defineComponent  } from 'vue';

export default defineComponent({
    props: {
        modelValue: {
            type: Object,
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        updateListbox(event) {
            this.$emit('update:modelValue', event.value)
        }
    }
})
</script>


<style scoped>

</style>