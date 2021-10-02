var app = new Vue({
  ...common_vue_config,
  data: {
    link: {
      target_url: "https://"
    },

    public_url: null,
    newcode: null,
    dashboard: null,
    submit_disabled: false,
    api_errors: {}
  },
  mounted() {
    hide_preloader()
  },
  methods: {
    save() {

      let payload = {
        target_url: this.link.target_url
      }

      this.submit_disabled = true

      send_request({
        method: 'POST',
        url: apiendpoints.link,
        data: payload
      }).then(
        (res) => {
          this.submit_disabled = false
          this.public_url = `${window.location.protocol}//${window.location.host}/${res.code}`
          this.dashboard = `${window.location.protocol}//${window.location.host}/dashboard/${res.token}`
          this.reset_state()
        },
        (err) => {
          let response = err.response
          if(response.status == 400) {
            this.api_errors = response.data.error
          } else {
            this.$bvToast.toast('An Unknown Error Occurred. Please Try Again!', {
              ...common_toast_options,
              title: 'Error',
              variant: 'danger'
            })
          }
          this.submit_disabled = false
        }
      )
    },
    reset_state() {
      this.link = {
        target_url: "https://"
      }
      this.api_errors = {}
      this.submit_disabled = false
    },
    copy(ele) {
      copy_text(ele, this)
    },
    updateCode(){   
      let code = document.getElementById("_code").textContent
      let payload = {
        "code": this.newcode
      }

      send_request({
        method: 'PUT',
        url: apiendpoints.edit+code+"/",
        data: payload
      }).then(
        (res) => {
          document.getElementById("_code").innerHTML = this.newcode
          this.newcode = null
          code
          this.$bvToast.toast('URL Edited Succesfully!', {
              title: 'Success',
              ...common_toast_options,
          })
        },
        (err) => {
          let response = err.response
          if(response.status == 400) {
            this.api_errors = response.data.error
            this.$bvToast.toast(response.data.code[0], {
              ...common_toast_options,
              title: 'Error',
              variant: 'danger'
            })
          } else {
            this.$bvToast.toast('An Unknown Error Occurred. Please Try Again!', {
              ...common_toast_options,
              title: 'Error',
              variant: 'danger'
            })
          }
        }
      )
    }
  }
})
Vue.use(window.BootstrapVue)
