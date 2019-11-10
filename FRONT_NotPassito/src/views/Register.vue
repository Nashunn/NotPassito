<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        Créer un compte
                    </div>
                    <div v-if="errFields" class="text-warning my-1">
                      Veuillez remplir les champs
                    </div>
                    <form role="form">
                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Nom"
                                    addon-left-icon="ni ni-hat-3"
                                    v-model="model.lastname">
                        </base-input>

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Prénom"
                                    addon-left-icon="ni ni-hat-3"
                                    v-model="model.firstname">
                        </base-input>

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Email"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                        </base-input>

                        <base-input class="input-group-alternative"
                                    placeholder="Mot de passe"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                        </base-input>

                        <div class="text-muted font-italic mx-1">
                            <small>Niveau du mot de passe : <span :class='passwordLvl.color' class="font-weight-700">{{ passwordLvl.value }}</span></small>
                        </div>

                        <div class="text-center">
                            <v-btn @click="register()" class="bg-primary text-white bold my-3">S'inscrire</v-btn>
                        </div>
                        <div class="text-center">
                          <small>Déjà un compte ?
                            <router-link to="/login" class="text-primary">Connectez-vous</router-link>
                          </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import auth from '../auth'

export default {
  name: 'register',
  data () {
    return {
      model: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    passwordLvl: function () {
      var pwd = this.model.password
      var result = { 'color': 'text-primary', 'value': 'En attente' }
      var specChar = /[$&+,:;=?@#|'<>.^*()%!-]/
      var numChar = /[0-9]/
      var upperChar = /[A-Z]/

      if (pwd.length > 0) {
        if (pwd.length >= 8) {
          if (specChar.test(pwd) || numChar.test(pwd) || upperChar.test(pwd)) {
            if (specChar.test(pwd) && numChar.test(pwd) && upperChar.test(pwd)) {
              result = { 'color': 'text-success', 'value': 'Fort' }
            } else {
              result = { 'color': 'text-yellow', 'value': 'Moyen' }
            }
          } else {
            result = { 'color': 'text-orange', 'value': 'Faible' }
          }
        } else {
          result = { 'color': 'text-red', 'value': 'Très faible' }
        }
      }

      return result
    }
  },
  methods: {
    register () {
      if (this.model.lastname !== '' && this.model.firstname !== '' && this.model.email !== '' && this.model.password !== '') {
        this.errFields = false
        auth.register(this.model)
      } else {
        this.errFields = true
      }
    }
  }
}
</script>
<style>
</style>
