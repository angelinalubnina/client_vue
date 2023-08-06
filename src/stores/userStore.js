import { defineStore } from 'pinia'
import { ref, computed } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  let user = ref(null)
  let isAuth = ref(false)

  function $reset() {
    user.value = null
    isAuth.value = false
  }
  function login(userDto) {
    user.value = userDto
    isAuth.value = true
  }
  function logout(){
    user.value = null
    isAuth.value = false
  }
  function getUser(){
    return user.value
  }
  function getIsAuth(){
    return isAuth.value
  }
  return { login, logout, $reset, user, isAuth, getUser, getIsAuth  }
})

// interface UserDto {
//   role: string
//   isActivated: Boolean
//   _id: string
//   email: string
// }