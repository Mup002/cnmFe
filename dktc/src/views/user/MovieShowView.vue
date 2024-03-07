<template>
    <main class="w-full flex flex-row flex-wrap justify-center">
      <div class="category-products cgv-movies w-10/12 mx-auto">
        <ul class="flex flex-wrap justify-center w-full h-full mx-4">
          <li v-for="(movie, index) in movies" :key="index" class="film-list item p-2 mx-8 h-5/8 w-1/4 flex flex-col">
            <router-link :to="{path : '/detail/' + movie.id}">
              <div class="relative w-full flex-1 border-8 border-black  p-1 h-3/4">
                <img :src="movie.img" alt="Movie Poster" class="object-cover w-full h-full"/>
              </div>
              <div class="pt-1 h-1/4">
                <h2 class="text-xl font-bold text-colorText">{{ movie.name }}</h2>
                <p class="text-xs text-colorText"><span class="font-bold">Thể loại </span>: {{ movie.categoriesName.join(', ') }}</p>
                <p class="text-xs text-colorText"><span class="font-bold">Thời lượng</span>: {{ movie.timing }}</p>
                <p class="text-xs text-colorText"><span class="font-bold">Ngày chiếu</span>: {{ movie.startTime }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </main>
  </template>
  
  
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            movies: [],
        };
    },
    mounted() {
        this.getAllMovie();
    },
    methods: {
        async getAllMovie() {
            try {
                const response = await axios.get('http://localhost:8080/api/movie/getAll');
                this.movies = response.data.map(movie => ({
                    id:movie.id,
                    rating: movie.rating,
                    img: movie.img,
                    name: movie.name,
                    categoriesName: movie.categoriesName,
                    timing: movie.timing,
                    startTime: movie.startTime,
                }));
                console.log(this.movies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        }
    },

    
};
</script>
  