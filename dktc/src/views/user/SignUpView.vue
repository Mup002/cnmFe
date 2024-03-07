<template>
  <div class="flex flex-col items-center w-full">
    <div class="bg-red-600 header flex justify-between items-center w-10/12 h-16">
      <div class="w-1/4 text-center h-full flex justify-center items-center ml-4 text-2xl"><a href="/login">Login</a>
      </div>
      <div
        class="w-1/4 text-center h-full flex justify-center items-center border-b border-b-4 border-white mr-4 text-2xl">
        <a>Register</a>
      </div>
    </div>

    <div id="form-register" class="mt-2 w-10/12 form-group flex justify-start flex-col items-center">
      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">First
        Name</label>
      <input v-model="this.registerData.firstName" type="text" placeholder="Nhap ten o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">

      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Last
        Name</label>
      <input v-model="this.registerData.lastName" type="text" placeholder="Nhap ten o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">
      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">User
        Name</label>
      <input v-model="this.registerData.username" type="text" placeholder="Nhap ten o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">
      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Phone</label>
      <input v-model="this.registerData.phone" type="text" placeholder="Nhap sdt o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">

      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Email</label>
      <input v-model="this.registerData.email" type="text" placeholder="Nhap email o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">
      <label
        class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Password</label>
      <input v-model="this.registerData.password" type="text" placeholder="Nhap password o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">

      <label class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Date of
        birth</label>
      <VueDatePicker v-model="date"></VueDatePicker>

      <label
        class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Gender</label>
      <div class="flex justify-start w-full items-center">
        <div class="flex justify-center mr-2">
          <input type="radio" id="Male" value="Male" v-model="picked" />
          <label for="Male">Male</label>
        </div>
        <div class="flex justify-center mr-2">
          <input type="radio" id="Female" value="Female" v-model="picked" />
          <label for="Female">Female</label>
        </div>
      </div>

      <label
        class="text-black font-bold md:font-normal lg:font-bold text-lg md:text-2xl lg:text-3xl w-full">Address</label>
      <input type="text" placeholder="Nhap dia chi o day...."
        class="w-full h-8 border-spacing-5 border border-gray-300 rounded-lg pl-2">

      <button type=submit @click="register" id="registerSubmit"
        class="text-white mt-4 w-full h-10 bg-red-500">Register</button>
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

      loginData: {
        username: '',
        password: ''
      },
      registerData: {
        firstName: '',
        lastName: '',
        phone: '',
        username: '',
        password: '',
        date: '',
        gender: '',
        address: '',
        email: '',
      }
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
    async register() {
      var birth = this.formatDate(this.date);

      const dataToSend = {
        firstName: this.registerData.firstName,
        lastName: this.registerData.lastName,
        username: this.registerData.username,
        phone: this.registerData.phone,
        email: this.registerData.email,
        password: this.registerData.password,
        date: birth,
        gender: this.picked,
        address: this.registerData.address,
       
      };
      console.log(dataToSend);
      try {
        const response = await axios.post('http://localhost:8080/api/auth/register', dataToSend);
        if (response.status === 200) {
          Swal.fire({
            title: 'Register Successful!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: ' OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/login";
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>