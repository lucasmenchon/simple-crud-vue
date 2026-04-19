"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContactsStore = void 0;
var pinia_1 = require("pinia");
var STORAGE_KEY = 'scv-contacts-v3';
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
exports.useContactsStore = (0, pinia_1.defineStore)('contacts', function () {
    var contacts = ref([]);
    var searchQuery = ref('');
    var filterGender = ref('');
    var filterCategory = ref('');
    var filterFavorites = ref(false);
    var sortConfig = ref({ field: 'name', direction: 'asc' });
    var editingId = ref(null);
    function loadContacts() {
        var _a;
        if (!import.meta.client)
            return;
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw)
                contacts.value = (_a = JSON.parse(raw)) !== null && _a !== void 0 ? _a : [];
        }
        catch ( /* ignore corrupt data */_b) { /* ignore corrupt data */ }
    }
    function persist() {
        if (import.meta.client)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts.value));
    }
    var filteredContacts = computed(function () {
        var result = __spreadArray([], contacts.value, true);
        if (searchQuery.value) {
            var q_1 = searchQuery.value.toLowerCase();
            result = result.filter(function (c) {
                return c.name.toLowerCase().includes(q_1) ||
                    c.email.toLowerCase().includes(q_1) ||
                    c.phone.includes(q_1) ||
                    c.notes.toLowerCase().includes(q_1) ||
                    c.category.toLowerCase().includes(q_1);
            });
        }
        if (filterGender.value)
            result = result.filter(function (c) { return c.gender === filterGender.value; });
        if (filterCategory.value)
            result = result.filter(function (c) { return c.category === filterCategory.value; });
        if (filterFavorites.value)
            result = result.filter(function (c) { return c.favorite; });
        var _a = sortConfig.value, field = _a.field, direction = _a.direction;
        result.sort(function (a, b) {
            var _a, _b;
            var va = (_a = a[field]) !== null && _a !== void 0 ? _a : '';
            var vb = (_b = b[field]) !== null && _b !== void 0 ? _b : '';
            if (typeof va === 'string')
                va = va.toLowerCase();
            if (typeof vb === 'string')
                vb = vb.toLowerCase();
            if (va < vb)
                return direction === 'asc' ? -1 : 1;
            if (va > vb)
                return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    });
    var totalContacts = computed(function () { return contacts.value.length; });
    var favoriteCount = computed(function () { return contacts.value.filter(function (c) { return c.favorite; }).length; });
    var hasActiveFilters = computed(function () {
        return !!searchQuery.value || !!filterGender.value || !!filterCategory.value || filterFavorites.value;
    });
    var stats = computed(function () {
        var totalAge = 0;
        var ageCount = 0;
        contacts.value.forEach(function (c) { if (c.age) {
            totalAge += c.age;
            ageCount++;
        } });
        return {
            total: contacts.value.length,
            favorites: favoriteCount.value,
            avgAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
        };
    });
    function addContact(data) {
        contacts.value.push(__assign(__assign({}, data), { id: uid(), favorite: false }));
        persist();
    }
    function updateContact(id, data) {
        var idx = contacts.value.findIndex(function (c) { return c.id === id; });
        if (idx !== -1)
            contacts.value[idx] = __assign(__assign({}, contacts.value[idx]), data);
        editingId.value = null;
        persist();
    }
    function removeContact(id) {
        contacts.value = contacts.value.filter(function (c) { return c.id !== id; });
        if (editingId.value === id)
            editingId.value = null;
        persist();
    }
    function toggleFavorite(id) {
        var c = contacts.value.find(function (ct) { return ct.id === id; });
        if (c) {
            c.favorite = !c.favorite;
            persist();
        }
    }
    function setSort(field) {
        if (sortConfig.value.field === field) {
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        }
        else {
            sortConfig.value = { field: field, direction: 'asc' };
        }
    }
    function clearFilters() {
        searchQuery.value = '';
        filterGender.value = '';
        filterCategory.value = '';
        filterFavorites.value = false;
    }
    function startEditing(id) { editingId.value = id; }
    function cancelEditing() { editingId.value = null; }
    function getContact(id) { return contacts.value.find(function (c) { return c.id === id; }); }
    function exportContacts() {
        return JSON.stringify(contacts.value, null, 2);
    }
    function importContacts(json) {
        var _a;
        try {
            var arr = JSON.parse(json);
            if (!Array.isArray(arr))
                return false;
            var imported = arr.map(function (c) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    id: uid(),
                    name: (_a = c.name) !== null && _a !== void 0 ? _a : '',
                    email: (_b = c.email) !== null && _b !== void 0 ? _b : '',
                    age: (_c = c.age) !== null && _c !== void 0 ? _c : null,
                    phone: (_d = c.phone) !== null && _d !== void 0 ? _d : '',
                    gender: (_e = c.gender) !== null && _e !== void 0 ? _e : '',
                    category: (_f = c.category) !== null && _f !== void 0 ? _f : '',
                    registerDate: (_g = c.registerDate) !== null && _g !== void 0 ? _g : new Date().toISOString().split('T')[0],
                    favorite: (_h = c.favorite) !== null && _h !== void 0 ? _h : false,
                    notes: (_j = c.notes) !== null && _j !== void 0 ? _j : '',
                });
            });
            (_a = contacts.value).push.apply(_a, imported);
            persist();
            return true;
        }
        catch (_b) {
            return false;
        }
    }
    function clearAllContacts() {
        contacts.value = [];
        editingId.value = null;
        persist();
    }
    return {
        contacts: contacts,
        searchQuery: searchQuery,
        filterGender: filterGender,
        filterCategory: filterCategory,
        filterFavorites: filterFavorites,
        sortConfig: sortConfig,
        editingId: editingId,
        filteredContacts: filteredContacts,
        totalContacts: totalContacts,
        favoriteCount: favoriteCount,
        hasActiveFilters: hasActiveFilters,
        stats: stats,
        loadContacts: loadContacts,
        addContact: addContact,
        updateContact: updateContact,
        removeContact: removeContact,
        toggleFavorite: toggleFavorite,
        setSort: setSort,
        clearFilters: clearFilters,
        startEditing: startEditing,
        cancelEditing: cancelEditing,
        getContact: getContact,
        exportContacts: exportContacts,
        importContacts: importContacts,
        clearAllContacts: clearAllContacts,
    };
});
