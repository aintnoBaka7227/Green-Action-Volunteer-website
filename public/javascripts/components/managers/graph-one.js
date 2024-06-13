// eslint-disable-next-line no-undef
Vue.component('graph-one', {
    template: `
        <div class="graph-1">
            <h2>User's type</h2>
            <div class="graph-1-bar">
                <div :style="barStyle" class="graph-1-inner-bar"></div>
            </div>
            <div class="graph-1-legend">
                <div class="legend-volunteers"><i class="legend-dot fa-solid fa-circle"></i><span>Volunteers [{{ volunteerPercent }}%]</span></div>
                <div class="legend-managers"><i class="legend-dot fa-solid fa-circle"></i><span>Managers [{{ managerPercent }}%]</span></div>
            </div>
        </div>
    `,
    data() {
        return {
            volunteerCount: 0,
            managerCount: 0,
        };
    },
    methods: {
        getVolManInfo() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/managers/getVolManInfo');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    this.volunteerCount = response.volunteerCount || 0;
                    this.managerCount = response.managerCount || 0;
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
    computed: {
        volunteerPercent() {
            return ((this.volunteerCount / (this.volunteerCount + this.managerCount)) * 100).toFixed(2);
        },
        managerPercent() {
            return ((this.managerCount / (this.volunteerCount + this.managerCount)) * 100).toFixed(2);
        },
        barStyle() {
            return {
                '--volunteer-percentage': this.volunteerPercent
            };
        }
    },
    created() {
        this.getVolManInfo();
    }
});