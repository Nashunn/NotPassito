<template>
  <!-- Popup Delete line -->
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

            <slot name="body" class="my-2"></slot>

            <div class="d-flex justify-content-between mt-3">
              <v-btn @click="deleteLine" class="bg-danger text-white bold mx-1">Supprimer</v-btn>
              <v-btn @click="closeModal" class="bg-info text-white bold mx-1">Annuler</v-btn>
            </div>
          </div>
          <!-- End Body -->
        </div>
      </div>

    </div>
  </SlideYUpTransition>
  <!-- Popup Delete line -->
</template>

<script>
import store from '../../store'
import { HTTP } from '../../http-constants'
import { SlideYUpTransition } from 'vue2-transitions'
import { EventBus } from '../../event/eventBus'

export default {
  name: 'popupDeleteLine',
  components: {
    SlideYUpTransition
  },
  data () {
    return {
      usr: {},
      show: false,
      idItem: -1,
      table: ''
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
    deleteLine () {
      HTTP.post('/user/' + this.usr.id + '/' + this.table + '/delete', { passwd_id: this.idItem }, {}).then(response => {
        console.log('line deleted ' + this.idItem)
        this.updateUserTable()
        this.closeModal()
      })
    },
    updateUserTable () {
      EventBus.$emit('updateUser')
    }
  },
  mounted () {
    this.usr = store.state.usr

    EventBus.$on('showDeleteLinePopup', data => {
      this.show = data.show
      this.idItem = data.id
      this.table = data.tablename
    })

    EventBus.$on('updatePopup', () => {
      this.usr = store.state.usr
      this.table = this.$route.params.tablename
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
