<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4">
                            Connectez-vous !
                        </div>
                        <div v-if="errFields" class="text-warning my-1">
                          Veuillez remplir les champs
                        </div>
                        <form role="form">
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
                            <div class="text-center">
                                <v-btn @click="login()" class="bg-primary text-white bold my-3">Connexion</v-btn>
                            </div>
                            <div class="text-center">
                              <small>
                                Pas de compte ?
                                <router-link to="/register" class="text-primary">Créez un compte</router-link>
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
  name: 'login',
  data () {
    return {
      model: {
        email: '',
        password: ''
      },
      errFields: this.modelfalse
    }
  },
  methods: {
    login () {
      if (this.model.email !== '' && this.model.password !== '') {
        this.errFields = false
        auth.login(this.model)
      } else {
        this.errFields = true
      }
    }
  }
}
</script>
<style>
</style>
