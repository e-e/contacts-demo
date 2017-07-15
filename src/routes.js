import ContactList from "./components/ContactList.vue";
import Settings from "./components/Settings.vue";
import AddContact from "./components/AddContact.vue";
import ContactInfo from "./components/ContactInfo.vue";
import EditContact from "./components/EditContact.vue";

export const routes = [
	{ path: "/", component: ContactList },
	{ path: "/settings", component: Settings },
	{ path: "/add", component: AddContact },
	{ path: "/contact/:id", component: ContactInfo },
	{ path: "/contact/edit/:id", component: EditContact },
];