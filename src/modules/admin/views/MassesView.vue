<template>
  <AdminLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="relative z-10 flex flex-col min-h-screen">
        <main class="flex-1 px-4 py-6">
          <div class="w-full max-w-7xl mx-auto">

            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
              <div
                class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div class="min-w-0 flex-1">
                  <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Gestión de Misas</h1>
                  <p class="text-gray-600 dark:text-gray-400">Administra el calendario de misas y celebraciones</p>
                </div>
                <!-- Barra de acciones: dos grupos (vista/filtros | exportar/crear) para evitar filas huérfanas -->
                <div
                  class="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:w-auto lg:max-w-[min(100%,44rem)] xl:max-w-none xl:flex-nowrap xl:gap-3">
                  <div
                    class="flex flex-wrap items-center justify-stretch gap-2 sm:justify-end rounded-xl border border-gray-200/80 bg-gray-50/80 p-1.5 dark:border-gray-600 dark:bg-gray-900/40 sm:inline-flex sm:shrink-0">
                    <div
                      class="flex min-w-0 flex-1 shrink-0 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm sm:flex-initial sm:min-w-0">
                      <button type="button" @click="vistaCalendario = false"
                        class="flex-1 px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] sm:flex-initial sm:px-4"
                        :class="!vistaCalendario
                          ? 'bg-[#C88A2A] text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'">
                        Lista
                      </button>
                      <button type="button" @click="vistaCalendario = true"
                        class="flex-1 px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] border-l border-gray-300 dark:border-gray-600 sm:flex-initial"
                        :class="vistaCalendario
                          ? 'bg-[#C88A2A] text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'">
                        Calendario
                      </button>
                    </div>
                    <button type="button" @click="toggleFiltrosPanel"
                      class="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 sm:flex-initial sm:min-w-0"
                      :aria-expanded="filtrosPanelAbiertos"
                      :title="filtrosPanelAbiertos ? 'Ocultar panel de filtros' : 'Mostrar panel de filtros'">
                      <Icon :icon="filtrosPanelAbiertos ? 'mdi:filter-off-outline' : 'mdi:filter-variant'"
                        class="h-5 w-5 shrink-0 text-[#C88A2A]" aria-hidden="true" />
                      <span class="whitespace-nowrap">{{ filtrosPanelAbiertos ? 'Ocultar filtros' : 'Filtros' }}</span>
                      <span v-if="filtrosActivosCount > 0"
                        class="min-w-[1.25rem] rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                        {{ filtrosActivosCount }}
                      </span>
                    </button>
                  </div>
                  <div class="hidden h-9 w-px shrink-0 bg-gray-200 dark:bg-gray-600 sm:block" aria-hidden="true" />
                  <div
                    class="flex flex-wrap items-center justify-stretch gap-2 sm:justify-end sm:inline-flex sm:shrink-0">
                    <button type="button" @click="exportarExcel" :disabled="misasFiltradas.length === 0 || exportandoExcel"
                      class="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:px-4">
                      <Icon v-if="exportandoExcel" icon="mdi:loading" class="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
                      <Icon v-else icon="mdi:microsoft-excel" class="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span class="text-left leading-tight sm:whitespace-nowrap">
                        {{ exportandoExcel ? 'Generando Excel…' : `Exportar Excel (${misasFiltradas.length})` }}
                      </span>
                    </button>
                    <button type="button" @click="exportarWord" :disabled="misasFiltradas.length === 0 || exportando"
                      class="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:px-4">
                      <Icon v-if="exportando" icon="mdi:loading" class="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
                      <Icon v-else icon="mdi:microsoft-word" class="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span class="text-left leading-tight sm:whitespace-nowrap">
                        {{ exportando ? 'Exportando…' : `Exportar Word (${misasFiltradas.length})` }}
                      </span>
                    </button>
                    <button type="button" @click="abrirModalCrear"
                      class="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#C88A2A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#B6791F] sm:w-auto sm:shrink-0">
                      <Icon icon="mdi:plus" class="h-5 w-5 shrink-0" aria-hidden="true" />
                      Nueva Misa
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters (panel colapsable) -->
            <Transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1">
              <div v-show="filtrosPanelAbiertos"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors overflow-hidden">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filtros</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                <!-- Búsqueda -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
                  <input v-model="filtros.busqueda" type="text" placeholder="Tipo, intención, solicitante..."
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all" />
                </div>

                <!-- Tipo de Misa -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Misa</label>
                  <select v-model="filtros.tipoMisa"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all">
                    <option :value="null">Todas</option>
                    <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                      {{ tipo.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Estado -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                  <select v-model="filtros.estado"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all">
                    <option :value="null">Todos</option>
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>
                  </select>
                </div>

                <!-- Fecha Desde -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha desde</label>
                  <input v-model="filtros.fechaDesde" type="date"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all" />
                </div>

                <!-- Fecha Hasta -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha hasta</label>
                  <input v-model="filtros.fechaHasta" type="date"
                    class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all" />
                </div>

              </div>

              <!-- Limpiar filtros -->
              <div class="mt-4 flex justify-end">
                <button @click="limpiarFiltros"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-[#C88A2A] dark:hover:text-[#C88A2A] transition-colors flex items-center gap-1">
                  <Icon icon="mdi:filter-remove-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                  Limpiar filtros
                </button>
              </div>

              <!-- Exportar menciones por misa (Excel) -->
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  Exportar menciones por misa (Excel)
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Libro con resumen de la misa y hoja <span class="font-medium">Menciones</span> (todas las líneas;
                  importe solo si la solicitud está aprobada). Usa el listado filtrado actual.
                </p>
                <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div class="flex-1 min-w-0">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Misa</label>
                    <select v-model="idMisaExportMenciones"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent transition-all">
                      <option value="">Seleccione una misa…</option>
                      <option v-for="m in misasFiltradas" :key="m.idmisa" :value="String(m.idmisa)">
                        #{{ m.idmisa }} — {{ m.fechacelebracion }} · {{ etiquetaOpcionMisa(m) }}
                      </option>
                    </select>
                  </div>
                  <button type="button" @click="exportarExcelMencionesSeleccion"
                    :disabled="idMisaExportMenciones === '' || misasFiltradas.length === 0 || exportandoExcelMencionesMisa !== null"
                    class="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px]">
                    <Icon v-if="exportandoExcelMencionesMisa === 'select'" icon="mdi:loading"
                      class="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
                    <Icon v-else icon="mdi:microsoft-excel" class="w-5 h-5 shrink-0" aria-hidden="true" />
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
            </Transition>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Misas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.total }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:calendar-month-outline" class="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Este Mes</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.esteMes }}</p>
                  </div>
                  <div
                    class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:clock-outline" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Próximas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.proximas }}</p>
                  </div>
                  <div
                    class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:calendar-check-outline" class="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Activas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ estadisticas.activas }}</p>
                  </div>
                  <div
                    class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:check-decagram-outline" class="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendario -->
            <MassCalendarPanel
              v-if="vistaCalendario"
              ref="calendarRef"
              :filtros="filtros"
              @select-misa="verDetalle"
              @accion-misa="onAccionMisaCalendario"
            />

            <!-- Table -->
            <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors">
              <div v-if="loading" class="p-12 text-center">
                <Icon icon="mdi:loading" class="inline-block h-12 w-12 text-[#C88A2A] animate-spin" aria-hidden="true" />
                <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando misas...</p>
              </div>

              <div v-else-if="misasFiltradas.length === 0" class="p-12 text-center">
                <Icon icon="mdi:calendar-blank-outline" class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <p class="mt-4 text-gray-600 dark:text-gray-400">No se encontraron misas</p>
              </div>

              <!-- Desktop Table -->
              <div v-else class="hidden lg:block overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-700/50 border-b-2 border-gray-200 dark:border-gray-600">
                    <tr>
                      <th
                        class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Código</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Fecha y Hora</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Misa</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Título / Intención</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Estado</th>
                      <th
                        class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider min-w-[11rem]">
                        Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="misa in misasFiltradas" :key="misa.idmisa"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ misa.idmisa }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">
                          <div class="font-medium text-gray-900 dark:text-white">{{
                            formatearFecha(misa.fechacelebracion) }}</div>
                          <div class="text-gray-500 dark:text-gray-400">{{ formatearHora(misa.horainicio) }} - {{
                            formatearHora(misa.horafin) }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm text-gray-900 dark:text-gray-200">{{ misa.tipomisa?.nombre || 'N/A'
                        }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm">
                          <div class="text-gray-900 dark:text-white">
                            {{ misa.titulo || misa.solicitud?.intencion || 'Sin título' }}
                          </div>
                          <div v-if="misa.solicitud" class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Sol: {{ misa.solicitud.nombres }} {{ misa.solicitud.apellidos }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="misa.estado ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'"
                          class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {{ misa.estado ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center justify-center gap-2">
                          <button @click="verDetalle(misa.idmisa)"
                            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Ver">
                            <Icon icon="mdi:eye-outline" class="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button @click="editarMisa(misa.idmisa)"
                            class="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                            title="Editar">
                            <Icon icon="mdi:pencil-outline" class="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button @click="exportarExcelMencionesDeMisa(misa.idmisa, 'fila')"
                            :disabled="exportandoExcelMencionesMisa !== null"
                            class="p-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors disabled:opacity-40"
                            title="Excel: menciones de esta misa">
                            <Icon v-if="exportandoExcelMencionesMisa === misa.idmisa" icon="mdi:loading"
                              class="w-5 h-5 animate-spin" aria-hidden="true" />
                            <Icon v-else icon="mdi:microsoft-excel" class="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button @click="confirmarEliminar(misa.idmisa)"
                            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar">
                            <Icon icon="mdi:delete-outline" class="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="lg:hidden p-4 space-y-4">
                <div v-for="misa in misasFiltradas" :key="misa.idmisa"
                  class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-sm">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ misa.idmisa }}</span>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ formatearFecha(misa.fechacelebracion) }} - {{ formatearHora(misa.horainicio) }}
                      </div>
                    </div>
                    <span :class="misa.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 py-1 text-xs font-semibold rounded-full">
                      {{ misa.estado ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div class="space-y-2 mb-3">
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                      <span class="text-sm text-gray-900 dark:text-white ml-1 font-medium">{{ misa.tipomisa?.nombre ||
                        'N/A' }}</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Título:</span>
                      <div class="text-sm text-gray-900 dark:text-white mt-0.5">{{ misa.titulo ||
                        misa.solicitud?.intencion || 'Sin título' }}</div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button @click="verDetalle(misa.idmisa)"
                      class="flex-1 min-w-[4.5rem] px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1">Ver</button>
                    <button @click="editarMisa(misa.idmisa)"
                      class="flex-1 min-w-[4.5rem] px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1">Editar</button>
                    <button type="button" @click="exportarExcelMencionesDeMisa(misa.idmisa, 'fila')"
                      :disabled="exportandoExcelMencionesMisa !== null"
                      class="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-40">
                      {{ exportandoExcelMencionesMisa === misa.idmisa ? '…' : 'Excel' }}
                    </button>
                    <button @click="confirmarEliminar(misa.idmisa)"
                      class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg transition-colors">
                      <Icon icon="mdi:delete-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>

    <!-- Modales -->
    <DetailMassModal :is-open="modalDetalle.isOpen" :misa-id="modalDetalle.misaId"
      @close="modalDetalle.isOpen = false" />
    <FormMassModal :is-open="modalForm.isOpen" :misa-id="modalForm.misaId" @close="modalForm.isOpen = false"
      @saved="handleMisaGuardada" />
    <ConfirmModal :is-open="modalConfirm.isOpen" :loading="modalConfirm.loading" type="danger" title="¿Eliminar Misa?"
      message="Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar esta misa?" confirm-text="Eliminar"
      cancel-text="Cancelar" @confirm="handleEliminar" @cancel="modalConfirm.isOpen = false" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, BorderStyle,
  TableBorders, ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

import AdminLayout from '../layouts/AdminLayout.vue';
import { listarMisas } from '../actions/listarMisas.action';
import { eliminarMisa } from '../actions/eliminarMisa.action';
import { listarTiposMisa } from '../actions/tipoMisa.action';
import type { IMisaConRelaciones } from '../interfaces/misa.interface';
import type { ITipoMisa } from '../interfaces/tipoMisa.interface';
import ConfirmModal from '../components/ConfirmModal.vue';
import DetailMassModal from '../components/DetailMassModal.vue';
import FormMassModal from '../components/FormMassModal.vue';
import MassCalendarPanel, { type AccionMisaCalendario } from '../components/MassCalendarPanel.vue';
import { obtenerDetalleMisa } from '../actions/crudMisa.action';
import {
  generarYDescargarReporteMisasExcel,
  generarYDescargarExcelMencionesUnaMisa,
} from '../utils/exportMisasExcel';

const LS_PANEL_FILTROS = 'misas:filtros-panel-abierto';

function leerPreferenciaPanelFiltros(): boolean {
  try {
    const v = localStorage.getItem(LS_PANEL_FILTROS);
    if (v === '1') return true;
    if (v === '0') return false;
  } catch {
    /* ignore */
  }
  return false;
}

/* ================================
   STATE
================================ */
const misas = ref<IMisaConRelaciones[]>([]);
const tiposMisa = ref<ITipoMisa[]>([]);
const loading = ref(false);
const exportando = ref(false);
const exportandoExcel = ref(false);
/** null = inactivo; número = fila en carga; 'select' = export desde desplegable */
const exportandoExcelMencionesMisa = ref<number | 'select' | null>(null);
const idMisaExportMenciones = ref<string>('');

const modalDetalle = ref({ isOpen: false, misaId: null as number | null });
const modalForm = ref({ isOpen: false, misaId: null as number | null });
const modalConfirm = ref({ isOpen: false, misaId: null as number | null, loading: false });

const vistaCalendario = ref(false);
const calendarRef = ref<InstanceType<typeof MassCalendarPanel> | null>(null);

const filtros = ref({
  busqueda: '',
  tipoMisa: null as number | null,
  estado: null as boolean | null,
  fechaDesde: '',
  fechaHasta: '',
});

/** Panel de filtros visible; por defecto oculto para ahorrar espacio; se recuerda en localStorage. */
const filtrosPanelAbiertos = ref(leerPreferenciaPanelFiltros());

watch(filtrosPanelAbiertos, (abierto) => {
  try {
    localStorage.setItem(LS_PANEL_FILTROS, abierto ? '1' : '0');
  } catch {
    /* ignore */
  }
});

const toggleFiltrosPanel = () => {
  filtrosPanelAbiertos.value = !filtrosPanelAbiertos.value;
};

/* ================================
   COMPUTED
================================ */
const filtrosActivosCount = computed(() => {
  let n = 0;
  if (filtros.value.busqueda.trim()) n++;
  if (filtros.value.tipoMisa !== null) n++;
  if (filtros.value.estado !== null) n++;
  if (filtros.value.fechaDesde) n++;
  if (filtros.value.fechaHasta) n++;
  return n;
});

const misasFiltradas = computed(() => {
  let resultado = [...misas.value];

  if (filtros.value.busqueda) {
    const q = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter(m =>
      m.tipomisa?.nombre.toLowerCase().includes(q) ||
      m.titulo?.toLowerCase().includes(q) ||
      m.solicitud?.intencion?.toLowerCase().includes(q) ||
      m.solicitud?.nombres.toLowerCase().includes(q) ||
      m.solicitud?.apellidos.toLowerCase().includes(q)
    );
  }

  if (filtros.value.tipoMisa !== null) {
    resultado = resultado.filter(m => m.idtipomisa === filtros.value.tipoMisa);
  }

  if (filtros.value.estado !== null) {
    resultado = resultado.filter(m => m.estado === filtros.value.estado);
  }

  if (filtros.value.fechaDesde) {
    resultado = resultado.filter(m => m.fechacelebracion >= filtros.value.fechaDesde);
  }

  if (filtros.value.fechaHasta) {
    resultado = resultado.filter(m => m.fechacelebracion <= filtros.value.fechaHasta);
  }

  resultado.sort((a, b) => {
    const c = b.fechacelebracion.localeCompare(a.fechacelebracion);
    if (c !== 0) return c;
    const h = (b.horainicio || '').localeCompare(a.horainicio || '');
    if (h !== 0) return h;
    return b.idmisa - a.idmisa;
  });

  return resultado;
});

const estadisticas = computed(() => {
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  return {
    total: misas.value.length,
    esteMes: misas.value.filter(m => m.fechacelebracion.startsWith(mesActual)).length,
    proximas: misas.value.filter(m => new Date(m.fechacelebracion + 'T00:00:00') >= hoy).length,
    activas: misas.value.filter(m => m.estado).length,
  };
});

/* ================================
   HELPERS DE FORMATO
================================ */
const formatearFecha = (fecha: string): string => {
  if (!fecha) return 'N/A';
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
};

const formatearHora = (hora: string): string => {
  if (!hora || !hora.includes(':')) return 'N/A';
  const [hh = '0', mm = '0'] = hora.split(':');
  const d = new Date();
  d.setHours(parseInt(hh), parseInt(mm));
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
};

/* ================================
   EXPORT EXCEL (exceljs)
================================ */
const exportarExcel = async () => {
  if (misasFiltradas.value.length === 0) return;
  exportandoExcel.value = true;
  try {
    const misasDetalle = await Promise.all(
      misasFiltradas.value.map((m) => obtenerDetalleMisa(m.idmisa))
    );
    const tipoNombre =
      filtros.value.tipoMisa !== null
        ? tiposMisa.value.find((t) => t.idtipomisa === filtros.value.tipoMisa)?.nombre ?? null
        : null;
    const estadoLabel =
      filtros.value.estado === null ? null : filtros.value.estado ? 'Activo' : 'Inactivo';
    await generarYDescargarReporteMisasExcel(misasDetalle, {
      filtros: {
        fechaDesde: filtros.value.fechaDesde,
        fechaHasta: filtros.value.fechaHasta,
        busqueda: filtros.value.busqueda,
        tipoMisaNombre: tipoNombre,
        estadoLabel,
      },
      totalEnListadoFiltrado: misasFiltradas.value.length,
    });
  } catch (error) {
    console.error('Error exportando Excel:', error);
    alert('Error al generar el archivo Excel');
  } finally {
    exportandoExcel.value = false;
  }
};

const etiquetaOpcionMisa = (m: IMisaConRelaciones): string => {
  const t = m.titulo || m.tipomisa?.nombre || 'Sin título';
  return t.length > 56 ? `${t.slice(0, 53)}…` : t;
};

const exportarExcelMencionesDeMisa = async (idmisa: number, origen: 'fila' | 'select') => {
  if (exportandoExcelMencionesMisa.value !== null) return;
  exportandoExcelMencionesMisa.value = origen === 'select' ? 'select' : idmisa;
  try {
    const detalle = await obtenerDetalleMisa(idmisa);
    await generarYDescargarExcelMencionesUnaMisa(detalle);
  } catch (error) {
    console.error('Error exportando Excel de menciones por misa:', error);
    alert('Error al generar el Excel de menciones');
  } finally {
    exportandoExcelMencionesMisa.value = null;
  }
};

const exportarExcelMencionesSeleccion = async () => {
  const id = Number(idMisaExportMenciones.value);
  if (!Number.isFinite(id) || id <= 0) {
    alert('Seleccione una misa del listado filtrado.');
    return;
  }
  await exportarExcelMencionesDeMisa(id, 'select');
};

watch(
  misasFiltradas,
  (list) => {
    const cur = idMisaExportMenciones.value;
    if (cur === '') return;
    const id = Number(cur);
    if (!Number.isFinite(id) || !list.some((m) => m.idmisa === id)) {
      idMisaExportMenciones.value = '';
    }
  },
  { deep: true }
);

/* ================================
   EXPORT WORD
================================ */
const exportarWord = async () => {
  if (misasFiltradas.value.length === 0) return;
  exportando.value = true;

  try {
    const GOLD = 'C88A2A';
    const DARK = '1F2937';
    const GRAY = '6B7280';
    const WHITE = 'FFFFFF';

    // Cargar detalle completo (con menciones) de cada misa filtrada
    const misasDetalle = await Promise.all(
      misasFiltradas.value.map(m => obtenerDetalleMisa(m.idmisa))
    );

    const celdaHeader = (texto: string, widthPct: number) =>
      new TableCell({
        width: { size: widthPct, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: GOLD, fill: GOLD },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: texto, bold: true, color: WHITE, size: 18 })],
          }),
        ],
      });

    const celdaDato = (
      contenido: Paragraph[],
      widthPct: number,
      colorFondo = WHITE
    ) =>
      new TableCell({
        width: { size: widthPct, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: colorFondo, fill: colorFondo },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        },
        children: contenido,
      });

    const parrafoSimple = (texto: string, negrita = false, color = GRAY) =>
      new Paragraph({
        children: [new TextRun({ text: texto || '—', bold: negrita, color, size: 18 })],
      });

    const filas = misasDetalle.map((misa, idx) => {
      const fondo = idx % 2 === 0 ? WHITE : 'F9FAFB';

      // Primer solicitante para la columna de solicitante
      const primeraMencion = misa.menciones?.[0];
      const sol = primeraMencion?.mencion?.solicitud;

      // Párrafos de menciones en viñetas
      const mencionesParrafos: Paragraph[] = misa.menciones && misa.menciones.length > 0
        ? misa.menciones.map((item) => {
          const s = item.mencion.solicitud;

          return new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${item.mencion.solicitud.intencion || item.mencion.descripcion || 'Sin intención'}`,
                bold: true,
                size: 17,
                color: DARK,
              }),
              new TextRun({
                text: ` — ${s.nombres} ${s.apellidos}`,
                bold: false,
                size: 17,
                color: GRAY,
              }),
              ...(s.celular
                ? [new TextRun({ text: `\nTel: ${s.celular}`, size: 16, color: GRAY, italics: true })]
                : []),
            ],
          });
        })
        : [parrafoSimple('Sin menciones', false, GRAY)];

      // Párrafos de solicitante (nombre + celular)
      const solicitanteParrafos: Paragraph[] = sol
        ? [
          new Paragraph({
            children: [
              new TextRun({ text: `${sol.nombres} ${sol.apellidos}`, bold: true, size: 18, color: DARK }),
            ],
          }),
          ...(sol.celular
            ? [new Paragraph({
              children: [new TextRun({ text: `📞 ${sol.celular}`, size: 17, color: GRAY })],
            })]
            : []),
        ]
        : [parrafoSimple('—')];

      return new TableRow({
        children: [
          celdaDato([parrafoSimple(formatearFecha(misa.fechacelebracion), true, DARK)], 18, fondo),
          celdaDato([parrafoSimple(`${formatearHora(misa.horainicio)} - ${formatearHora(misa.horafin)}`, false, GRAY)], 13, fondo),
          celdaDato([parrafoSimple(misa.tipomisa?.nombre || 'N/A', false, DARK)], 14, fondo),
          celdaDato([parrafoSimple(misa.titulo || '—', false, DARK)], 17, fondo),
          celdaDato(solicitanteParrafos, 17, fondo),
          celdaDato(mencionesParrafos, 21, fondo),
        ],
      });
    });

    const filtrosAplicados: string[] = [];
    if (filtros.value.fechaDesde) filtrosAplicados.push(`Desde: ${filtros.value.fechaDesde}`);
    if (filtros.value.fechaHasta) filtrosAplicados.push(`Hasta: ${filtros.value.fechaHasta}`);
    if (filtros.value.busqueda) filtrosAplicados.push(`Búsqueda: "${filtros.value.busqueda}"`);
    if (filtros.value.tipoMisa) {
      const tipo = tiposMisa.value.find(t => t.idtipomisa === filtros.value.tipoMisa);
      if (tipo) filtrosAplicados.push(`Tipo: ${tipo.nombre}`);
    }
    if (filtros.value.estado !== null) filtrosAplicados.push(`Estado: ${filtros.value.estado ? 'Activo' : 'Inactivo'}`);

    const fechaReporte = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun({ text: 'REPORTE DE MISAS', bold: true, size: 32, color: GOLD })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD } },
            children: [new TextRun({ text: '' })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 80 },
            children: [new TextRun({ text: `Generado el: ${fechaReporte}`, size: 18, color: GRAY, italics: true })],
          }),
          ...(filtrosAplicados.length > 0
            ? [new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: 'Filtros aplicados: ', bold: true, size: 18, color: DARK }),
                new TextRun({ text: filtrosAplicados.join('  |  '), size: 18, color: GRAY }),
              ],
            })]
            : []),
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({ text: 'Total de registros: ', bold: true, size: 18, color: DARK }),
              new TextRun({ text: String(misasFiltradas.value.length), bold: true, size: 18, color: GOLD }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: TableBorders.NONE,
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  celdaHeader('Fecha', 18),
                  celdaHeader('Horario', 13),
                  celdaHeader('Tipo de Misa', 14),
                  celdaHeader('Título', 17),
                  celdaHeader('Solicitante', 17),
                  celdaHeader('Menciones', 21),
                ],
              }),
              ...filas,
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD } },
            children: [new TextRun({ text: 'Sistema de Gestión de Misas', size: 16, color: GRAY, italics: true })],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `misas_${new Date().toISOString().split('T')[0]}.docx`);
  } catch (error) {
    console.error('Error exportando Word:', error);
    alert('Error al generar el archivo Word');
  } finally {
    exportando.value = false;
  }
};

/* ================================
   MODALES
================================ */
const abrirModalCrear = () => { modalForm.value = { isOpen: true, misaId: null }; };
const verDetalle = (id: number) => { modalDetalle.value = { isOpen: true, misaId: id }; };
const editarMisa = (id: number) => { modalForm.value = { isOpen: true, misaId: id }; };
const confirmarEliminar = (id: number) => { modalConfirm.value = { isOpen: true, misaId: id, loading: false }; };

const onAccionMisaCalendario = (payload: { accion: AccionMisaCalendario; idMisa: number }) => {
  const { accion, idMisa } = payload;
  if (accion === 'ver') verDetalle(idMisa);
  else if (accion === 'editar') editarMisa(idMisa);
  else confirmarEliminar(idMisa);
};

const handleEliminar = async () => {
  if (!modalConfirm.value.misaId) return;
  modalConfirm.value.loading = true;
  try {
    await eliminarMisa(modalConfirm.value.misaId);
    await cargarMisas();
    modalConfirm.value.isOpen = false;
  } catch (error) {
    console.error('Error eliminando misa:', error);
    alert('Error al eliminar la misa');
  } finally {
    modalConfirm.value.loading = false;
  }
};

const handleMisaGuardada = async () => {
  await cargarMisas();
};

const limpiarFiltros = () => {
  filtros.value = { busqueda: '', tipoMisa: null, estado: null, fechaDesde: '', fechaHasta: '' };
};

/* ================================
   DATA
================================ */
const cargarMisas = async () => {
  loading.value = true;
  try { misas.value = await listarMisas(); }
  catch (e) { console.error('Error cargando misas:', e); }
  finally { loading.value = false; }
  calendarRef.value?.recargar();
};

const cargarTiposMisa = async () => {
  try { tiposMisa.value = await listarTiposMisa(); }
  catch (e) { console.error('Error cargando tipos:', e); }
};

onMounted(async () => {
  await Promise.all([cargarTiposMisa(), cargarMisas()]);
});
</script>