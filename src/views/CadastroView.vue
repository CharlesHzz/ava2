<template>
  <div class="main-wrapper">
    <div class="auth-card">
      <div class="brand">
        <h1>Nova Conta</h1>
        <p>Crie seu perfil de acesso rápido.</p>
      </div>

      <form @submit.prevent="registrar">
        <div class="input-field"><label>Nome Completo</label><input v-model="nome" required /></div>
        <div class="input-field"><label>E-mail</label><input v-model="email" type="email" required /></div>
        <div class="input-field"><label>Senha</label><input v-model="senha" type="password" required /></div>
        <div class="input-field">
          <label>Tipo de Perfil</label>
          <select v-model="tipo">
            <option value="paciente">Sou Paciente</option>
            <option value="secretario">Sou Secretário</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Criar Cadastro</button>
      </form>
      <div class="auth-footer"><router-link to="/login">Voltar para o Login</router-link></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const nome = ref(''); const email = ref(''); const senha = ref(''); const tipo = ref('paciente');
const router = useRouter();

const registrar = async () => {
  try {
    await axios.post('http://localhost:3000/cadastro', { nome: nome.value, email: email.value, senha: senha.value, tipo: tipo.value });
    alert('Sucesso! Agora faça seu login.');
    router.push('/login');
  } catch (err) { alert('Erro no cadastro.'); }
};
</script>

<style scoped>
.main-wrapper { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
.auth-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); width: 100%; max-width: 450px; }
h1 { color: #2d3436; text-align: center; }
.input-field { margin-bottom: 15px; }
label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
input, select { width: 100%; padding: 12px; border: 2px solid #eee; border-radius: 8px; font-size: 14px; outline: none; }
select { appearance: none; background: white; cursor: pointer; }
.btn-primary { width: 100%; padding: 15px; background: #00b894; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
.auth-footer { text-align: center; margin-top: 20px; }
.auth-footer a { color: #636e72; font-size: 14px; }
</style>