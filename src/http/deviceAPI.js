import { $host } from './index';

// export const createType = async (type) => {
//     const { data } = await $authHost.post('api/type', type);
//     return data;
// };
// export const fetchTypes = async () => {
//     console.log("fetchTypes")
//     const { data } = await $host.get('api/type');
//     console.log(data)
//     return data;
// };

// export const createBrand = async (brand) => {
//     const { data } = await $authHost.post('api/brand', brand);
//     return data;
// };
// export const fetchBrands = async () => {
//     console.log("fetchBrands")
//     const { data } = await $host.get('api/brand');
//     console.log(data)
//     return data;
// };

// export const createDevice = async (device) => {
//     const { data } = await $authHost.post('api/device', device);
//     return data;
// };
export const fetchDevices = async () => {
    debugger
    const { data } = await $host.get('api/device');
    debugger
    return data;
};

// export const fetchOneDevice = async (name) => {
//     const { data } = await $host.get('api/device/' + name);
//     return data;
// };
