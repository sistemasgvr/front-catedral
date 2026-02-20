<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] overflow-y-auto"
        @click.self="closeModal"
      >
        <!-- Backdrop con Blur -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[0.5px] transition-all"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              class="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[10000]"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalle de Solicitud
                  </h2>
                  <p v-if="solicitud" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Código: {{ solicitud.idsolicitud }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Botón Editar -->
                  <button
                    v-if="!modoEdicion && solicitud"
                    @click="activarModoEdicion"
                    class="rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span class="text-sm font-medium">Editar</span>
                  </button>
                  
                  <!-- Botones Guardar/Cancelar en modo edición -->
                  <template v-if="modoEdicion">
                    <button
                      @click="guardarCambios"
                      :disabled="guardando"
                      class="rounded-lg px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg v-if="!guardando" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {{ guardando ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button
                      @click="cancelarEdicion"
                      :disabled="guardando"
                      class="rounded-lg px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                  </template>

                  <!-- Botón Cerrar -->
                  <button
                    @click="closeModal"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]"></div>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles...</p>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="mt-4 text-red-600 dark:text-red-400">{{ error }}</p>
                  <button
                    @click="cargarDetalle"
                    class="mt-4 px-4 py-2 bg-[#C88A2A] text-white rounded-lg hover:bg-[#B6791F] transition-colors"
                  >
                    Reintentar
                  </button>
                </div>

                <!-- Content -->
                <div v-else-if="solicitud" class="space-y-6">
                  <!-- Botón de Contacto WhatsApp -->
                  <div class="flex flex-wrap gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <a
                    :href="getWhatsAppLink()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>


                  <!-- Información del Solicitante -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Información del Solicitante
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Nombres
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.nombres"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.nombres }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Apellidos
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.apellidos"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.apellidos }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Tipo de Documento
                        </label>
                        <select
                          v-if="modoEdicion"
                          v-model="formEdicion.idtipodocumento"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        >
                          <option 
                            v-for="opcion in opcionesTipoDocumento" 
                            :key="opcion.id" 
                            :value="opcion.id"
                          >
                            {{ opcion.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ getNombreOpcion(solicitud.idtipodocumento) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Número de Documento
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.nrodocumento"
                          type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.nrodocumento }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Celular
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model.number="formEdicion.celular"
                          type="number"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.celular }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Correo Electrónico
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.correo"
                          type="email"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white break-all">
                          {{ solicitud.correo }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Información de la Misa -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Información de la Misa
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Tipo de Misa
                        </label>
                        <select
                          v-if="modoEdicion"
                          v-model="formEdicion.idtipomisa"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        >
                          <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                            {{ tipo.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ getNombreTipoMisa(solicitud.idtipomisa) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Horario
                        </label>
                        <select
                          v-if="modoEdicion"
                          v-model="formEdicion.idhorario"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        >
                          <option 
                            v-for="opcion in opcionesHorario" 
                            :key="opcion.id" 
                            :value="opcion.id"
                          >
                            {{ opcion.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ getNombreOpcion(solicitud.idhorario) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fecha Deseada
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.fechamisadeseada"
                          type="date"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fecha de Celebración
                        </label>
                        <input
                          v-if="modoEdicion"
                          v-model="formEdicion.fechacelebracion"
                          type="date"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                        />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechacelebracion) }}
                        </p>
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Intención
                        </label>
                        <textarea
                          v-if="modoEdicion"
                          v-model="formEdicion.intencion"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                          placeholder="Escribe la intención de la misa..."
                        ></textarea>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.intencion || "Sin intención especificada" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Estado y Pago -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Estado -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Estado
                      </h3>
                      <div class="space-y-3">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Estado del Proceso
                          </label>
                          <select
                            v-if="modoEdicion"
                            v-model="formEdicion.idEstadoProceso"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                          >
                            <option :value="null">Sin estado</option>
                            <option 
                              v-for="opcion in opcionesEstado" 
                              :key="opcion.id" 
                              :value="opcion.id"
                            >
                              {{ opcion.nombre }}
                            </option>
                          </select>
                          <div v-else>
                            <span v-if="solicitud.idEstadoProceso" :class="getEstadoClass(solicitud.idEstadoProceso)">
                              {{ getNombreOpcion(solicitud.idEstadoProceso) }}
                            </span>
                            <span v-else class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100/60 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                              Sin estado
                            </span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Fecha de Solicitud
                          </label>
                          <input
                            v-if="modoEdicion"
                            v-model="formEdicion.fechasolicitud"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                          />
                          <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ formatearFecha(solicitud.fechasolicitud) }}
                          </p>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Estado Activo
                          </label>
                          <div v-if="modoEdicion" class="flex items-center">
                            <label class="relative inline-flex items-center cursor-pointer">
                              <input 
                                v-model="formEdicion.estado" 
                                type="checkbox" 
                                class="sr-only peer"
                              />
                              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C88A2A]/20 dark:peer-focus:ring-[#C88A2A]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#C88A2A]"></div>
                              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-white">
                                {{ formEdicion.estado ? 'Activo' : 'Inactivo' }}
                              </span>
                            </label>
                          </div>
                          <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                            <span :class="solicitud.estado ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                              {{ solicitud.estado ? 'Activo' : 'Inactivo' }}
                            </span>
                          </p>
                        </div>

                        <!-- Botones de Cambio de Estado Rápido (solo cuando NO está en modo edición) -->
                        <div v-if="!modoEdicion" class="pt-3 space-y-2">
                          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Cambio Rápido de Estado
                          </p>
                          <button
                            @click="cambiarEstado('aprobar')"
                            :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ cambiandoEstado ? 'Procesando...' : 'Aprobar' }}
                          </button>
                          <button
                            @click="cambiarEstado('denegar')"
                            :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {{ cambiandoEstado ? 'Procesando...' : 'Denegar' }}
                          </button>
                          <button
                            @click="cambiarEstado('revision')"
                            :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ cambiandoEstado ? 'Procesando...' : 'En Revisión' }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Pago -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Información de Pago
                      </h3>
                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Monto Total
                          </label>
                          <div v-if="modoEdicion" class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              S/
                            </span>
                            <input
                              v-model.number="formEdicion.montototal"
                              type="number"
                              step="0.01"
                              min="0"
                              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                            />
                          </div>
                          <p v-else class="text-2xl font-bold text-[#C88A2A]">
                            S/ {{ Number(solicitud.montototal).toFixed(2) }}
                          </p>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Voucher de Pago
                          </label>
                          <div v-if="modoEdicion" class="space-y-2">
  <input
    v-model="formEdicion.voucherpago"
    type="url"
    placeholder="https://..."
    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
  />

  <a
    v-if="formEdicion.voucherpago"
    :href="formEdicion.voucherpago"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
  >
    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Vista previa
  </a>
