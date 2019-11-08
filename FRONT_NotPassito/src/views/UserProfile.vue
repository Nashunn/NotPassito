<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                     style="min-height: 600px; background-image: url(img/np/user.png); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span class="mask bg-gradient-blue opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Hello !</h1>
                        <p class="text-white mt-0 mb-5">Bienvenue sur ton profil ! Tu y trouveras les informations te concernant, ainsi que tes tables de mots de passe</p>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--9">
            <div class="row">
                <div class="offset-xl-1 col-xl-10 mb-5">
                    <!-- General user informations -->
                    <div class="card card-profile shadow">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <a href="#">
                                        <img src="img/np/user.png" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            <div class="d-flex flex-row-reverse">
                                <base-button size="sm" type="info" class="px-3 py-1">Edit</base-button>
                            </div>
                        </div>
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row">
                                <div class="col">
                                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                                        <div>
                                            <span class="heading">{{ nbTables }}</span>
                                            <span class="description">Tables</span>
                                        </div>
                                        <div>
                                            <span class="heading">{{ nbPwds }}</span>
                                            <span class="description">Passwords</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <h3>{{ usr.firstname }} {{ usr.lastname }}</h3>
                                <div class="h5 font-weight-300">
                                    {{ usr.email }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="offset-xl-1 col-xl-10 mb-5">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Mes tables</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <div class="d-flex justify-content-around">
                                <div :key="table.id" v-for="table in usr.tables"
                                    class="col-lg-3 p-0 np-clicker-block">
                                    <div class="p-2 py-3 text-center bg-white border rounded" @click="redirectTable(table)" :title=table>
                                        {{table}}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '../store'
import router from '../router'
import { HTTP } from '../http-constants'

export default {
  name: 'user-profile',
  data () {
    return {
      usr: {},
      nbTables: 0,
      nbPwds: 0
    }
  },
  mounted () {
    this.usr = store.state.usr
    this.getNbTables()
    this.getNbPwds()
  },
  methods: {
    getNbTables () {
      HTTP.get('/user/' + this.usr.id + '/nbTable').then(response => {
        this.nbTables = response.data[0].nb_table
      })
    },
    getNbPwds () {
      HTTP.get('/user/' + this.usr.id + '/nbPass').then(response => {
        this.nbPwds = response.data[0].nb_pass
      })
    },
    redirectTable (tablename) {
      router.push('/tables/' + tablename)
    }
  }
}
</script>
<style></style>
