<template>
	<div class="section trim-top">
		<div class="card">
		  <div class="card-content">
		    <div class="media">
		      <div class="media-left">
		      	<div class="image is-48x48 initials" :style="{ 'background-color': initialsColor }">{{ `${contact.first_name.substr(0, 1).toUpperCase()}${contact.last_name.substr(0, 1).toUpperCase()}` }}</div>
		       <!--  <figure class="image is-48x48">
		          <img src="http://bulma.io/images/placeholders/96x96.png" alt="Image">
		        </figure> -->
		      </div>
		      <div class="media-content">
		        <p class="title is-4">{{ contact.first_name }} {{ contact.last_name }} <router-link tag="span" :to="`/contact/edit/${contact.contact_id}`" class="edit button is-small is-success is-outlined">Edit</router-link></p>
		        <p class="subtitle is-6"><a :href="`tel:${contact.phone_number }`">{{ contact.phone_number }}</a></p>
		      </div>
		    </div>

		    <div class="content">
		    	<div class="detail-wrap">
		    		<div class="detail-title">Date of Birth</div>
		    		<div class="detail-item">{{ contact.birth_date | formatDate }}</div>
		    	</div>
		    	<div class="detail-wrap">
		    		<div class="detail-title">Location <span class="is-loading"></span></div>
		    		<div class="detail-item"><span v-if="showCityState">{{ contact.city }}, {{ contact.state }}, </span>{{ contact.zipcode }}</div>
		    		<!-- <div class="detail-item" v-if="contact.city.length"></div> -->
		    		<!-- <div class="detail-item" v-if="contact.state.length"></div> -->
		    	</div>
		    	<div class="detail-wrap">
		    		<div class="detail-title">Contact Created</div>
		    		<div class="detail-item">{{ contact.date_added | formatDate }}</div>
		    	</div>
		      <br>
		      
		      <small class="small">Last Updated: {{ contact.date_updated | formatDate }}</small>
		      <div class="delete-wrap">
		      	<span class="is-right is-delete is-danger is-small" @click="showConfirmDelete = true">Delete Contact</span>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="modal" :class="{ 'is-active': showConfirmDelete }">
			<div class="modal-background"></div>
			<div class="modal-content">
				<div class="box">
					<div class="content">
						Are you sure you want to delete this contact? This cannot be undone.
					</div>
					<div style="text-align:right;">
						<button class="button is-default" @click="showConfirmDelete = false">Cancel</button>
						<button class="button is-danger" :class="{ 'is-loading': isDeleting }" @click="deleteContact">Delete Contact</button>
					</div>
				</div>
					
			</div>
			<button class="modal-close is-large" @click="showConfirmDelete = false"></button>
		</div>
	</div>
</template>

<script>
	export default {
		created() {
			// this.$store.state.currentPage = this.contact.first_name + " " + this.contact.last_name;
			this.$store.state.currentPage = "Contact Info";
			this.$http.get(this.$store.state.API.zipcode + this.contact.zipcode + "/degrees").then(response => {
				// console.log("ZIP RESPONSE", response);
				if (response.ok) {
					try {
						let res = JSON.parse(response.body);
						this.contact.city = res.city;
						this.contact.state = res.state;
					} catch (e) {}
					// console.log(response);						
				}
			}).catch(err => {
				// console.log("zipcode api error: ", err);
			});
		},
		data() {
			return {
				id: this.$route.params.id,
				contact: Object.assign(
					{city: "", state: ""},
					this.$store.getters.getContact(this.$route.params.id)
				),
				showConfirmDelete: false,
				isDeleting: false,
			}
		},
		watch: {
			'$route'(to, from) {
				// console.log("route changed!");
				this.contact = this.$store.getters.getContact(to.id);
			}
		},
		computed: {
			showCityState() {
				return this.contact.city.length && this.contact.state.length;
			},
			dateAdded() {
				let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"];
				let d = new Date(this.contact.date_added);
				let month = months[d.getMonth()];
				let day = d.getDate();
				let dayOfWeek = daysOfWeek[d.getDay()];
				let year = d.getFullYear();

				return `${dayOfWeek}, ${month} ${day}, ${year}`;
			},
			initialsColor() {
				let colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#FF5722", "#9E9E9E", "#607D8B"];
				let index = (this.contact.first_name + this.contact.last_name).length % colors.length;
				return colors[index];
			},
		},
		filters: {
			phoneNumber(value) {
				// console.log("phone number: ", value);
				return "(" + value.substr(0, 3) + ") " + value.substr(3, 3) + "-" + value.substr(6, 4);
			},
			formatDate(value) {
				let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"];
				let d = new Date(value);
				let month = months[d.getMonth()];
				let day = d.getDate();
				let dayOfWeek = daysOfWeek[d.getDay()];
				let year = d.getFullYear();

				return `${dayOfWeek}, ${month} ${day}, ${year}`;
			}
		},
		methods: {
			deleteContact(value) {
				this.isDeleting = true;
				this.$http.get(this.$store.state.API.delete + this.contact.contact_id.toString()).then(response => {
					// console.log("DELETE RESPONSE: ", response);
					if (response.ok) {
						let res = JSON.parse(response.body);
						if (res.success) {
							this.$store.commit("deleteContact", this.contact.contact_id);
							this.isDeleting = false;
							this.showConfirmDelete = false;
							this.$router.push({path: "/"});
						}
					}
				}).catch(err => {
					// console.log("DELETE ERROR: ", err);
				});
			},
		}
	}
</script>

<style scoped>
.delete-wrap {
	margin-top:0.5rem;
	border-top:1px solid #CCC;
	padding-top:0.5rem;
}
.is-delete {
	color:#ff3860 !important;
	font-size:0.8rem;
}
.is-right {
	float:right;
}
.edit {
	height:initial !important;
	padding-top:2px !important;
	padding-bottom:2px !important;
	color:#4CAF50;
	font-size:1.2rem;
	float:right;
}
.small {
	font-size:0.8em;
	color:#777;
}
.detail-wrap {
	margin:8px 0px;
	font-size:0.9rem;
}
.detail-title {
	/*text-transform: uppercase;*/
	color:#444;
	font-weight: bold;
}
.detail-item {

}
.initials {
	background-color:#CCC;
	border-radius:50%;
	display:flex;
	align-content:center;
	justify-content:center;
	color:white;
	align-items: center;
}
h6 {
	font-size:0.7em;
	font-weight:lighter;
	color:#AAA;
}
</style>