</div>

<div v-else>
  <a
    v-if="solicitud.voucherpago"
    :href="solicitud.voucherpago"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
  >
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Ver Voucher
  </a>

  <p
    v-else
    class="text-sm text-gray-500 dark:text-gray-400"
  >
    No disponible
  </p>
</div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Auditoría -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#C88A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Información de Auditoría
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Fecha de Creación
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFechaHora(solicitud.fechacreacion) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Última Modificación
                        </label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFechaHora(solicitud.fechamodificacion) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="closeModal"
                  class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { getDetalleSolicitud } from "../actions/getDetalleSolicitud.action";
import { actualizarSolicitud } from "../actions/actualizarSolicitud.action";
import { cambiarEstadoSolicitud } from "../actions/cambiarEstadoSolicitud.action";
import { getOpcionesLista } from "../actions/getOpcionesLista.action";
import { getTiposMisa } from "../actions/getTiposMisa.action";
import { mapOpcionToSelect } from "../interfaces/opcionLista.interface";
import type { IDetalleSolicitud } from "../interfaces/detalleSolicitud.interface";
import type { ISelectOption } from "../interfaces/opcionLista.interface";
import type { ITipoMisa } from "../interfaces/tipoMisa.interface";

/* ================================
   PROPS & EMITS
================================ */

