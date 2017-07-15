<template>
	<div class="section trim-top">
		<!-- <h5 class="page-header">Settings</h5> -->
		<div class="box">
			<div class="settings-title">List Mode</div>
			<label>
				<input v-model="$store.state.settings.listmode" type="radio" value="last-first">&nbsp;Last, First
			</label>
			<br>
			<label>
				<input v-model="$store.state.settings.listmode" type="radio" value="first-last">&nbsp;First Last
			</label>
		</div>
		<router-link to="/" tag="button" class="button pull-right">Done</router-link>
	</div>
</template>

<script>
	export default {
		created() {
			this.$store.state.currentPage = "Settings";
		}
	}
</script>

<style scoped>
.pull-right {
	float:right;
}
.settings-title {
	border-bottom:1px solid #AAA;
	margin-bottom: 1rem;
}
</style>