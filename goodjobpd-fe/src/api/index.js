import axios from 'axios'

const api = axios.create({
  baseURL: '/',   // nginx가 /api를 8080으로 프록시
})

export default api
