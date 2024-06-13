// modal-component.js
// eslint-disable-next-line no-undef
Vue.component('modal', {
  template: `
      <div class="modal-mask" @click.self="closeOnMaskClick">
          <div class="modal-wrapper">
              <div class="modal-container">
                  <div class="modal-header">
                      <slot name="header">default header</slot>
                      <button class="modal-close-button" @click="$emit('close')">&times;</button>
                  </div>
                  <div class="modal-body">
                      <slot name="body">default body</slot>
                  </div>
                  <div class="modal-footer">
                      <slot name="footer">default footer</slot>
                  </div>
              </div>
          </div>
      </div>
  `,
  methods: {
      closeOnMaskClick(event) {
          if (event.target === event.currentTarget) {
              this.$emit('close');
          }
      }
  }
});




