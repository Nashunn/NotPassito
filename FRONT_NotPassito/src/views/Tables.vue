<template>
    <div>
        <base-header type="gradient-blue" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>
        <div class="mx-5">
          <div class="my-2">{{ title }}</div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Name</th>
                  <th class="text-left">User</th>
                  <th class="text-left">Password</th>
                  <th class="text-left">URL</th>
                  <th class="text-left">Created</th>
                  <th class="text-left">Modified</th>
                  <th class="text-left">Expired</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>Facebook</td>
                  <td>john</td>
                  <td>zEaKe%87za</td>
                  <td>url.com</td>
                  <td>xx/xx/xxxx</td>
                  <td>xx/xx/xxxx</td>
                  <td>xx/xx/xxxx</td>
                  <td>
                    <v-btn class="bg-info text-white bold mx-1" small>Modifier</v-btn>
                    <v-btn class="bg-danger text-white bold mx-1" small>Supprimer</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'base-nav',
  props: {
    title: {
      type: String,
      default: 'Table name',
      description: 'Title of the table'
    }
  }
}
</script>
<style></style>
