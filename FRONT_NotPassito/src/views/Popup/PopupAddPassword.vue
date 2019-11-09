<template>
  <!-- Popup Add Password -->
  <SlideYUpTransition :duration="animationDuration">
    <div class="modal fade"
         @click.self="closeModal"
         :class="[{'show d-block': show}, {'d-none': !show}, {'modal-mini': type === 'mini'}]"
         v-show="show"
         tabindex="-1"
         role="dialog"
         :aria-hidden="!show">
      <div class="modal-dialog modal-dialog-centered"
           :class="[{'modal-notice': type === 'notice'}, modalClasses]">
        <div class="modal-content" :class="[gradient ? `bg-gradient-${gradient}` : '',modalContentClasses]">
          <!-- Body -->
          <div class="modal-body" :class="bodyClasses">
            <div class="mb-3">
              <button type="button"
                      class='close'
                      @click="closeModal"
                      data-dismiss="modal"
                      aria-label="Close">
                <span>×</span>
              </button>
            </div>

            <slot name="body"></slot>

            <!-- Content -->
            <form role="form">
              <base-input class="input-group-alternative mb-3"
                          placeholder="Titre"
                          addon-left-icon="ni ni-caps-small"
                          v-model="model.name">
              </base-input>

              <base-input class="input-group-alternative mb-3"
                          placeholder="Utilisateur"
                          addon-left-icon="ni ni-single-02"
                          v-model="model.user">
              </base-input>

              <base-input class="input-group-alternative"
                          placeholder="Mot de passe"
                          addon-left-icon="ni ni-lock-circle-open"
                          v-model="model.value">
              </base-input>
            </form>
            <!-- End Content -->

            <div class="d-flex justify-content-between mt-3">
              <v-btn @click="addLine()" class="bg-green text-white bold mx-1">Enregistrer</v-btn>
              <v-btn @click="closeModal()" class="bg-info text-white bold mx-1">Annuler</v-btn>
            </div>
          </div>
          <!-- End Body -->
        </div>
      </div>

    </div>
  </SlideYUpTransition>
  <!-- Popup Add Password -->
</template>

<script>
import { SlideYUpTransition } from 'vue2-transitions'
import { EventBus } from '../../event/eventBus'
import { HTTP } from '../../http-constants'
import store from '../../store'

export default {
  name: 'popupEditProfile',
  components: {
    SlideYUpTransition
  },
  data () {
    return {
      model: {
        name: '',
        user: '',
        value: ''
      },
      usr: {},
      show: false,
      currentTable: 'Test'
    }
  },
  props: {
    showClose: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: '',
      validator (value) {
        let acceptedValues = ['', 'notice', 'mini']
        return acceptedValues.indexOf(value) !== -1
      },
      description: 'Modal type (notice|mini|"") '
    },
    modalClasses: {
      type: [Object, String],
      description: 'Modal dialog css classes'
    },
    modalContentClasses: {
      type: [Object, String],
      description: 'Modal dialog content css classes'
    },
    gradient: {
      type: String,
      description: 'Modal gradient type (danger, primary etc)'
    },
    headerClasses: {
      type: [Object, String],
      description: 'Modal Header css classes'
    },
    bodyClasses: {
      type: [Object, String],
      description: 'Modal Body css classes'
    },
    footerClasses: {
      type: [Object, String],
      description: 'Modal Footer css classes'
    },
    animationDuration: {
      type: Number,
      default: 500,
      description: 'Modal transition duration'
    }
  },
  methods: {
    closeModal () {
      this.show = false
    },
    addLine () {
      HTTP.post(
        '/user/' + this.usr.id + '/' + this.currentTable + '/save',
        { passwd_name: this.model.name, passwd_user: this.model.user, passwd_value: this.model.value },
        {}
      ).then(response => {
        this.emptyModel()
        this.updateUserTable()
        this.closeModal()
      })
    },
    updateUserTable () {
      EventBus.$emit('updateUser')
    },
    emptyModel () {
      this.model = {
        name: '',
        user: '',
        value: ''
      }
    }
  },
  mounted () {
    this.usr = store.state.usr

    this.currentTable = this.$route.params.tablename

    EventBus.$on('showAddPassword', data => {
      this.show = data.show
    })
  },
  watch: {
    show (val) {
      let documentClasses = document.body.classList
      if (val) {
        documentClasses.add('modal-open')
      } else {
        documentClasses.remove('modal-open')
      }
    }
  }
}
</script>

<style>
.modal.show {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
