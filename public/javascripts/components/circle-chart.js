/* eslint-disable no-undef */
Vue.component('circle-chart', {
    props: {
        people: {
            type: Number,
            required: true
        },
        maxPeople: {
            type: Number,
            default: 3000
        }
    },
    computed: {
        percentage() {
            return this.people / this.maxPeople;
        },
        formattedPeople() {
            return new Intl.NumberFormat().format(this.people);
        },
        chartStyle() {
            return {
                '--percentage': this.percentage
            };
        }
    },
    template: `
        <div class="chart-container">
            <div class="chart" :data-people="formattedPeople" :style="chartStyle">
            </div>
        </div>
    `
});