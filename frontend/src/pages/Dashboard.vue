<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import {
  LogOut,
  User,
  Shield,
  CreditCard,
  Calendar,
  Filter,
  Trash2,
} from "lucide-vue-next";

const authStore = useAuthStore();
const loans = ref<any[]>([]);
const loading = ref(true);
const statusFilter = ref("");

const fetchLoans = async () => {
  loading.ref = true;
  try {
    const url = statusFilter.value
      ? `/loans?status=${statusFilter.value}`
      : "/loans";
    const response = await api.get(url);
    loans.value = response.data;
  } catch (error) {
    console.error("Failed to fetch loans");
  } finally {
    loading.value = false;
  }
};

const deleteLoan = async (id: number) => {
  if (!confirm("Are you sure you want to delete this loan?")) return;
  try {
    await api.delete(`/loans/${id}/delete`);
    fetchLoans();
  } catch (error) {
    alert("Failed to delete loan");
  }
};

onMounted(fetchLoans);
</script>

<template>
  <div class="min-h-screen bg-slate-950 p-6">
    <div class="max-w-7xl mx-auto">
      <div
        class="flex items-center justify-between mb-8 bg-slate-900/50 backdrop-blur p-4 rounded-xl border border-slate-800"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"
          >
            <Shield class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">BuySimply</h1>
            <p class="text-xs text-slate-400 capitalize">
              {{ authStore.user?.role }} Panel
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-white">
              {{ authStore.user?.email }}
            </p>
          </div>
          <button
            @click="authStore.logout()"
            class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center"
      >
        <h2 class="text-2xl font-bold text-white">Loan Portfolio</h2>

        <div
          class="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800"
        >
          <button
            @click="
              statusFilter = '';
              fetchLoans();
            "
            :class="[
              statusFilter === ''
                ? 'bg-slate-800 text-white'
                : 'text-slate-400',
            ]"
            class="px-3 py-1.5 rounded-md text-sm transition-all"
          >
            All
          </button>
          <button
            @click="
              statusFilter = 'active';
              fetchLoans();
            "
            :class="[
              statusFilter === 'active'
                ? 'bg-primary-600 text-white'
                : 'text-slate-400',
            ]"
            class="px-3 py-1.5 rounded-md text-sm transition-all"
          >
            Active
          </button>
          <button
            @click="
              statusFilter = 'pending';
              fetchLoans();
            "
            :class="[
              statusFilter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'text-slate-400',
            ]"
            class="px-3 py-1.5 rounded-md text-sm transition-all"
          >
            Pending
          </button>
        </div>
      </div>

      <div
        class="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-900/80 border-b border-slate-800">
                <th class="px-6 py-4 text-sm font-semibold text-slate-400">
                  User Email
                </th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-400">
                  Status
                </th>
                <th class="px-6 py-4 text-sm font-semibold text-slate-400">
                  Maturity Date
                </th>
                <th
                  v-if="authStore.isAdmin"
                  class="px-6 py-4 text-sm font-semibold text-slate-400"
                >
                  Total Loan
                </th>
                <th
                  v-if="authStore.isSuperAdmin"
                  class="px-6 py-4 text-sm font-semibold text-slate-400"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td colspan="5" class="px-6 py-4 h-16 bg-slate-900/20"></td>
              </tr>
              <tr v-else-if="loans.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  No loans found
                </td>
              </tr>
              <tr
                v-else
                v-for="loan in loans"
                :key="loan.id"
                class="hover:bg-slate-800/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
                    >
                      <User class="w-4 h-4 text-slate-400" />
                    </div>
                    <span class="text-sm font-medium text-slate-200">{{
                      loan.userEmail
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      loan.status === 'active'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    ]"
                    class="px-2.5 py-1 rounded-full text-xs font-semibold border capitalize"
                  >
                    {{ loan.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar class="w-4 h-4" />
                    {{ new Date(loan.maturityDate).toLocaleDateString() }}
                  </div>
                </td>
                <td v-if="authStore.isAdmin" class="px-6 py-4">
                  <span class="text-sm font-bold text-white">
                    ${{ parseFloat(loan.totalLoan).toLocaleString() }}
                  </span>
                </td>
                <td v-if="authStore.isSuperAdmin" class="px-6 py-4">
                  <button
                    @click="deleteLoan(loan.id)"
                    class="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
