import './assets/style.css'
import './assets/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
const store = new Vuex.Store({
    state: {
        siteMovies: null,
        infoMovies : null,
      },
      mutations: {
        SET_SITE_MOVIES(state, siteMovies) {
          state.siteMovies = siteMovies;
        },
        SET_INFO_MOVIES(state, infoMovies){
          state.infoMovies = infoMovies;
        }
      },
      actions: {
        setSiteMovies({ commit }, siteMovies) {
          commit('SET_SITE_MOVIES', siteMovies);
        },
        setInfoMovies({commit}, infoMovies){
          commit('SET_INFO_MOVIES', infoMovies);
        }
      },
      getters: {
        getSiteMovies: state => state.siteMovies,
        getInfoMovies: state => state.infoMovies,
      },
  })


const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
