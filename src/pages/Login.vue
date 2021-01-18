<template>
  <q-page class="bg-primary row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">ログイン</h5>
      </div>
      <div class="row">
        <q-card
          square
          bordered
          class="q-pa-lg shadow-1"
        >
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="username"
                type="text"
                label="ユーザ名"
                ref="username"
                hint="デフォルト: admin"
                :disable="logging"
                :rules="[val => !!val || 'ユーザ名を入力']"
                @keydown.enter="onLogin"
              />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="パスワード"
                ref="password"
                hint="デフォルト: admin"
                :disable="logging"
                :rules="[val => !!val || 'パスワードを入力']"
                @keydown.enter="onLogin"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              label="ログイン"
              :loading="logging"
              @keydown.enter="onLogin"
              @click="onLogin"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Login Form Card By
              <a href="https://gist.github.com/justinatack/39ec7f37064b2e9fa61fbd450cba3826">justinatack</a> STAR HIM ❤
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import message from '../utils/message'
import * as actionTypes from 'src/store/dispatcher/action-types'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      logging: false
    }
  },
  methods: {
    async onLogin () {
      this.$refs.username.validate()
      this.$refs.password.validate()
      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        return
      }
      try {
        this.logging = true
        await this.$store.dispatch(actionTypes.login, {
          username: this.username,
          password: this.password
        })
        this.$router.push('/')
      } catch (err) {
        if (err.status === 401) {
          message.error({ message: '間違ったユーザー名またはパスワード', position: 'top' })
        } else {
          message.error({
            message: 'ログイン失敗',
            caption: err.message,
            position: 'top'
          })
        }
      } finally {
        this.logging = false
      }
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
