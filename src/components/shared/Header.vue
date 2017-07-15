<template>
	<nav class="navbar">
	  <div class="navbar-brand">
	    <router-link to="/" active-class="is-active" class="navbar-item">{{ $store.state.APPNAME }} <span class="navbar-item current-page"> {{ $store.state.currentPage.length ? '/ ' + $store.state.currentPage : '' }}</span></router-link>

	    <div class="navbar-burger burger" :class="{ 'is-active': $store.state.menuIsActive }" data-target="navMenuExample" @click="toggleMenu">
	      <span></span>
	      <span></span>
	      <span></span>
	    </div>
	  </div>
	  <div id="navMenu" class="navbar-menu" :class="{ 'is-active': $store.state.menuIsActive }">
	    <div class="navbar-start">
	    	<div class="navbar-item">
	    		<router-link to="/" class="nav-item" active-class="is-active">Contacts</router-link>
	    	</div>
	    	<div class="navbar-item">
	    		<router-link to="/add" class="nav-item" active-class="is-active">Add Contact</router-link>
	    	</div>
	      	
			<div class="navbar-item is-hidden-mobile" v-if="!$store.state.currentPage.length">
				<form class="navbar-form navbar-left">
					<div class="form-group">
						<slot name="searchfield"></slot>
					</div>
				</form>
			</div>
	    </div>
	    <div class="navbar-end">
	    	<div class="navbar-item">
	    		<router-link to="/settings" class="nav-item" active-class="is-active">Settings</router-link>
	    	</div>
	  	</div>
	  </div>
	</nav>
</template>

<script>
	export default {
		methods: {
			toggleMenu() {
				this.$store.state.menuIsActive = !this.$store.state.menuIsActive;
				if (!this.$store.state.menuIsActive) {
					this.$store.state.searchText = "";
				}
			}
		}
	}
</script>

<style>
.current-page {
	margin-left:-10px;
	font-size:0.7em;

}
.cancel-search {
	color:gray !important;
	font-size:0.8em;
}
nav.navbar {
	background-color:#f5f5f5;
	box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1);
}
</style>