interface Props {
  isOpen: boolean;
  solicitudId: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

/* ================================
   STATE
================================ */

const solicitud = ref<IDetalleSolicitud | null>(null);
const tiposMisa = ref<ITipoMisa[]>([]);
const opcionesCache = ref<Map<number, ISelectOption>>(new Map());
const opcionesTipoDocumento = ref<ISelectOption[]>([]);
const opcionesHorario = ref<ISelectOption[]>([]);
const opcionesEstado = ref<ISelectOption[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const modoEdicion = ref(false);
const guardando = ref(false);
const cambiandoEstado = ref(false);

const formEdicion = ref({
  nombres: "",
  apellidos: "",
  idtipodocumento: 0,
  nrodocumento: "",
  celular: 0,
  correo: "",
  idtipomisa: 0,
  idhorario: 0,
  fechamisadeseada: "",
  fechacelebracion: "",
  fechasolicitud: "",
  intencion: "",
  montototal: 0,
  voucherpago: "",
  idEstadoProceso: null as number | null,
  estado: true,
});

/* ================================
   COMPUTED
================================ */

const mensajeWhatsApp = computed(() => {
  if (!solicitud.value) return "";
  return `Hola ${solicitud.value.nombres}, te contacto respecto a tu solicitud de misa #${solicitud.value.idsolicitud}.`;
});

/* ================================
   METHODS
================================ */

const getWhatsAppLink = (): string => {
  if (!solicitud.value) return "";
  const mensaje = encodeURIComponent(mensajeWhatsApp.value);
  return `https://wa.me/51${solicitud.value.celular}?text=${mensaje}`;
};

const cargarOpcionesPorLista = async (idLista: number) => {
  try {
    const data = await getOpcionesLista(idLista);
    const opciones = data.map(mapOpcionToSelect);
    
    opciones.forEach(opcion => {
      opcionesCache.value.set(opcion.id, opcion);
    });
    
    return opciones;
  } catch (err) {
    console.error(`Error cargando opciones de lista ${idLista}:`, err);
    return [];
  }
};

const cargarTiposMisa = async () => {
  try {
    tiposMisa.value = await getTiposMisa();
  } catch (err) {
    console.error("Error cargando tipos de misa:", err);
  }
};

const cargarTodasLasOpciones = async (solicitudData: IDetalleSolicitud) => {
  const idsUnicos = new Set<number>();
  
  if (solicitudData.idtipodocumento) idsUnicos.add(solicitudData.idtipodocumento);
  if (solicitudData.idhorario) idsUnicos.add(solicitudData.idhorario);
  if (solicitudData.idEstadoProceso) idsUnicos.add(solicitudData.idEstadoProceso);

  const idsArray = Array.from(idsUnicos);
  await Promise.all(idsArray.map(id => cargarOpcionesPorLista(id)));
  
  // Cargar listas completas para selectores en modo edición
  opcionesTipoDocumento.value = await cargarOpcionesPorLista(21); // Ajusta el ID de lista según tu BD
  opcionesHorario.value = await cargarOpcionesPorLista(8); // Ajusta el ID de lista según tu BD
  opcionesEstado.value = await cargarOpcionesPorLista(7); // ID LISTA 7 para estados
};

const cargarDetalle = async () => {
  if (!props.solicitudId) return;

  loading.value = true;
  error.value = null;
  solicitud.value = null;

  try {
    const data = await getDetalleSolicitud(props.solicitudId);
    solicitud.value = data;
    
    await Promise.all([
      cargarTiposMisa(),
      cargarTodasLasOpciones(data),
    ]);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error al cargar el detalle";
    console.error("Error cargando detalle:", err);
  } finally {
    loading.value = false;
  }
};

const activarModoEdicion = () => {
  if (!solicitud.value) return;
  
  formEdicion.value = {
    nombres: solicitud.value.nombres,
    apellidos: solicitud.value.apellidos,
    idtipodocumento: solicitud.value.idtipodocumento,
    nrodocumento: solicitud.value.nrodocumento,
    celular: solicitud.value.celular,
    correo: solicitud.value.correo,
    idtipomisa: solicitud.value.idtipomisa,
    idhorario: solicitud.value.idhorario,
    fechamisadeseada: solicitud.value.fechamisadeseada,
    fechacelebracion: solicitud.value.fechacelebracion,
    fechasolicitud: solicitud.value.fechasolicitud,
    intencion: solicitud.value.intencion || "",
    montototal: solicitud.value.montototal,
    voucherpago: solicitud.value.voucherpago,
    idEstadoProceso: solicitud.value.idEstadoProceso,
    estado: solicitud.value.estado,
  };
  
  modoEdicion.value = true;
};

const cancelarEdicion = () => {
  modoEdicion.value = false;
};

const guardarCambios = async () => {
  if (!solicitud.value) return;

  guardando.value = true;
  try {
    await actualizarSolicitud(solicitud.value.idsolicitud, formEdicion.value);
    
    // Recargar los datos
    await cargarDetalle();
    
    modoEdicion.value = false;
    emit("updated");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error al guardar los cambios";
    console.error("Error guardando cambios:", err);
  } finally {
    guardando.value = false;
  }
};

const cambiarEstado = async (accion: 'aprobar' | 'denegar' | 'revision') => {
  if (!solicitud.value) return;

  const mensajes = {
    aprobar: '¿Está seguro de aprobar esta solicitud?',
    denegar: '¿Está seguro de denegar esta solicitud?',
    revision: '¿Está seguro de poner esta solicitud en revisión?'
  };

  const confirmacion = confirm(mensajes[accion]);
  if (!confirmacion) return;

  cambiandoEstado.value = true;
  try {
    await cambiarEstadoSolicitud(solicitud.value.idsolicitud, accion);
    
    // Recargar los datos
    await cargarDetalle();
    
    emit("updated");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error al cambiar el estado";
    console.error("Error cambiando estado:", err);
  } finally {
    cambiandoEstado.value = false;
  }
};

const closeModal = () => {
  modoEdicion.value = false;
  emit("close");
};

const getNombreOpcion = (id: number): string => {
  const opcion = opcionesCache.value.get(id);
  return opcion?.nombre || "N/A";
};

const getNombreTipoMisa = (id: number): string => {
  const tipo = tiposMisa.value.find(t => t.idtipomisa === id);
  return tipo?.nombre || "N/A";
};

const getEstadoClass = (idEstado: number): string => {
  const estado = getNombreOpcion(idEstado).toUpperCase();
  
  if (estado.includes('APROBADA') || estado.includes('APROBADO')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100/60 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600';
  }
  
  if (estado.includes('DENEGADA') || estado.includes('DENEGADO') || estado.includes('RECHAZ')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100/60 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-600';
  }
  
  if (estado.includes('REVISIÓN') || estado.includes('REVISION') || estado.includes('PENDIENTE')) {
    return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-orange-100/60 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-600';
  }

  return 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100/60 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
};

const formatearFecha = (fecha: string): string => {
  if (!fecha) return "N/A";
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const formatearFechaHora = (fecha: string): string => {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* ================================
   WATCHERS
================================ */

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.solicitudId) {
      cargarDetalle();
    } else if (!newValue) {
      modoEdicion.value = false;
    }
  }
);
</script>