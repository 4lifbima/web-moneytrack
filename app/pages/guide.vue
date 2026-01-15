<template>
  <div class="px-4 py-6 max-w-lg mx-auto">
    <!-- Header -->
    <header class="flex items-center gap-4 mb-6">
      <button 
        @click="navigateTo('/profile')" 
        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft"
      >
        <PhCaretLeft :size="20" class="text-gray-600" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Cara Penggunaan</h1>
        <p class="text-gray-500 text-sm">Panduan menggunakan Dompetin</p>
      </div>
    </header>

    <!-- Guide Content -->
    <div class="space-y-4">
      <!-- Getting Started -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <PhRocket :size="20" class="text-primary-600" />
          </div>
          <h2 class="font-bold text-gray-900">Memulai</h2>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>1. <strong>Daftar akun</strong> dengan email dan password</p>
          <p>2. <strong>Login</strong> ke aplikasi Dompetin</p>
          <p>3. Mulai catat transaksi Anda!</p>
        </div>
      </div>

      <!-- Add Transaction -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <PhPlus :size="20" class="text-green-600" />
          </div>
          <h2 class="font-bold text-gray-900">Menambah Transaksi</h2>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>1. Tekan tombol <strong>+</strong> di bagian tengah bawah</p>
          <p>2. Masukkan <strong>jumlah uang</strong></p>
          <p>3. Pilih <strong>tipe</strong>: Pemasukan atau Pengeluaran</p>
          <p>4. Pilih <strong>kategori</strong> yang sesuai</p>
          <p>5. Tambahkan catatan (opsional)</p>
          <p>6. Tekan <strong>Save Transaction</strong></p>
        </div>
      </div>

      <!-- View & Edit Transaction -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <PhPencil :size="20" class="text-blue-600" />
          </div>
          <h2 class="font-bold text-gray-900">Lihat & Edit Transaksi</h2>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>1. Buka menu <strong>History</strong> di navigasi bawah</p>
          <p>2. <strong>Tap transaksi</strong> untuk melihat detail</p>
          <p>3. Tekan ikon <strong>pensil</strong> untuk edit</p>
          <p>4. Ubah data yang diperlukan</p>
          <p>5. Tekan <strong>Save Changes</strong></p>
        </div>
      </div>

      <!-- View Statistics -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <PhChartBar :size="20" class="text-purple-600" />
          </div>
          <h2 class="font-bold text-gray-900">Lihat Statistik</h2>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>1. Buka menu <strong>Stats</strong> di navigasi bawah</p>
          <p>2. Lihat <strong>total pemasukan</strong> dan <strong>pengeluaran</strong></p>
          <p>3. Pantau <strong>grafik bulanan</strong></p>
          <p>4. Lihat <strong>saldo bersih</strong> Anda</p>
        </div>
      </div>

      <!-- Export Data -->
      <div class="bg-white rounded-2xl p-5 shadow-soft">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <PhDownload :size="20" class="text-orange-600" />
          </div>
          <h2 class="font-bold text-gray-900">Export Data</h2>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>1. Buka menu <strong>Profile</strong></p>
          <p>2. Pilih <strong>Export Data</strong></p>
          <p>3. Tekan <strong>Download CSV</strong></p>
          <p>4. File dapat dibuka di Excel atau Google Sheets</p>
        </div>
      </div>

      <!-- Tips -->
      <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <PhLightbulb :size="20" class="text-white" />
          </div>
          <h2 class="font-bold">Tips Keuangan</h2>
        </div>
        <ul class="space-y-2 text-sm text-primary-100">
          <li>💡 Catat setiap transaksi sesegera mungkin</li>
          <li>💡 Gunakan kategori yang tepat untuk analisis akurat</li>
          <li>💡 Cek statistik setiap minggu</li>
          <li>💡 Export data bulanan sebagai backup</li>
          <li>💡 Tetapkan target pengeluaran bulanan</li>
        </ul>
      </div>

      <!-- Need Help -->
      <div class="bg-gray-50 rounded-2xl p-5 text-center">
        <PhQuestion :size="32" class="text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600 text-sm">Butuh bantuan lebih lanjut?</p>
        <p class="text-gray-400 text-xs mt-1">Hubungi support@dompetin.app</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PhCaretLeft, PhRocket, PhPlus, PhPencil, PhChartBar, 
  PhDownload, PhLightbulb, PhQuestion 
} from '@phosphor-icons/vue'
</script>
