<template>
    <div class="flex flex-col items-center w-full mx-[10px]">
      <div class="bg-red-600 header flex justify-between items-center w-10/12 h-16">
        <div class="w-1/4 text-center h-full flex justify-center items-center border-white  border-b border-b-4 ml-4 text-2xl "><a>LOGIN</a></div>
        <div class="w-1/4 text-center h-full flex justify-center items-center text-2xl"><a href="/signup">REGISTER</a></div>
      </div>

      <div id="form-login" class="mt-2 w-10/12 form-group flex justify-start flex-col items-center">
        <label
          class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Username</label>
        <input 
          v-model="loginData.username"
          type="text" placeholder="Nhap username o day...."
          class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">
  
        <label
          class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Password</label>
        <input 
          v-model="loginData.password"
          type="text" placeholder="Nhap password o day...."
          class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">
        <button type=submit @click="login" id="loginSubmit" class="text-white mt-4 w-full h-10 bg-red-500 text-xl">LOGIN</button>
      </div>
    </div>
  </template>
  <script >
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  import axios from 'axios';
  import Swal from 'sweetalert2'
  export default {
    components: { VueDatePicker },
    data() {
      return {
        date: null,
        picked: null,
        activeButton: 'login',
        userName:'',
  
        loginData: {
          username: '',
          password: ''
        },
        userDate: ''
        
      };
    },
    
    methods: {
      formatDate(date) {
        const formattedDate = new Date(date);
  
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDate.getDate()).padStart(2, '0');
  
        return `${year}-${month}-${day}`;
      },
      async login(){
        const dataToSend = {
          username : this.loginData.username,
          password : this.loginData.password,
        };
        console.log(dataToSend);
        try{
          const response = await axios.post('http://localhost:8080/api/auth/login',dataToSend);
          if(response.status === 200){
            Swal.fire({
              title: 'Login Successful!',
              icon : 'success',
              showCancelButton : false,
              confirmButtonText:' OK'
            }).then((result) => {
              if(result.isConfirmed){
                window.location.href = "/";
              }
            });
            localStorage.setItem('username',response.data.username);
            localStorage.setItem('accessToken',response.data.tokenLst.accessToken);
            localStorage.setItem('accessExpiration',response.data.tokenLst.accessExpiration);
            localStorage.setItem('refreshToken',response.data.tokenLst.refreshToken);
            localStorage.setItem('refreshExpiration',response.data.tokenLst.refreshExpiration);
          }
        }catch (error){
          console.error(error);
        }
      },
    }
  }
  </script>