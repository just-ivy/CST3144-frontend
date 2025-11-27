var app = new Vue({
    el: '#app',
    data: {
        backendUrl: "http://localhost:3000",
        lessons: [],
        cart: [],
        sortKey: '',
        sortOrder: 'asc',
        showCart: false,
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
                    l.location.toLowerCase().includes(text) ||
                    l.price.toString().includes(text) ||
                    l.spaces.toString().includes(text)
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
        totalItems() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
    },
    methods: {
        async fetchLessons() {
            try {
                const response = await fetch(this.backendUrl + "/lessons");
                const data = await response.json();
                this.lessons = data;
            } catch (err) {
                console.error("Failed to fetch lessons", err);
            }
        },
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                const cartItem = this.cart.find(item => item._id === lesson._id);

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
                const lesson = this.lessons.find(l => l._id === cartItem._id);

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
        async submitOrder() {
            if (!this.isValidName() || !this.isValidPhone()) return;

            try {
                //Prepare order payload
                const orderData = {
                    name: this.checkoutName,
                    phone: this.checkoutPhone,
                    items: this.cart.map(item => ({
                        id: item._id,
                        quantity: item.quantity
                    }))
                };

                // Send ORDER to backend
                const orderRes = await fetch(this.backendUrl + "/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData)
                });

                if (!orderRes.ok) {
                    throw new Error("Order failed");
                }

                // Update each lesson's spaces in backend
                for (let item of this.cart) {
                    await fetch(this.backendUrl + "/lessons/" + item._id, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            spaces: this.lessons.find(l => l._id === item._id).spaces  // new available spaces
                        })
                    });
                }

                alert("Order submitted successfully!");

                // Reset data
                this.checkoutName = "";
                this.checkoutPhone = "";
                this.cart = [];
                this.showCart = false;

                // Refresh lessons from backend
                this.fetchLessons();

            } catch (err) {
                console.error(err);
                alert("Something went wrong submitting your order.");
            }
        },
        isValidName() {
            return /^[A-Za-z ]+$/.test(this.checkoutName);
        },
        isValidPhone() {
            return /^[0-9]+$/.test(this.checkoutPhone);
        },  
        goBackToLessons() {
            this.showCart = false;
        }
    },
    mounted() {
        this.fetchLessons();
    }
});


