<template>
	<div>
		<div class="is-hidden-desktop">
			<a v-if="$store.state.searchText.length" class="cancel-search is-hidden-mobile" href="#" style="color:white;" @click.prevent="$store.state.searchText = ''">Clear</a>
		</div>
		<div class="list-group contact-list-group">
			<div class="contact-group">{{ contactGroup.toUpperCase() }}</div>
			<ul class="list-group contact-group-list">
				<router-link :to="`/contact/${contact.contact_id}`" tag="li" class="list-group-item" v-for="contact in contactsInGroup" @click.native="$store.state.menuIsActive = false">
					<span v-if="listmode === 'first-last'">{{ contact.first_name + " " + contact.last_name }}</span>
					<span v-if="listmode === 'last-first'">{{ contact.last_name + ", " + contact.first_name }}</span>
				</router-link>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			contactGroup: String,
			contacts: Array,
			listmode: String
		},
		computed: {
			contactsInGroup() {
				console.log("contactsInGroup");
				return this.contacts.filter(contact => {
					return contact.last_name[0].toLowerCase() === this.contactGroup.toLowerCase();
				});
			}
		},
		created() {
			console.log("ContactListGroup:contacts", this.contacts);
		}
	}
</script>

<style scoped>
.contact-group {
	padding:5px 10px;
	background-color:rgba(200, 200, 200, 0.3);
	border-top:1px solid rgba(200, 200, 200, 0.8);;
	border-bottom:1px solid rgba(200, 200, 200, 0.8);;
	/*box-shadow: 0px 1px 5px 1px rgba(100, 100, 100, 0.5);*/
}
.list-group-item {
	padding:10px;
	cursor: pointer;
}
.list-group-item:hover {
	/*background-color:rgba(200, 200, 200, 0.3);*/
	box-shadow: 0px 1px 5px 1px rgba(100, 100, 100, 0.1);
}

</style>