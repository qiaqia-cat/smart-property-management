import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  const login = async (data) => {
    const res = await axios.post('/auth/login', data)
    if (res.code === 200) {
      token.value = res.data.token
      userInfo.value = res.data.user
      localStorage.setItem('token', res.data.token)
    }
    return res
  }

  const register = async (data) => {
    const res = await axios.post('/auth/register', data)
    if (res.code === 200) {
      token.value = res.data.token
      userInfo.value = res.data.user
      localStorage.setItem('token', res.data.token)
    }
    return res
  }

  const getUserInfo = async () => {
    const res = await axios.get('/auth/me')
    if (res.code === 200) {
      userInfo.value = res.data
    }
    return res
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    login,
    register,
    getUserInfo,
    logout
  }
})
