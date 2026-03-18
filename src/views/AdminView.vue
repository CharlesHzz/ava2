<template>
  <div class="admin-wrapper">
    <div class="header">
      <h1>Relatório de Consultas</h1>
      <router-link to="/" class="btn-back">⬅ Voltar</router-link>
    </div>

    <div class="card-table">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Data/Hora</th>
            <th>Localização</th>
            <th>Clima Registrado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in agendamentos" :key="a.id">
            <td><strong>{{ a.nomePaciente }}</strong></td>
            <td>{{ a.dataConsulta }} às {{ a.horario }}</td>
            <td>{{ a.endereco }} ({{ a.cep }})</td>
            <td><span class="badge">{{ a.previsaoTempo }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const agendamentos = ref([]);
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/agendamentos');
  agendamentos.value = res.data;
});
</script>

<style scoped>
.admin-wrapper { max-width: 1000px; margin: 50px auto; padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.card-table { background: white; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th { background: #f8f9fa; padding: 18px; text-align: left; font-size: 13px; text-transform: uppercase; color: #636e72; }
td { padding: 18px; border-top: 1px solid #f1f1f1; font-size: 14px; color: #2d3436; }
.badge { background: #f1f2f6; padding: 5px 10px; border-radius: 5px; font-size: 12px; }
.btn-back { text-decoration: none; color: #636e72; font-weight: bold; }
</style>