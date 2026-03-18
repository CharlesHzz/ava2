<template>
  <div class="dashboard-page">
    <div class="dashboard-card">
      <header class="card-header">
        <div>
          <h1>Olá, {{ usuarioNome }} 👋</h1>
          <p>Agende sua consulta em poucos cliques</p>
        </div>
        <button @click="sair" class="btn-minimal">Sair</button>
      </header>

      <div class="form-grid">
        <div class="field">
          <label>Data Preferencial</label>
          <input v-model="data" type="date" @change="buscarClima" />
        </div>
        <div class="field">
          <label>Melhor Horário</label>
          <input v-model="horario" type="time" />
        </div>
      </div>

      <div class="field">
        <label>CEP de Origem</label>
        <div class="cep-input-wrapper">
          <input v-model="cep" placeholder="00000000" @blur="buscarEndereco" maxlength="8" />
          <p v-if="endereco" class="address-tag">📍 {{ endereco }}</p>
        </div>
      </div>

      <transition name="slide">
        <div v-if="previsao" class="weather-alert" :class="{ 'rain': temChuva }">
          <div class="icon">{{ temChuva ? '🌧️' : '☀️' }}</div>
          <div class="text">
            <strong>Previsão do Tempo:</strong>
            <span>{{ previsao }}</span>
          </div>
        </div>
      </transition>

      <button @click="agendar" class="btn-confirm">Confirmar Agendamento</button>
      
      <div v-if="usuarioTipo === 'secretario'" class="admin-access">
        <router-link to="/admin">Ir para Painel Administrativo →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const data = ref('');
const horario = ref('');
const cep = ref('');
const endereco = ref('');
const cidade = ref('');
const previsao = ref('');
const router = useRouter();
const usuarioNome = localStorage.getItem('usuarioNome') || 'Paciente';
const usuarioTipo = ref(localStorage.getItem('usuarioTipo'));

const temChuva = computed(() => previsao.value.toLowerCase().includes('chuva'));

const buscarEndereco = async () => {
  if (cep.value.length === 8) {
    const res = await axios.get(`https://viacep.com.br/ws/${cep.value}/json/`);
    if (!res.data.erro) {
      endereco.value = `${res.data.logradouro}, ${res.data.bairro}`;
      cidade.value = res.data.localidade;
      if (data.value) buscarClima();
    }
  }
};

const buscarClima = async () => {
  if (!cidade.value) return;
  const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade.value}&appid=0346b51da197f38d0be894d026fed16c&units=metric&lang=pt_br`);
  const desc = res.data.weather[0].description;
  previsao.value = `${desc.charAt(0).toUpperCase() + desc.slice(1)} (${Math.round(res.data.main.temp)}°C)`;
};

const sair = () => { localStorage.removeItem('token'); router.push('/login'); };

const agendar = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3000/agendamentos', {
      nomePaciente: usuarioNome,
      email: 'user@email.com',
      dataConsulta: data.value,
      horario: horario.value,
      cep: cep.value,
      endereco: endereco.value,
      previsaoTempo: previsao.value
    }, { headers: { Authorization: `Bearer ${token}` } });
    alert('✅ Agendamento realizado com sucesso!');
  } catch (err) { alert(err.response?.data?.erro || "Erro"); }
};
</script>

<style scoped>
.dashboard-page { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }
.dashboard-card { 
  background: white; width: 100%; max-width: 650px; 
  padding: 50px; border-radius: 32px; 
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); 
}

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
.card-header h1 { font-size: 26px; color: #0f172a; }
.card-header p { color: #64748b; margin-top: 5px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
.field label { display: block; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 10px; }
input { width: 100%; padding: 14px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 16px; background: #f8fafc; }

.address-tag { color: #10b981; font-weight: 700; margin-top: 10px; font-size: 14px; }

.weather-alert { 
  display: flex; align-items: center; gap: 15px; 
  padding: 20px; background: #f0f9ff; border-radius: 16px; 
  border: 1px solid #bae6fd; color: #0369a1; margin: 30px 0; 
}
.weather-alert.rain { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
.weather-alert .icon { font-size: 32px; }

.btn-confirm { 
  width: 100%; padding: 20px; background: #3b82f6; color: white; 
  border: none; border-radius: 16px; font-size: 18px; font-weight: 700; 
  cursor: pointer; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.btn-minimal { background: none; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #64748b; }
.admin-access { text-align: center; margin-top: 30px; }
.admin-access a { color: #94a3b8; text-decoration: none; font-size: 14px; }
</style>