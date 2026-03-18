<template>
  <div class="page-container">
    <div class="glass-card">
      <div class="header-section">
        <span class="main-icon">🏥</span>
        <h1>Clínica AVA2</h1>
        <p>Acesse sua conta para gerenciar consultas</p>
      </div>

      <form @submit.prevent="fazerLogin" class="form-body">
        <div class="input-group">
          <label>E-mail institucional</label>
          <input v-model="email" type="email" placeholder="exemplo@clinica.com" required />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input v-model="senha" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-primary">Entrar no Sistema</button>
      </form>

      <p v-if="erro" class="error-badge">{{ erro }}</p>

      <div class="footer-action">
        Ainda não tem conta? <router-link to="/cadastro">Cadastre-se aqui</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const senha = ref('');
const erro = ref('');
const router = useRouter();

const fazerLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/login', { email: email.value, senha: senha.value });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuarioNome', res.data.usuario);
    localStorage.setItem('usuarioTipo', res.data.tipo);
    router.push('/');
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao conectar';
  }
};
</script>

<style scoped>
.page-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  padding: 20px;
}

.glass-card {
  background: white;
  padding: 60px 40px;
  border-radius: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 480px;
  text-align: center;
}

.main-icon { font-size: 48px; display: block; margin-bottom: 10px; }
h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.header-section p { color: #64748b; margin-bottom: 40px; }

.form-body { text-align: left; }
.input-group { margin-bottom: 24px; }
label { display: block; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 8px; }

input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 16px;
  transition: all 0.2s;
}

input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

.btn-primary {
  width: 100%;
  padding: 18px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.btn-primary:hover { background: #059669; transform: translateY(-2px); }

.footer-action { margin-top: 30px; font-size: 14px; color: #64748b; }
.footer-action a { color: #10b981; font-weight: 700; text-decoration: none; }
.error-badge { color: #ef4444; background: #fee2e2; padding: 12px; border-radius: 10px; margin-top: 20px; font-size: 14px; }
</style>