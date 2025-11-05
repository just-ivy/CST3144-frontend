var app = new Vue({
    el: '#app',
    data: {
        cart: [],
        sortKey: '',
        sortOrder: 'asc',
        lessons: [
            { id: 1, subject: 'Python Programming', location: 'Hendon', price: 120, spaces: 5, icon: 'python.png' },
            { id: 2, subject: 'Web Design 101', location: 'Barnet', price: 100, spaces: 5, icon: 'web.png' },
            { id: 3, subject: 'Robotics for Beginners', location: 'Colindale', price: 150, spaces: 5, icon: 'robot.png' },
            { id: 4, subject: 'Game Development', location: 'Finchley', price: 90, spaces: 5, icon: 'game.png' },
            { id: 5, subject: 'Intro to AI', location: 'Wembley', price: 130, spaces: 5, icon: 'ai.png' },
            { id: 6, subject: 'Creative Coding with JS', location: 'Camden', price: 110, spaces: 5, icon: 'js.png' }
        ],
        searchText: '',
    },
    computed: {
        sortedLessons() {
            if (!this.sortKey) return this.lessons;
            return this.lessons.slice().sort((a, b) => {
                let valA = a[this.sortKey], valB = b[this.sortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                return this.sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
            });
        },
        filteredLessons() {
            const text = this.searchText.toLowerCase();
            return this.lessons.filter(l =>
                l.subject.toLowerCase().includes(text) ||
                l.location.toLowerCase().includes(text)
            );
        },
    },
    methods: {
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                this.cart.push(lesson);
                lesson.spaces--;
            }
        },
        toggleCart() {
            alert('Cart feature will appear on a separate section later this week.');
        },
    }
});
