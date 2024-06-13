// eslint-disable-next-line no-undef
Vue.component('graph-three', {
    template: `
        <div class="graph-3">
            <h2>Other Info</h2>
            <div class="other-info">
                <h3><span>{{ eventCount }}</span> Events</h3>
                <h3><span>{{ branchCount }}</span> Branches</h3>
                <h3><span>{{ updateCount }}</span> Updates</h3>
            </div>
        </div>
    `,
    data() {
        return {
            eventCount: 0,
            branchCount: 0,
            updateCount: 0
        };
    },
    methods: {
        getOtherInfo() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/managers/getOtherInfo');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    this.eventCount = response.eventCount || 0;
                    this.branchCount = response.branchCount || 0;
                    this.updateCount = response.updateCount || 0;
                } else {
                    console.error('Request failed. Status:', xhr.status);
                }
            };

            xhr.onerror = () => {
                console.error('Request error.');
            };

            xhr.send();
        }
    },
    created() {
        this.getOtherInfo();
    }
});
