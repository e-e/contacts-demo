import Vue from "vue";
import Vuex from "vuex";
import { sortBy } from "../utils/sortBy";

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		API: {
			contacts: "http://api.eric.wtf/contacts",
			contact: "http://api.eric.wtf/contacts/",
			add: "http://api.eric.wtf/add",
			update: "http://api.eric.wtf/update",
			delete: "http://api.eric.wtf/delete/",
			zipcode: "https://www.zipcodeapi.com/rest/js-hJPuwhlzEc8NfJ01HXKhjBUN5da40ITisJNZ09yEmGrCqsE7pooJZjw5wH9xq3QS/info.json/",
			zipAppKey: "VIVEKgbZRd1veuiT7MG8uWcVYMqq2XYYGUCqaOq11rxgVP93BQb6Mo2Lascdpac6",
		},
		zipcodeAppKey: "",
		APPNAME: "MyContacts",
		settings: {
			listmode: "last-first",
		},
		menuIsActive: false,
		currentPage: "",
		searchText: "",
		usersLoaded: false,
		contacts: [
			{ contact_id: 1, first_name: "Eric", last_name: "Ellingson" },
			{ contact_id: 2, first_name: "Dennis", last_name: "Ellingson" },
			{ contact_id: 3, first_name: "Louise", last_name: "Ellingson" },
			{ contact_id: 4, first_name: "Ryan", last_name: "Ellingson" },
			{ contact_id: 5, first_name: "Amy", last_name: "Friedman" },
			{ contact_id: 6, first_name: "Bob", last_name: "Dole" },
			{ contact_id: 7, first_name: "Frank", last_name: "Zappa" },
		],
		collaped: {},
	},
	getters: {
		visibleContacts: state => {
			let re = new RegExp("[^a-zA-Z]", "g");
			let term = state.searchText.replace(re, "").toLowerCase();
			// console.log("TERM: ", term);
			if (!term.length) {
				return state.contacts;
			}
			let contacts = [];
			switch (state.settings.listmode) {
				case "last-first":
					contacts = state.contacts.filter(contact => {
						let name = (contact.last_name + contact.first_name).toLowerCase().replace(re, "");
						return name.match(term);
					});
					break;

				case "first-last":
					contacts = state.contacts.filter(contact => {
						let name = (contact.first_name + contact.last_name).toLowerCase().replace(re, "");
						return name.match(term);
					});
					break;
			}
			return contacts.sort(sortBy("last_name", { name: "first_name"}));
		},
		getContact(state) {
			return id => {
				let contact = {};
				for (let i = 0; i < state.contacts.length; i++) {
					if (state.contacts[i].contact_id == id) {
						contact = state.contacts[i];
						break;
					}
				}
				return contact;
			};
		},
	},
	mutations: {
		updateContact(state, contact) {
			// console.log("UPDATING CONTACT");
			for (let i = 0; i < state.contacts.length; i++) {
				if (state.contacts[i].contact_id == contact.contact_id) {
					state.contacts[i] = contact;
					break;
				}
			}
		},
		newContact(state, contact) {
			// console.log("ADDING CONTACT");
			state.contacts.push(contact);
		},
		deleteContact(state, contactId) {
			for (let i = 0; i < state.contacts.length; i++) {
				if (state.contacts[i].contact_id == contactId) {
					state.contacts.splice(i, 1);
					break;
				}
			}
		}
	}
});