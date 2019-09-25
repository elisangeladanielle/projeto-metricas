<template>
  <form @submit.prevent="doLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">Login</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <input
          required
          type="email"
          v-model="email"
          class="form-control"
          placeholder="E-mail">
        </div>
        <div class="form-group">
          <input
            required
            type="password"
            v-model="password"
            class="form-control"
            placeholder="Senha">
        </div>
        <button class="btn btn-primary w-100 mb-3" :disabled="loading">
          <template v-if="loading">
            Entrando...
            <i class="fa fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Entrar
            <i class="fa fa-sign-in-alt"></i>
          </template>
        </button>
         <layout-cadastro/>
      </div>
    </div>
  </form>
</template>

<script>

import LayoutCadastro from '../../components/layout/LayoutCadastro'

export default {
  components: {
    LayoutCadastro
  },
  name: 'Login',
  data: () => {
    return {
      loading: false,
      showModal: false,
      email: '',
      password: ''
    }
  },
  methods: {
    async doLogin () {
      this.loading = true
      const { email, password } = this

      try {
        const res = await this.$firebase.auth().signInWithEmailAndPassword(email, password)

        window.uid = res.user.uid

        this.$router.push({ name: 'home' })
      } catch (err) {
        let message = ''

        switch (err.code) {
          case 'auth/user-not-found':
            message = 'Não foi possível localizar o usuário.'
            break
          case 'auth/wrong-password':
            message = 'Senha inválida.'
            break
          default:
            message = 'Não foi possível fazer login, tente novamente.'
        }
        this.$root.$emit('Notification::show', {
          message,
          type: 'danger'
        })
      }

      this.loading = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (window.uid) {
        vm.$router.push({ name: 'home' })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.modal {
  color: var(--darker);
}
.form-login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 18pt;
  }
  .card {
    width: 30%;
    color: var(--darker);
  }
}
</style>
