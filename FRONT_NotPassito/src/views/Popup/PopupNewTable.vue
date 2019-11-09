<template>
  <!-- Popup New Table -->
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
                          placeholder="Nom"
                          addon-left-icon="ni ni-caps-small"
                          v-model="model.name">
              </base-input>
            </form>
            <!-- End Content -->

            <div class="d-flex justify-content-between mt-3">
              <v-btn @click="addTable" class="bg-green text-white bold mx-1">Créer</v-btn>
              <v-btn @click="closeModal" class="bg-info text-white bold mx-1">Annuler</v-btn>
            </div>
          </div>
          <!-- End Body -->
        </div>
      </div>

    </div>
  </SlideYUpTransition>
  <!-- Popup New Table -->
</template>

<script>
import { SlideYUpTransition } from 'vue2-transitions'
import { EventBus } from '../../event/eventBus'
import { HTTP } from '../../http-constants'
import store from '../../store'

export default {
  name: 'popupNewTable',
  components: {
    SlideYUpTransition
  },
  data () {
    return {
      show: false,
      usr: {},
      model: {
        name: ''
      }
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
    addTable () {
      HTTP.post(
        '/user/' + this.usr.id + '/createTable',
        { table_name: this.model.name },
        {}
      ).then(response => {
        this.updateUserTable(this.model.name)
        this.emptyModel()
        this.closeModal()
      })
    },
    updateUserTable (tableName) {
      this.usr.tables.push(tableName)
      store.commit('instanceUser', this.usr)
      EventBus.$emit('updateUser')
    },
    emptyModel () {
      this.model = {
        name: ''
      }
    }
  },
  mounted () {
    EventBus.$on('showNewTablePopup', data => {
      this.show = data.show
    })

    this.usr = store.state.usr

    this.currentTable = this.$route.params.tablename
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
