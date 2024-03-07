<template>
  <div class="flex flex-col justify-center items-center">
    <div id="overlay">
      <div class="header w-11/12 h-10 border-b  border-b-4 text-colorText text-2xl ml-2 border-colorText" @click.stop>Nội
        Dung Phim
      </div>
      <div class="mt-4 w-11/12 ml-2">
        <h1 class="text-colorText text-xl font-bold"> {{ movie.name }}</h1>
        <div class="detail flex flex-row">
          <img :src="movie.img" alt="Movie Poster" class="poster-image pt-2 pr-2" />
          <div class="info pt-2">
            <p class="border-colorText"><span class="font-bold">Đạo diễn: </span> {{ movie.director }}</p>
            <p class="border-colorText"><span class="font-bold">Diễn viên: </span> {{ movie.actor }}</p>
            <p class="border-colorText"><span class="font-bold">Thể loại: </span> {{ movie.categoriesName.join(', ') }}
            </p>
            <p class="border-colorText"><span class="font-bold">Khởi chiếu: </span> {{ movie.startTime }}</p>
            <p class="border-colorText"><span class="font-bold">Thời lượng: </span> {{ movie.timing }}</p>
            <p class="border-colorText"><span class="font-bold">Ngôn ngữ: </span> {{ movie.language }}</p>
            <p class="border-colorText"><span class="font-bold">Rated: </span> {{ movie.rating }}</p>
          </div>
        </div>
      </div>
      <div class="mt-8 w-3/4 flex flex-row justify-center items-center">
        <button class="w-[100px] h-[50px] bg-indigo-500 border rounded-[10px] mx-2 text-yellow-50 text-xl">Like</button>
        <button @click="togglePopup"
          class="w-[100px] h-[50px] bg-red-600 border rounded-[10px] mx-2 text-yellow-50 text-xl p-2 border-black border-2">Mua
          vé</button>
      </div>
    </div>
    <div v-if="isPopUpOpen" class="popup mt-8 w-10/12 h-[600px]  flex flex-col justify-start items-center overflow-auto"
      id="popup">
      <div class="w-full border-t-2 border-b-2 py-4 border-black" id="calendar">
        <ul class=" w-full flex flex-wrap justify-center items-center">
          <li v-for="(date, index) in next30Days" :key="index"
            class="text-colorTextCalendar text-[18px] w-[60px] h-[60px] border-2 border-black m-[1px] rounded-[4px]"
            :class="{ 'selected': selectedDayIndex === index }" @click="selectDate(index)">
            {{ formatDate(date) }}
          </li>
        </ul>
      </div>

      <div class="w-full border-b-2 py-4 pl-4 border-black" id="locate">
        <ul class="w-full flex flex-wrap justify-start items-center">
          <li v-for="(address, index) in addresses" :key="index"
            class="text-colorTextCalendar text-[18px] font-semibold w-[120px] h-[60px] border-2 border-black m-[1px] rounded-[4px] text-center flex items-center justify-center"
            :class="{ 'selected': selectedAddressIndex === index }" @click="selectAddress(index)">
            {{ address }}</li>
        </ul>
      </div>
      <div class="w-full border-b-2 py-4 pl-4 border-black" id="type">
        <ul class="w-full flex flex-wrap justify-start items-center">
          <li
            class="text-colorTextCalendar text-[18px] font-semibold w-[120px] h-[60px] border-2 border-black m-[1px] rounded-[4px] text-center flex items-center justify-center">
            {{ }}</li>
        </ul>
      </div>
      <div class="w-full border-b-2 py-4 pl-4 border-black" id="listMovie">
        <ul class="w-full flex flex-wrap justify-start items-center">
          <li v-for="(siteMovie, index) in siteMovies" :key="index" class="w-full pb-2">
            <h1 class="text-[20px] w-full text-colorText">{{ siteMovie.name }}</h1>
            <ul class="w-full flex flex-wrap justify-start items-center">
              <li v-for="(movietype, indexx) in siteMovie.list" :key="indexx" class="w-full pb-2">
                <span class="text-[18px] font-semibold w-full text-black">{{ movietype.cinemaType }} </span>
                <ul class="flex flex-wrap justify-start items-center w-full">
                  <li v-for="(showtime, indexxx) in movietype.showtimes" :key="indexxx"
                    class="w-[100px] h-[30px] border-2 flex justify-center items-center border-black mr-2 rounded-[8px]" @click="bookingSelect(movietype.idSite,showtime,siteMovie.name)">
                    {{ showtime }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <button @click="closePopup"
        class="w-[100px] h-[50px] bg-red-600 border rounded-[10px] mt-2 mx-2 text-yellow-50 text-xl p-2 border-black border-2">Close</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {mapActions} from 'vuex';
import { useRoute } from 'vue-router';
import moment from 'moment';
export default {
  data() {
    return {
      next30Days: [],
      selectedDayIndex: 0,
      selectedAddressIndex: 0,
      isPopUpOpen: false,
      movie: {
        id: '',
        rating: '',
        img: '',
        name: '',
        categoriesName: [],
        timing: '',
        startTime: '',
        actor: '',
        director: '',
        language: '',
        description: ''
      },
      addresses: [],
      siteMovies: []
    };
  },
  async mounted() {
    const accessToken = localStorage.getItem("accessToken");
    const accessExpiration = moment(localStorage.getItem("accessExpiration"));
    const currentTime = moment();
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshExpiration = moment(localStorage.getItem("refreshExpiration"));
    console.log(currentTime);
    console.log(accessExpiration);

    if (currentTime.isAfter(accessExpiration)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("accessExpiration");
      if(currentTime.isBefore(refreshExpiration)){
        await this.renewToken(refreshToken);
      }else{
        localStorage.clear();
        window.location.href='/login';
      }

    } else {
      const name = localStorage.getItem('username');
      if (name != null && name.trim() !== '') {
        this.userName = name;
      }
    }
    const today = new Date(Date.now());
    const formattedDate = this.formatDateToString(today)
    this.getDetailMovie(this.$route.params.id);
    this.generateNext30Days(today);
    this.getAddressMovie(this.$route.params.id, formattedDate);

  },
  methods: {

    async getDetailMovie(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/movie/getDetailMovie/${id}`);
        this.movie = response.data;
      } catch (error) {

      }
    },
    async getAddressMovie(id, day) {
      try {
        const response = await axios.get(`http://localhost:8080/api/address/getAllAddressByMovie/${id}/on/${day}`);
        this.addresses = response.data
      } catch (error) {

      }
    },
    async renewToken(refreshToken){
      const sendToken = {
        refreshToken : refreshToken,
      }
      console.log(sendToken)
      const response = await axios.post('http://localhost:8080/api/auth/refreshToken',sendToken)
      if(response.status == 200){
        localStorage.setItem('accessToken',response.data.accessToken)
        localStorage.setItem('accessExpiration',response.data.accessExpiration)
        window.location.reload()
      }
    },
    generateNext30Days(today) {
      const next30Days = [];

      for (let i = 0; i < 30; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        next30Days.push(nextDate);
      }
      this.next30Days = next30Days;
    },

    formatDate(date) {
      const options = {
        weekday: 'short',
        month: '2-digit',
        day: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    },
    togglePopup() {
      this.isPopUpOpen = true;
      const selectedDate = this.formatDateToString(this.next30Days[this.selectedDayIndex]);
      const selectedAddress = this.addresses[this.selectedAddressIndex];
      this.getSiteMovieByTimeAndAddress(this.$route.params.id, selectedDate, selectedAddress);
    },

    formatDateToString(date) {
      const year = '2024';
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    closePopup() {
      this.isPopUpOpen = false;
    },
    selectDate(index) {
      this.selectedDayIndex = index;
      const selectedAddress = this.addresses[this.selectedAddressIndex];
      this.getSiteMovieByTimeAndAddress(this.$route.params.id, this.formatDateToString(this.next30Days[index]), selectedAddress)
    },
    selectAddress(index) {
      this.selectedAddressIndex = index;
      const selectedDate = this.formatDateToString(this.next30Days[this.selectedDayIndex]);
      this.getSiteMovieByTimeAndAddress(this.$route.params.id, selectedDate, this.addresses[index])

    },
    async bookingSelect(idSite,showtime,sitename) {
      const accessToken = localStorage.getItem('accessToken')
      const selectedDate = this.formatDateToString(this.next30Days[this.selectedDayIndex]);
      if (accessToken) {
        // let cinemaName = null;
        // this.siteMovies.forEach(site => {
        //   const s = site.list.find(t => t.idSite === idSite)
        //   if(s){
        //     cinemaName = s.cinemaType;
        //   }
        // })
        const cinemaSelected = {
          idSite : idSite,
          name : sitename,
          time: selectedDate,
          showtime: showtime,
        }
        sessionStorage.setItem('setSiteMovies',JSON.stringify(cinemaSelected));
        sessionStorage.setItem('setInfoMovie', JSON.stringify(this.movie));
        this.$router.push(`/booking?idSite=${idSite}`);
      } else {
        this.$router.push("/login");
      }
    },
    async getSiteMovieByTimeAndAddress(id, time, address) {
      const requestData = {
        idMovie: id,
        address: address,
        day: time
      };
      console.log(requestData);
      try {
        const response = await axios.post('http://localhost:8080/api/site/findSite', requestData)
        this.siteMovies = response.data.map(site => ({
          name: site.name,
          address: site.address,
          list: site.list.map(times => ({
            idSite: times.idSite,
            cinemaType: times.cinemaType,
            showtimes: times.showtimes
          }))
        }))
        console.log(response);
      } catch (error) {
        console.error('Error in getSiteMovieByTimeAndAddress:', error);
      }
    }
  }
}
</script>
