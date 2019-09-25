<template>
  <div class="w-100 d-flex justify-content-center">
    <button @click="showModal = true" class="btn btn-outline-primary w-100">
      Cadastre-se
    </button>

    <form class="form-group" @submit.prevent="submit()">
      <div
        class="modal fade"
        :class="{show: showModal}"
        :style="{display: showModal ? 'block' : 'none'}"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Novo usuário</h5>
              <button type="button" @click="closeModal()" class="close">
                <span>×</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for="">E-mail:</label>
                  <input
                    required
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Ex: user@mail.com"
                  >
                </div>
                <div class="form-group col-8">
                  <label for="">Senha:</label>
                  <input
                    required
                    type="text"
                    class="form-control"
                    v-model="password"
                    placeholder="Mínimo de 6 caracteres"
                  >
                </div>

              </div>
            </div>
            <div class="modal-footer">
              <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal()"
              >
              Cancelar
              </button>
              <button class="btn btn-primary" :disabled="loading">
              <template v-if="loading">
                <i class="fa fa-spin fa-spinner"></i>
                Salvando...
              </template>
              <template @click="submit()" v-else>
                Salvar o usuário
              </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div
      :class="{show: showModal}"
      class="modal-backdrop fade"
      :style="{display: showModal ? 'block' : 'none'}"
    ></div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data: () => ({
    loading: false,
    showModal: false,
    email: '',
    password: ''
  }),
  methods: {
    async submit () {
      this.loading = true
      // const { email, password } = this

      try {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      } catch (err) {
        if (errorCode === 'auth/weak-password') {
          alert('Senha fraca, insira no mínimo 6 caracteres.')
        } else {
          this.$root.$emit('Notification::show', {
          type: 'danger',
          message: 'Não foi possível inserir o usuário, tente novamente.'
          })
        }


      this.loading = false
    }
    this.$root.$emit('Notification::show', {
      type: 'success',
      message: 'Usuário cadastrado com sucesso!'
    })
    this.closeModal ()

    this.loading = false
    },
    closeModal () {
      this.showModal = false
    }
  }
}

</script>

<style scoped>
.modal {
  color: var(--darker);
}
</style>
