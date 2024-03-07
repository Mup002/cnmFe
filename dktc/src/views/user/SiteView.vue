<template>
    <div class="section-header w-full h-[50px]">
        <ul class="flex justify-end items-center mb-2">
            <li class="mb-2 w-[150px] h-[20px] flex justify-center items-center">
                <Icon class="mr-1" icon="arcticons:offerup" />New && Offers
            </li>
            <li class="mb-2 w-[150px] h-[20px] flex justify-center items-center">
                <Icon class="mr-1" icon="mdi:ticket-outline" />My ticket
            </li>
            <li v-if="!userName" class="mb-2 w-[150px] h-[20px] flex justify-center items-center">
                <Icon @click="gotoLogin" class="mr-1" icon="codicon:account" />My Account
            </li>
            <li v-else class="mb-2 w-[150px] h-[20px] flex justify-center items-center">
                <Icon class="mr-2" icon="codicon:account" />Hi!, {{ userName }}
                <Icon class="ml-2" @click="logout" icon="icomoon-free:exit" />
            </li>
        </ul>
    </div>
    <div class="w-full h-[150px] bg-colorBgHeader flex flex-wrap justify-center items-center">
        <div class="w-full flex flex-wrap justify-center items-star">
            <img class="" src="https://www.cgv.vn/skin/frontend/cgv/default/images/cgvlogo.png" />
        </div>
        <div class="w-full flex justify-center items-center">
            <ul class="flex justify-around items-start relative">
                <li v-for="(option, index) in options" :key="index" class="px-4 text-[15px] font-bold title relative"
                    @mouseover="showOptions(index)" @mouseleave="hideOptions(index)">
                    <h2 class="">{{ option.title }}</h2>
                    <ul class="options absolute top-full left-0 w-[150px] p-1 border-2 border-white"
                        :class="{ 'hidden': !option.showOptions }"
                        style="background-image: url('https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/bg_menu_hover.png')">
                        <li v-for="(item, i) in option.items" :key="i" class="text-[15px] font-normal text-white">
                            <a :href="item.link" class="hover:text-red-500">{{ item.label }}</a>
                        </li>
                    </ul>
                </li>
                <li class="px-4 text-[15px] font-bold">CULTUREFLEX</li>
            </ul>

        </div>
    </div>
    <div class="w-full h-auto pt-2  bg-colorBgSite ">
        <div class="border-2 w-full border-t-4 mt-4 border-b-0 border-l-0 border-r-0 border-colorTextCgv"></div>
        <div class="w-full h-auto flex mt-4 justify-center items-center">
            <h1 class="text-colorTextCgv text-4xl font-bold custom-cgv">CGV CINEMAS </h1>
        </div>
        <div class="w-full flex justify-center">
            <div class="border-2 w-4/5 border-t-4 mt-4 border-b-0 border-l-0 border-r-0 border-colorTextCgv">
            </div>
        </div>
        <div class="w-full flex justify-center items-center">
            <div class="w-4/5">
                <ul class="flex flex-wrap justify-center items-center">
                    <li class="flex justify-center items-center my-2 w-1/5" v-for="(address, index) in addresses"
                        :key="index">
                        <h1 @click="getAllSiteByAddressId(address.id)" class="text-colorTextSite hover:text-red-700" >{{ address.name }}</h1>
                    </li>
                </ul>
            </div>
        </div>

        <div class="w-full flex justify-center">
            <div class="border-2 w-4/5 border-t-4 mt-4 border-b-0 border-l-0 border-r-0 border-colorTextCgv"></div>
        </div>
        <div class="w-full flex justify-center items-center">
            <div class="w-4/5">
                <ul class="flex  flex-wrap justify-center items-center">
                    <li class="flex justify-center items-center my-2 w-1/3" v-for="(site, index) in sitename"
                        :key="index">
                        <h1  class="text-colorTextSite hover:text-red-700" >{{ site.siteName }}</h1>
                    </li>
                </ul>
            </div>
        </div>
        <div class="border-2 w-full border-t-4 mb-4 mt-4 pb-4 border-b-0 border-l-0 border-r-0 border-colorTextCgv"></div>
    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import { Icon } from '@iconify/vue';
export default {
    components: {
        Icon,
    },
    data() {
        return {
            userName: '',
            options: [
                {
                    title: 'PHIM',
                    showOptions: false,
                    items: [
                        { label: 'PHIM ĐANG CHIẾU', link: '#' },
                        { label: 'PHIM SẮP CHIẾU', link: '#' },
                    ],
                },
                {
                    title: 'RẠP CGV',
                    showOptions: false,
                    items: [
                        { label: 'TẤT CẢ RẠP', link: '/site/default' },
                        { label: 'RẠP ĐẶC BIỆT', link: '#' },
                        { label: 'RẠP 3D', link: '#' },
                    ],
                },
                {
                    title: 'THÀNH VIÊN',
                    showOptions: false,
                    items: [{ label: 'QUYỀN LỢI', link: '#' }],
                },
            ],
            addresses: [],
            sitename:[],
        }
    },
    async mounted() {
        const accessToken = localStorage.getItem("accessToken");
        const accessExpiration = moment(localStorage.getItem("accessExpiration"));
        const currentTime = moment();
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshExpiration = moment(localStorage.getItem("refreshExpiration"));
        if (currentTime.isAfter(accessExpiration)) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("accessExpiration");
            if (currentTime.isBefore(refreshExpiration)) {
                await this.renewToken(refreshToken);
            } else {
                localStorage.clear();
            }
            window.location.reload();
        } else {
            const name = localStorage.getItem('username');
            if (name != null && name.trim() !== '') {
                this.userName = name;
            }
        }

        await this.getAllSiteAddress();
    },
    methods: {
        setActiveSlide() {
            const slides = document.querySelectorAll(".slide");
            slides.forEach((slide) => {
                slide.classList.remove("active");
            });
            slides[this.currentIndex].classList.add("active");
        },
        showOptions(index) {
            this.options[index].showOptions = true;
        },
        hideOptions(index) {
            this.options[index].showOptions = false;
        },
        gotoLogin() {
            window.location.href = "/login";
        },
        async logout() {

            const response = await axios.get('http://localhost:8080/api/auth/logout');
            if (response.status == 200) {
                localStorage.clear();
                Swal.fire({
                    title: 'Logout Successful!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: ' OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/";
                    }
                });
            }

        },
        async renewToken(refreshToken) {
            const sendToken = {
                refreshToken: refreshToken,
            }
            console.log(sendToken)
            const response = await axios.post('http://localhost:8080/api/auth/refreshToken', sendToken)
            if (response.status == 200) {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('accessExpiration', response.data.accessExpiration)
                window.location.reload()
            }
        },


        async getAllSiteAddress() {
            const response = await axios.get('http://localhost:8080/api/site/getAllAddress')
            if (response.status == 200) {
                this.addresses = response.data;
            }
        },
        async getAllSiteByAddressId(idSite){
            const response = await axios.get(`http://localhost:8080/api/site/getSiteByAddress/${idSite}`);
            if(response.status == 200){
                this.sitename = response.data;
            }
        }
    }
}
</script>
