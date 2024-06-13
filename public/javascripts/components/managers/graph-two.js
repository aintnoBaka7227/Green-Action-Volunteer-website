// eslint-disable-next-line no-undef
let circleChart = Vue.component('graph-two', {
    template: `
        <div class="graph-2">
            <h2>Volunteer's count</h2>
            <div class="chart-container">
                <div class="chart" :data-people="formattedPeople" :style="chartStyle"></div>
            </div>
            <div class="graph-2-legend">
                <div class="legend-male"><i class="legend-dot fa-solid fa-circle"></i><span>Male
                        ({{ numMale }} people)</span></div>
                <div class="legend-female"><i class="legend-dot fa-solid fa-circle"></i><span>Female
                        ({{ numFemale }} people)</span></div>
            </div>
        </div>
    `,
    data: function () {
        return {
            numMale: 0,
            numFemale: 0,
            totalPeople: 0,
        };
    },
    computed: {
        percentage() {
            return this.numMale / this.totalPeople;
        },
        formattedPeople() {
            return new Intl.NumberFormat().format(this.totalPeople);
        },
        chartStyle() {
            return {
                '--percentage': this.percentage
            };
        }
    },
    methods: {
        getPeopleInfo() {
            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();

            // Configure it: GET-request for the URL /admins/getPeopleInfo
            xhr.open('GET', '/managers/getPeopleInfo');

            // Setup a callback function to handle the response
            xhr.onload = () => {
                if (xhr.status === 200) {
                    // Success: Parse the JSON response
                    const response = JSON.parse(xhr.responseText);
                    // Assuming the response contains 'numMale', 'numFemale', and 'totalPeople' fields
                    this.numMale = response.numMale;
                    this.numFemale = response.numFemale;
                    this.totalPeople = response.totalPeople;
                } else {
                    // Error: Handle the error case
                    console.error('Request failed. Status:', xhr.status);
                }
            };

            // Handle network errors
            xhr.onerror = () => {
                console.error('Network request failed');
            };

            // Send the request
            xhr.send();
        }
    },
    created() {
        this.getPeopleInfo();
    }
});
