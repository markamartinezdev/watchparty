import axios from "axios"

const $axios = axios.create()

if (process.env.NODE_ENV == 'production') $axios.defaults.baseURL = process.env.VUE_APP_BASEURL

$axios.interceptors.request.use(
    (config) => {
      const conf = config;
        console.log(process.env.NODE_ENV)
      //update the request baseURL
      if (process.env.NODE_ENV == 'production') conf.baseURL = process.env.VUE_APP_BASEURL;
  
      //return the request configurations
      return conf;
    },
    (error) => Promise.reject(error)
  );

export default $axios