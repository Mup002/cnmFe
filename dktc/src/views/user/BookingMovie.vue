<template>
    <div class="w-full flex flex-wrap justify-center items-center">
        <div class="w-full h-[50px] bg-black mb-[1px]">
            <h1 class="font-bold flex justify-center items-center text-white text-[30px]">BOOKING ONLINE</h1>
        </div>
        <div class="w-full p-1 h-[50px] bg-colorBgHeader">
            <h1>{{ cinemaInfo.name }} | Cinema {{ this.$route.query.idSite }} | Số ghế ({{ this.numberSelectedSeat }} / {{
                this.numberTotalSeat }})</h1>
            <h1>{{ cinemaInfo.time }} {{ cinemaInfo.showtime }} ~ {{ cinemaInfo.time }} {{ this.endTime }}</h1>
        </div>
        <div class="w-full h-[40px] bg-colorBgHeader2 mb-8">
            <h1 class="font-bold p-2  flex justify-center items-center text-[#222222]"> Người / Ghế</h1>
        </div>
        <div class="w-2/3 mx-auto flex flex-wrap justify-center items-center">
            <div class="w-full flex flex-wrap justify-center items-center">
                <img class="w-full mx-auto"
                    src="https://www.cgv.vn/skin/frontend/cgv/default/images/bg-cgv/bg-screen.png" />
            </div>
            <div class="w-2/3 flex flex-wrap justify-center mt-[100px] mb-[50px]">
                <ul class="flex flex-wrap justify-center w-[400px] h-auto pb-[10px] border-2 border-black">
                    <li v-for="(seat, index) in detailSite" :key="index">
                        <ul class="flex flex-wrap justify-center pt-2 w-[400px] h-auto pb-[10px] ">
                            <li v-for="(number, indexx) in seats.slice(seat.seatCurrent - seat.seatQuantity, seat.seatCurrent)"
                                :key="indexx" class="text-[10px] font-semibold w-[25px] h-[20px] px-1 ml-1 mt-[2px]  border-2 justify-center items-center flex
                            cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 "
                                :style="{ borderColor: getBorderColor(seat.seatType) }"
                                :class="{ 'checked': isSelected(number), 'ordered': isOrdered(number) }"
                                @click="addSeatToBill(number, seat.seatType, seat.seatPrice)">
                                {{ number }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="w-2/3">
                <ul class="w-full">
                    <li v-for="(seat, index) in detailSite" :key="index"
                        class="font-semibold ml-1 w-[200px] flex justify-start items-center">
                        {{ seat.seatType }} : <div class="ml-1 w-[25px] h-[25px] border-2"
                            :style="{ borderColor: getBorderColor(seat.seatType) }"></div>
                    </li>
                    <li class="font-semibold ml-1 w-[200px] flex justify-start items-center">
                        ĐÃ CHỌN :
                        <div class="ml-1 w-[25px] h-[25px] border-2 bg-colorSeatSelected"></div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="w-full h-[200px] bg-black px-4 pt-[10px] mb-[1px] rounded-lg mt-8">
            <ul class="w-full h-2/3 flex flex-wrap justify-between">
                <li class="text-white h-full w-[15%] flex justify-center pt-6 items-start">
                    <div class="w-full h-full w-full items-center flex justify-center">
                        <img class="object-contain h-[150px]" :src="movieInfo.img" />
                    </div>
                </li>
                <li class="text-white w-[10%] pt-6 flex justify-center items-start">
                    <h2>{{ movieInfo.name }}</h2>
                </li>
                <li class="text-white w-[30%] flex justify-center pt-6 items-start">
                    <ul id="infoBill" class="flex flex-col items-start">
                        <li class="">{{ this.cinemaInfo.name }}</li>
                        <li class="">Suất chiếu {{ cinemaInfo.showtime }} , {{ cinemaInfo.time }}</li>
                        <li class="">Phòng chiếu Cinema {{ cinemaInfo.idSite }}</li>
                        <li v-if="selectedSeats.length > 0" class="">Ghế {{ selectedSeats }}</li>

                    </ul>
                </li>
                <li class="text-white w-[30%] flex justify-center pt-6 items-start">Tổng tiền : {{
                    this.formatNNumber(this.totalPrice) }} vnd</li>

            </ul>
            <div class="w-full h-1/3 flex justify-center items-center">
                <button class="text-white w-[100px] h-[50px] border-white border-2 rounded-xl hover:scale-110"
                    @click="checkout()">Thanh
                    toán</button>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            status: '',
            detailSite: [],
            seats: [],
            cinemaInfo: '',
            movieInfo: '',
            selectedSeats: [],
            selectedType: '',
            totalPrice: 0,
            sendTicketData: '',
            orderedSeats: [],
            numberTotalSeat: '',
            numberSelectedSeat: '',
            endTime: '',
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
                window.location.href = '/login';
            }

        } else {
            const name = localStorage.getItem('username');
            if (name != null && name.trim() !== '') {
                this.userName = name;
            }
        }
        const info1 = JSON.parse(sessionStorage.getItem("setSiteMovies"));
        this.cinemaInfo = {
            name: info1.name,
            idSite: info1.idSite,
            showtime: info1.showtime,
            time: info1.time
        };
        console.log(this.cinemaInfo);
        const info2 = JSON.parse(sessionStorage.getItem("setInfoMovie"))
        this.movieInfo = {
            actor: info2.actor,
            categoriesName: info2.categoriesName,
            description: info2.description,
            director: info2.director,
            id: info2.id,
            img: info2.img,
            language: info2.language,
            name: info2.name,
            rating: info2.rating,
            startTime: info2.startTime,
            timing: info2.timing,
        }

        const idSite = this.$route.query.idSite;
        await this.getAllSlot(idSite);
        let totalSeat = 0;
        for (let i = 0; i < this.detailSite.length; i++) {
            totalSeat += this.detailSite[i].seatQuantity
        }
        await this.seatsGeneration(totalSeat);
        const requestData = {
            idSite: this.cinemaInfo.idSite,
            idMovie: this.movieInfo.id,
            time: this.cinemaInfo.showtime,
            day: this.cinemaInfo.time
        }

        await this.getAllOrderedSeats(requestData);
        this.timeCaculate(this.cinemaInfo.showtime, this.movieInfo.timing);
    },
    methods: {
        async getAllSlot(idSite) {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
            const response = await axios.get(`http://localhost:8080/api/booking/detailsSite/${idSite}`, config);
            if (response.status == 200) {
                let currentQuantity = 0;
                this.detailSite = response.data.map(type => {
                    currentQuantity += type.quantity_seats;
                    return {
                        seatTypeId: type.id_details,
                        seatType: type.seat_type,
                        seatPrice: type.price_seat,
                        seatQuantity: type.quantity_seats,
                        seatCurrent: currentQuantity,
                    }
                })
                this.numberTotalSeat = currentQuantity;
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
        seatsGeneration(quantity) {
            const seatTypes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const totalRows = Math.floor(quantity / 12) + quantity % 12;

            var d = 0;
            let generatedSeats = [];
            let seatCount = 0;
            if (this.seats.length !== 0) {
                d = Math.floor(this.seats.length / 12);
            }
            for (let row = 1; row <= totalRows; row++) {
                for (let seatNum = 1; seatNum <= 12; seatNum++) {
                    if (seatCount < quantity) {
                        const seatChar = seatTypes[d] + seatNum;
                        this.seats.push(seatChar);
                        generatedSeats.push(seatChar);
                        seatCount++;
                    } else {
                        break;
                    }
                }
                d++;
            }
        },
        getBorderColor(seatType) {
            switch (seatType) {
                case 'Thường':
                    return 'green';
                case 'VIP':
                    return 'red';
                case 'GOLD':
                    return 'yellow';
                case 'SWEETBOX':
                    return 'pink';
                default:
                    return 'black';
            }
        },
        addSeatToBill(seatNumber, seatType, price_seat) {
            let tempTotal = parseFloat(this.totalPrice);
            if (this.selectedType == null || this.selectedType == '' || this.selectedType == seatType) {
                if (seatType === 'SWEETBOX') {
                    const matches = seatNumber.match(/\d+/);
                    const currentSeatNumber = parseInt(matches[0]);
                    const seatLetter = seatNumber.substring(0, 1); // Lấy phần chữ cái của ghế

                    const nextSeatNumber = currentSeatNumber - 1;
                    const nextSeat = seatLetter + nextSeatNumber; // Tạo chuỗi ghế tiếp theo

                    const prevSeatNumber = currentSeatNumber + 1;
                    const prevSeat = seatLetter + prevSeatNumber; // Tạo chuỗi ghế trước đó
                    if (this.selectedSeats.includes(seatNumber)) {
                        if (currentSeatNumber % 2 === 0) {
                            this.selectedSeats.splice(this.selectedSeats.indexOf(seatNumber), 1);
                            this.selectedSeats.splice(this.selectedSeats.indexOf(nextSeat), 1);

                        } else {
                            this.selectedSeats.splice(this.selectedSeats.indexOf(prevSeat), 1);
                            this.selectedSeats.splice(this.selectedSeats.indexOf(seatNumber), 1);
                        }

                        tempTotal -= parseFloat(price_seat) * 2;
                        this.totalPrice = tempTotal;
                    } else {
                        if (currentSeatNumber % 2 === 0) {
                            this.selectedSeats.push(nextSeat);
                            this.selectedSeats.push(seatNumber);
                        } else {

                            this.selectedSeats.push(seatNumber);
                            this.selectedSeats.push(prevSeat);
                        }

                        tempTotal += parseFloat(price_seat) * 2;
                        this.totalPrice = tempTotal;
                        this.selectedType = seatType;
                    }

                } else {
                    if (this.selectedSeats.includes(seatNumber)) {
                        this.selectedSeats.splice(this.selectedSeats.indexOf(seatNumber), 1);
                        this.selectedType = null

                        tempTotal -= parseFloat(price_seat);
                        this.totalPrice = tempTotal;
                    } else {
                        this.selectedSeats.push(seatNumber);
                        this.selectedType = seatType;

                        tempTotal += parseFloat(price_seat);
                        this.totalPrice = tempTotal;
                    }
                }
            } else if (this.selectedType != seatType) {
                window.alert('Cant choose another type of seat')
            }
        },
        isSelected(seatNumber) {

            return this.selectedSeats.includes(seatNumber);
        },
        formatNNumber(number) {
            return number.toLocaleString('en-US', {
                useGrouping: true,
                thousandsSeparator: ','
            });
        },
        async getAllOrderedSeats(requestData) {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
            const response = await axios.post('http://localhost:8080/api/booking/getAllTicket', requestData, config)
            if (response.status === 200) {
                response.data.map(s => {
                    this.orderedSeats.push(s.seatNumber);
                })
                // console.log(response.data);
            }
        },
        isOrdered(seatNumber) {
            this.numberSelectedSeat = this.orderedSeats.length;
            return this.orderedSeats.includes(seatNumber);
        },
        async checkout() {
            if (this.selectedSeats.length === 0) {
                Swal.fire({
                    title: 'Please select seats u want!!',
                    icon: 'danger',
                    showCancelButton: false,
                    confirmButtonText: ' OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                const requestData = {
                    userName: localStorage.getItem('username'),
                    movieName: this.movieInfo.name,
                    day: this.cinemaInfo.time,
                    time: this.cinemaInfo.showtime,
                    totalPrice: this.totalPrice,
                    seatNumbers: this.selectedSeats,
                    seatType: this.selectedType,
                    idSite: this.cinemaInfo.idSite,
                }
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
                const response = await axios.post('http://localhost:8080/api/booking/createdTicket', requestData, config);
                console.log(requestData);
                if (response.status == 200) {
                    Swal.fire({
                        title: 'Checkout Successful!',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: ' OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            }
        },
        formatDateToString(date) {
            const formattedDate = date.split("-").reverse().join("-");
            return formattedDate;
        },
        timeCaculate(showtime, timing) {
            var hour1 = parseInt(showtime.split(":")[0]);
            var minute1 = parseInt(showtime.split(":")[1].split(" ")[0]);

            var time = parseInt(timing.slice(0, timing.indexOf("p")));
            var hour2 = parseInt(time / 60);
            var minute2 = time % 60;

            var minute3 = minute2 + minute1;
            var hour3 = hour2 + hour1;

            if (minute3 >= 60) {
                hour3 = hour3 + parseInt(minute3 / 60);
                minute3 = minute3 % 60;
            }

            var formattedHour = parseInt(hour3);
            var formattedMinute = parseInt(minute3);

        
            formattedHour = formattedHour < 10 ? "0" + formattedHour : formattedHour;
            formattedMinute = formattedMinute < 10 ? "0" + formattedMinute : formattedMinute;

            this.endTime = formattedHour + ":" + formattedMinute + showtime.split(":")[1].split(" ")[1];
        }


    }
}
</script>
