<template>
	<div class="section trim-top">
		<!-- first_name -->
		<div class="field">
			<label class="label">First Name <span class="danger" v-if="errors.first_name">First Name is required</span></label>
			<p class="control">
				<input class="input" type="text" v-model="newContact.first_name">
			</p>
		</div>
		<!-- last_name -->
		<div class="field">
			<label class="label">Last Name <span class="danger" v-if="errors.last_name">Last Name is required</span></label>
			<p class="control">
				<input class="input" type="text" v-model="newContact.last_name">
			</p>
		</div>
		<!-- birth_date -->
		<div class="field">
			<label class="label">Date of Birth <span class="danger" v-if="errors.date_of_birth">Date of Birth is required</span></label>
			<p class="control">
				<input class="input" type="date" v-model="newContact.date_of_birth">
			</p>
		</div>
		<!-- phone_number -->
		<div class="field">
			<label class="label">Phone Number <span class="danger" v-if="errors.phone_number">Phone Number is required</span></label>
			<p class="control">
				<input class="input" type="phone" inputmode="tel" v-model="newContact.phone_number" @keyup="phoneFormat" @paste="phoneFormat" @blur="phoneFormat" maxlength="14" placeholder="(555) 555-5555">
			</p>
		</div>
		<!-- zipcode -->
		<div class="field">
			<label class="label">Postal Code <span class="danger" v-if="errors.zipcode">Postal Code is required</span></label>
			<p class="control">
				<input class="input" type="number" inputmode="numeric" v-model="newContact.zipcode" maxlength="5" placeholder="12345">
			</p>
		</div>
		<!-- submit -->
		<div class="field">
			<span class="control" style="float:right;">
				<router-link tag="button" to="/" class="button" v-show="!loading">Cancel</router-link>
				<button class="button is-primary" @click.prevent="submit" :class="{ 'is-loading': loading }">Save</button>
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				newContact: {
					first_name: "",
					last_name: "",
					date_of_birth: "",
					phone_number: "",
					zipcode: "",
					birth_date: "",
					date_added: "",
					date_updated: "",
				},
				loading: false,
			};
		},
		created() {
			this.$store.state.currentPage = "New Contact";
		},
		methods: {
			submit(e) {
				e.preventDefault();
				// if (this.pre)
				if (!this.canSubmit) {
					// console.log("can't submit yet!", this.newContact);
					return;
				}
				this.loading = true;
				this.newContact.birth_date = (new Date(this.newContact.date_of_birth)).toString();
				this.newContact.date_added = (new Date()).toString();
				this.newContact.date_updated = (new Date()).toString();

				this.$http.post(this.$store.state.API.add, this.newContact).then(result => {
					this.loading = false;
					if (result.ok) {
						let res = JSON.parse(result.body);
						// console.log("RES: ", res);
						if (res.success) {
							this.newContact.contact_id = res.contact_id;
							this.$store.commit("newContact", this.newContact);
							this.$router.push({path: '/'})
						}
					}
					// console.log("RESULT: ", result);
				}).catch(err => {
					// console.log("POST ERROR: ", err);
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
							this.newContact.phone_number = "(" + cValue;
							break;

						case 3:
							this.newContact.phone_number = "(" + cValue + ") ";
							break;

						case 6:
							this.newContact.phone_number = "(" + cValue.substr(0, 3) + ") " + cValue.substr(3, 3) + "-";
							break;

						default:
							if (cValue.length > 6) {
								this.newContact.phone_number = "(" + cValue.substr(0, 3) + ") " + cValue.substr(3, 3) + "-" + cValue.substr(6, 4);
							}
							break;

					}
				}
			},

		},
		computed: {
			canSubmit() {
				return this.newContact.first_name.trim().length
					&& this.newContact.last_name.trim().length
					&& this.newContact.date_of_birth.trim().length
					&& this.newContact.zipcode.trim().length;
			},
			errors() {
				return {
					first_name: !this.newContact.first_name.trim().length,
					last_name: !this.newContact.last_name.trim().length,
					date_of_birth: !this.newContact.date_of_birth.trim().length,
					phone_number: !this.newContact.phone_number.trim().length,
					zipcode: !this.newContact.zipcode.trim().length
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