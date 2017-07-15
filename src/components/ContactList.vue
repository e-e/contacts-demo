<template>
	<div>
		<contact-list-group v-for="group in contactGroups" :key="group" :listmode="$store.state.settings.listmode" :contacts="showingContacts" :contactGroup="group"></contact-list-group>
	</div>
</template>

<script>
	import ContactListGroup from "./ContactListGroup.vue";
	import { sortBy } from "../utils/sortBy.js";



	export default {
		components: {
			"contact-list-group": ContactListGroup,
		},
		methods: {
			// visibleContacts() {
			// 	let re = new RegExp("[^a-zA-Z]", "g");
			// 	let term = this.$store.state.searchText.replace(re, "").toLowerCase();
			// 	console.log("TERM: ", term);
			// 	if (!term.length) {
			// 		return this.$store.state.contacts;
			// 	}
			// 	let contacts = [];
			// 	switch (this.$store.state.settings.listmode) {
			// 		case "last-first":
			// 			contacts = this.$store.state.contacts.filter(contact => {
			// 				let name = (contact.last_name + contact.first_name).toLowerCase().replace(re, "");
			// 				return name.match(term);
			// 			});
			// 			break;

			// 		case "first-last":
			// 			contacts = this.$store.state.contacts.filter(contact => {
			// 				let name = (contact.first_name + contact.last_name).toLowerCase().replace(re, "");
			// 				return name.match(term);
			// 			});
			// 			break;
			// 	}
			// 	return contacts.sort(sortBy("last_name", { name: "first_name"}));
			// }
		},
		computed: {
			sortedContacts() {
				return this.$store.state.contacts.sort(sortBy("last_name", { name: "first_name"}));
			},
			contactGroups() {
				let groups = [];
				let contacts = this.$store.getters.visibleContacts;
				for (let i = 0; i < contacts.length; i++) {
					let c = contacts[i].last_name[0].toLowerCase();
					if (groups.indexOf(c) === -1) {
						groups.push(c);
					}
					if (groups.length === 26) break;
				}
				return groups.sort();
			},
			showingContacts() {
				return this.$store.getters.visibleContacts;
			}
		}
	}
</script>

<style>

</style>