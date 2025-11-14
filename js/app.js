var app = new Vue({
    el: '#app',
    data: {
        cart: [],
        sortKey: '',
        sortOrder: 'asc',
        showCart: false,
        lessons: [
            { id: 1, subject: 'Python Programming', location: 'Flic-en-Flac', price: 120, spaces: 5, icon: 'python-icon.png' },
            { id: 2, subject: 'Web Design 101', location: 'Bambous', price: 100, spaces: 5, icon: 'web-design.png' },
            { id: 3, subject: 'Data Science Basics', location: 'Flic-en-Flac', price: 125, spaces: 5, icon: 'ds-icon.png' },
            { id: 4, subject: 'Robotics for Beginners', location: 'Port Louis', price: 150, spaces: 5, icon: 'robotics-icon.jpg' },
            { id: 5, subject: 'Game Dev with Scratch', location: 'Tamarin', price: 90, spaces: 5, icon: 'scratch-icon.jpg' },
            { id: 6, subject: 'Python Programming', location: 'Quatre Bornes', price: 120, spaces: 5, icon: 'python-icon.png' },
            { id: 7, subject: 'Introduction to AI', location: 'Quatre Bornes', price: 130, spaces: 5, icon: 'ai-icon.png' },
            { id: 8, subject: 'Creative Coding with JS', location: 'Bambous', price: 110, spaces: 5, icon: 'coding-icon.jpg' },
            { id: 9, subject: 'Data Science Basics', location: 'Tamarin', price: 95, spaces: 5, icon: 'ds-icon.png' },
            { id: 10, subject: 'Python Programming', location: 'Port Louis', price: 115, spaces: 5, icon: 'python-icon.png' },
            { id: 11, subject: 'Web Design 101', location: 'Flic-en-Flac', price: 100, spaces: 5, icon: 'web-design.png' },
            { id: 12, subject: 'Introduction to AI', location: 'Bambous', price: 100, spaces: 5, icon: 'ai-icon.png' }
        ],
        searchText: '',

        checkoutName: "",
        checkoutPhone: "",
    },
    computed: {
        sortedLessons() {
            // Filter based on search
            let results = this.lessons.filter(l => {
                const text = this.searchText.toLowerCase();
                return (
                    l.subject.toLowerCase().includes(text) ||
                    l.location.toLowerCase().includes(text)
                );
            });

            // Sort
            if (!this.sortKey) return results;

            return results.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];

                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                return this.sortOrder === "asc"
                    ? (valA > valB ? 1 : -1)
                    : (valA < valB ? 1 : -1);
            });

        },
        totalPrice() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        cartCount() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        totalItems() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
    },
    methods: {
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                const cartItem = this.cart.find(item => item.id === lesson.id);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    this.cart.push({ ...lesson, quantity: 1 });
                }
                lesson.spaces--;
            }
        },
        toggleCart() {
            this.showCart = !this.showCart;
        },
        removeFromCart(index) {
            const cartItem = this.cart[index];

            if (cartItem) {
                const lesson = this.lessons.find(l => l.id === cartItem.id);

                // Restore one space
                if (lesson) lesson.spaces++;

                // Reduce quantity OR remove entire entry
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                } else {
                    this.cart.splice(index, 1);
                }
            }
        },
        submitOrder() {
            alert("Order submitted Successful!");

            // Reset fields
            this.checkoutName = "";
            this.checkoutPhone = "";
            this.cart = [];

            // Close cart panel
            this.showCart = false;
        },
    }
});
