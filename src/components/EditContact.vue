<template>
	<div class="section trim-top">
		<!-- first_name -->
		<div class="field">
			<label class="label">First Name <span class="danger" v-if="errors.first_name">First Name is required</span></label>
			<p class="control">
				<input class="input" type="text" v-model="contact.first_name">
			</p>
		</div>
		<!-- last_name -->
		<div class="field">
			<label class="label">Last Name <span class="danger" v-if="errors.last_name">Last Name is required</span></label>
			<p class="control">
				<input class="input" type="text" v-model="contact.last_name">
			</p>
		</div>
		<!-- birth_date -->
		<div class="field">
			<label class="label">Date of Birth <span class="danger" v-if="errors.date_of_birth">Date of Birth is required</span></label>
			<p class="control">
				<input class="input" type="date" v-model="contact.date_of_birth">
			</p>
		</div>
		<!-- phone_number -->
		<div class="field">
			<label class="label">Phone Number <span class="danger" v-if="errors.phone_number">Phone Number is required</span></label>
			<p class="control">
				<input class="input" type="phone" inputmode="tel" v-model="contact.phone_number" @keyup="phoneFormat" @paste="phoneFormat" @blur="phoneFormat" maxlength="14" placeholder="(555) 555-5555">
			</p>
		</div>
		<!-- zipcode -->
		<div class="field">
			<label class="label">Postal Code <span class="danger" v-if="errors.zipcode">Postal Code is required</span></label>
			<p class="control">
				<input class="input" type="number" inputmode="numeric" v-model="contact.zipcode" maxlength="5" placeholder="12345">
			</p>
		</div>
		<!-- submit -->
		<div class="field">
			<span class="control" style="float:right;">
				<router-link tag="button" :to="`/contact/${contact.contact_id}`" class="button" v-show="!loading">Cancel</router-link>
				<button class="button is-primary" @click.prevent="submit" :class="{ 'is-loading': loading }">Save</button>
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				contact: Object.assign(
					{ date_of_birth: this.getDateString(this.$store.getters.getContact(this.$route.params.id).birth_date), },
					this.$store.getters.getContact(this.$route.params.id)
				),
				loading: false,
			};
		},
		created() {
			this.$store.state.currentPage = "Edit";
		},
		methods: {
			zeropad(n) {
				n = n.toString();
				while (n.length < 2) n = "0" + n;
				return n;
			},
			getDateString(dateObj) {
				let d = new Date(dateObj);
				return `${d.getFullYear()}-${this.zeropad(d.getMonth() + 1)}-${this.zeropad(d.getDate())}`;
			},
			submit(e) {
				e.preventDefault();
				if (!this.canSubmit) {
					// console.log("can't submit yet!", this.contact);
					return;
				}
				this.loading = true;
				this.contact.birth_date = (new Date(this.contact.date_of_birth)).toString();
				this.contact.date_updated = (new Date()).toString();

				this.$http.put(this.$store.state.API.update, this.contact).then(result => {
					this.loading = false;
					if (result.ok) {
						let res = JSON.parse(result.body);
						if (res.success) {
							this.$store.commit("updateContact", this.contact);
							this.$router.push({path: `/contact/${this.$route.params.id}`})
						}
					}
				}).catch(err => {
					console.log("POST ERROR: ", err);
				});
			},
			phoneFormat(e) {
				// allow backspace and delete
				if (e.which !== 8 && e.which !== 46) {
					let value = e.target.value;
					let cValue = e.target.value.replace(/[^0-9]/g, "");
					if (cValue.length >= 10) {
						cValue = cValue.substr(0, 10);
					}
					switch (cValue.length) {
						case 1:
							this.contact.phone_number = "(" + cValue;
							break;

						case 3:
							this.contact.phone_number = "(" + cValue + ") ";
							break;

						case 6:
							this.contact.phone_number = "(" + cValue.substr(0, 3) + ") " + cValue.substr(3, 3) + "-";
							break;

						default:
							if (cValue.length > 6) {
								this.contact.phone_number = "(" + cValue.substr(0, 3) + ") " + cValue.substr(3, 3) + "-" + cValue.substr(6, 4);
							}
							break;

					}
				}
			},

		},
		computed: {
			canSubmit() {
				console.log('canSubmit: ', this.contact);
				return this.contact.first_name.trim().length
					&& this.contact.last_name.trim().length
					&& this.contact.date_of_birth.trim().length
					&& this.contact.zipcode.trim().length;
			},
			errors() {
				console.log('errors: ', this.contact);
				return {
					first_name: !this.contact.first_name.trim().length,
					last_name: !this.contact.last_name.trim().length,
					date_of_birth: !this.contact.date_of_birth.trim().length,
					phone_number: !this.contact.phone_number.trim().length,
					zipcode: !this.contact.zipcode.trim().length
				}
					
			}
		}
	}
</script>

<style scoped>

.label .danger {
	color:#ff3860 !important;
	opacity: 0.8;
	font-size:0.8em;
	font-weight:lighter;
	font-style: italic;
}
</style>