<template>
  <div class="container">
    <app-header>
      <!-- <input slot="searchfield" type="text" class="form-control" placeholder="Search" v-model="$store.state.searchText"> -->
      <p slot="searchfield" class="control has-icons-left">
        <input class="input is-small" type="text" placeholder="Search" v-model="$store.state.searchText" @keyup.esc="$store.state.searchText = ''">
        <span class="icon is-small is-left">
          <i class="fa fa-search"></i>
        </span>
        <span class="icon is-small is-right" v-if="$store.state.searchText.length" @click="$store.state.searchText = ''">
          x<!-- <i>x</i> -->
        </span>
      </p>
    </app-header>
    <div class="section trim-both" v-if="!$store.state.currentPage.length">
      <p slot="searchfield" class="control has-icons-left is-hidden-desktop">
        <input class="input is-small" type="text" placeholder="Search" v-model="$store.state.searchText" @keyup.esc="$store.state.searchText = ''">
        <span class="icon is-small is-left">
        <i class="fa fa-search"></i>
        </span>
        <span class="icon is-small is-right" v-if="$store.state.searchText.length" @click="$store.state.searchText = ''">&#10005;</span>
      </p>
    </div>
    <div v-if="$store.state.usersLoaded">
      <router-view ></router-view>
    </div>
    <loading v-if="!$store.state.usersLoaded"></loading>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import Loading from "./components/Loading.vue";

export default {
  components: {
    "app-header": Header,
    "loading": Loading,
  },
  data () {
    return {

    }
  },
  methods: {
    doSearch(e) {
      let text = e.target.value;
      this.contacts
    }
  },
  computed: {
    showingContacts() {
      if (!this.searchText.length) {
        return this.contacts
      }
      return this.contacts.match(this.searchText);
    }
  },
  watch: {
    '$route'() {
      this.$store.state.currentPage = "";
      this.$store.state.menuIsActive = false;
    }
  },
  created() {
    this.$http.get(this.$store.state.API.contacts).then(response => {
      // console.log(response);
      // let res = JSON.parse(response.body);
      this.$store.state.contacts = response.body.data;
      this.$store.state.usersLoaded = true;
      // console.log(this.$store.state);
    }).catch(err => {
      // console.error("UH OH!", err);
    });
  }
}
</script>

<style>
.section.trim-both {
  padding-top:0.5rem;
  padding-bottom:0.5rem;
}
.is-right {
  right:0;
  color:#444 !important;
  z-index:999999 !important;
  cursor: pointer !important;
  pointer-events: initial !important;
}
h5.page-header {
  /*padding:0;*/
  /*margin:0;*/
  text-transform: uppercase;
  border-bottom: 1px solid rgba(100, 100, 100, 0.3);
  margin-bottom:1.5rem;
}
.section.trim-top {
  padding-top:1.5rem;
}
input[type="text"] {
  border-radius:4px;
  border:1px solid rgba(150, 150, 150, 0.7);
  padding:6px;
}
.mobile-search-wrap {
  width:80%;
  display:flex;
  justify-content: center;
  align-items: center;
  padding-top:5px;
  padding-bottom: 5px;
}
</style>
