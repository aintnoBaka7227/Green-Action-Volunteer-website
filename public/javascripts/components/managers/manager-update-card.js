var managerUpdateCard = Vue.component('manager-update-card', {
    template: `
      <div class="announcement-card">
        <hr>
        <div class="announcement-first-line">
          <a class="announcement-title">
            {{ title }}
          </a>
        </div>
        <div class="announcement-second-line">
          <div class="announcement-sub">
            {{ content }}
          </div>
          <button @click="deleteUpdate(updateId)" class="delete-button">Remove</button>
        </div>
      </div>
    `,
    props: {
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
    }
  });