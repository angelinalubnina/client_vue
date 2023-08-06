import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useDeviceStore = defineStore('deviceStore', () => {
  const types = ref([])
  const brands = ref([])
  const devices = ref([])

  // async function init(_devices, _types, _brands){
  //   devices.value = _devices
  //   types.value = _types
  //   brands.value = _brands
  // }
  return {types, brands, devices}
})