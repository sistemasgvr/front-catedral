<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isOpen" class="fixed inset-0 z-[999999999] overflow-y-auto" @click.self="closeModal">
        <!-- Backdrop con Blur -->
        <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs transition-all"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="isOpen"
              class="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[10000]"
              :style="{ zoom: detailTextZoom }"
              @click.stop>
              <!-- Modal Header -->
              <div class="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="min-w-0">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalle de Solicitud
                  </h2>
                  <p v-if="solicitud" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Código: {{ solicitud.idsolicitud }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center justify-end gap-2">
                  <DetailModalTextSizeControl v-model="detailTextZoom" :is-modal-open="isOpen" />
                  <!-- Botón Editar (solo cuando NO está en modo edición) -->
                  <button v-if="!modoEdicion && solicitud" @click="activarModoEdicion"
                    class="rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
                    title="Editar">
                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span class="text-sm font-medium">Editar</span>
                  </button>

                  <!-- Botones Guardar/Cancelar en modo edición -->
                  <template v-if="modoEdicion">
                    <button @click="solicitarGuardarCambios" :disabled="guardando"
                      class="rounded-lg px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <Icon v-if="!guardando" icon="mdi:check" class="w-4 h-4 shrink-0" aria-hidden="true" />
                      <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {{ guardando ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button @click="solicitarCancelarEdicion" :disabled="guardando"
                      class="rounded-lg px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Cancelar
                    </button>
                  </template>

                  <!-- Botón Cerrar (X) -->
                  <button @click="closeModal"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Icon icon="mdi:close" class="w-6 h-6 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div
                      class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#C88A2A]">
                    </div>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando detalles...</p>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-12">
                  <Icon icon="mdi:alert-circle-outline" class="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
                  <p class="mt-4 text-red-600 dark:text-red-400">{{ error }}</p>
                  <button @click="cargarDetalle"
                    class="mt-4 px-4 py-2 bg-[#C88A2A] text-white rounded-lg hover:bg-[#B6791F] transition-colors">
                    Reintentar
                  </button>
                </div>

                <!-- Content -->
                <div v-else-if="solicitud" class="space-y-6">
                  <!-- Botón de Contacto WhatsApp -->
                  <div class="flex flex-wrap gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <a :href="getWhatsAppLink()" target="_blank" rel="noopener noreferrer"
                      class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                      <Icon icon="mdi:whatsapp" class="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
                      Contactar por WhatsApp
                    </a>
                  </div>

                  <!-- Información del Solicitante -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:account-outline" class="w-5 h-5 mr-2 text-[#C88A2A] shrink-0" aria-hidden="true" />
                      Información del Solicitante
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombres</label>
                        <input v-if="modoEdicion" v-model="formEdicion.nombres" type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">{{ solicitud.nombres }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Apellidos</label>
                        <input v-if="modoEdicion" v-model="formEdicion.apellidos" type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">{{ solicitud.apellidos }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Documento</label>
                        <select v-if="modoEdicion" v-model="formEdicion.idtipodocumento"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent">
                          <option v-for="opcion in opcionesTipoDocumento" :key="opcion.id" :value="opcion.id">
                            {{ opcion.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ getNombreOpcion(solicitud.idtipodocumento) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Número de Documento</label>
                        <input v-if="modoEdicion" v-model="formEdicion.nrodocumento" type="text"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">{{ solicitud.nrodocumento }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Celular</label>
                        <input v-if="modoEdicion" v-model.number="formEdicion.celular" type="number"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">{{ solicitud.celular }}</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Correo Electrónico</label>
                        <input v-if="modoEdicion" v-model="formEdicion.correo" type="email"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white break-all">{{ solicitud.correo }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Información de la Misa -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:calendar-month-outline" class="w-5 h-5 mr-2 text-[#C88A2A] shrink-0" aria-hidden="true" />
                      Información de la Misa
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Misa</label>
                        <select v-if="modoEdicion" v-model="formEdicion.idtipomisa"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent">
                          <option v-for="tipo in tiposMisa" :key="tipo.idtipomisa" :value="tipo.idtipomisa">
                            {{ tipo.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ nombreTipoDisplay }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Horario</label>
                        <select v-if="modoEdicion" v-model="formEdicion.idhorario"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent">
                          <option v-for="opcion in opcionesHorario" :key="opcion.id" :value="opcion.id">
                            {{ opcion.nombre }}
                          </option>
                        </select>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ getNombreOpcion(solicitud.idhorario) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha Deseada</label>
                        <input v-if="modoEdicion" v-model="formEdicion.fechamisadeseada" type="date"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechamisadeseada) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Celebración</label>
                        <input v-if="modoEdicion" v-model="formEdicion.fechacelebracion" type="date"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFecha(solicitud.fechacelebracion) }}
                        </p>
                      </div>
                      <div v-if="mostrarCampoIntencion" class="md:col-span-2">
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Intención</label>
                        <textarea v-if="modoEdicion" v-model="formEdicion.intencion" rows="3"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent"
                          placeholder="Escribe la intención de la misa..."></textarea>
                        <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ solicitud.intencion?.trim() || "—" }}
                        </p>
                      </div>
                    </div>

                    <div
                      v-if="solicitud.menciones && solicitud.menciones.length > 0"
                      class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                    >
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {{ etiquetaLineasTitulo }} ({{ solicitud.menciones.length }})
                      </p>
                      <ul class="space-y-2">
                        <li
                          v-for="(m, idx) in solicitud.menciones"
                          :key="m.idmencion"
                          class="text-sm text-gray-900 dark:text-gray-100 pl-2 border-l-2 border-[#C88A2A]/60"
                        >
                          <span class="text-gray-500 dark:text-gray-400 mr-2">{{ idx + 1 }}.</span>
                          {{ m.descripcion?.trim() || "—" }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Estado y Pago -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Estado -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Icon icon="mdi:check-decagram-outline" class="w-5 h-5 mr-2 text-[#C88A2A] shrink-0" aria-hidden="true" />
                        Estado
                      </h3>
                      <div class="space-y-3">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Estado del Proceso</label>
                          <select v-if="modoEdicion" v-model="formEdicion.idestadoproceso"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent">
                            <option :value="null">Sin estado</option>
                            <option v-for="opcion in opcionesEstado" :key="opcion.id" :value="opcion.id">
                              {{ opcion.nombre }}
                            </option>
                          </select>
                          <div v-else>
                            <span v-if="solicitud.idestadoproceso" :class="getEstadoClass(solicitud.idestadoproceso)">
                              {{ getNombreOpcion(solicitud.idestadoproceso) }}
                            </span>
                            <span v-else
                              class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100/60 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                              Sin estado
                            </span>
                          </div>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Solicitud</label>
                          <input v-if="modoEdicion" v-model="formEdicion.fechasolicitud" type="date"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                          <p v-else class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ formatearFecha(solicitud.fechasolicitud) }}
                          </p>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Estado Activo</label>
                          <div v-if="modoEdicion" class="flex items-center">
                            <label class="relative inline-flex items-center cursor-pointer">
                              <input v-model="formEdicion.estado" type="checkbox" class="sr-only peer" />
                              <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C88A2A]/20 dark:peer-focus:ring-[#C88A2A]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#C88A2A]">
                              </div>
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
                          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Cambio Rápido de Estado</p>
                          <button @click="solicitarCambioEstado('aprobar')" :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <Icon icon="mdi:check" class="w-4 h-4 shrink-0" aria-hidden="true" />
                            {{ cambiandoEstado ? 'Procesando...' : 'Aprobar' }}
                          </button>
                          <button @click="solicitarCambioEstado('denegar')" :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <Icon icon="mdi:close" class="w-4 h-4 shrink-0" aria-hidden="true" />
                            {{ cambiandoEstado ? 'Procesando...' : 'Denegar' }}
                          </button>
                          <button @click="solicitarCambioEstado('revision')" :disabled="cambiandoEstado"
                            class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <Icon icon="mdi:clock-outline" class="w-4 h-4 shrink-0" aria-hidden="true" />
                            {{ cambiandoEstado ? 'Procesando...' : 'En Revisión' }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Pago -->
                    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Icon icon="mdi:cash-multiple" class="w-5 h-5 mr-2 text-[#C88A2A] shrink-0" aria-hidden="true" />
                        Información de Pago
                      </h3>
                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Monto Total</label>
                          <div v-if="modoEdicion" class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">S/</span>
                            <input v-model.number="formEdicion.montototal" type="number" step="0.5" min="0"
                              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                          </div>
                          <p v-else class="text-2xl font-bold text-[#C88A2A]">
                            S/ {{ Number(solicitud.montototal ?? 0).toFixed(2) }}
                          </p>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Voucher de Pago</label>

                          <!-- Modo edición: input para URL -->
                          <div v-if="modoEdicion" class="space-y-2">
                            <input v-model="formEdicion.voucherpago" type="url" placeholder="https://..."
                              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#C88A2A] focus:border-transparent" />
                            <button v-if="formEdicion.voucherpago" @click="abrirVoucher(formEdicion.voucherpago)" type="button"
                              class="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                              <Icon icon="mdi:eye-outline" class="w-3 h-3 mr-1 shrink-0" aria-hidden="true" />
                              Vista previa
                            </button>
                          </div>

                          <!-- Modo vista: mostrar imagen inline o botón ver -->
                          <div v-else>
                            <div v-if="solicitud.voucherpago" class="space-y-3">
                              <!-- Previsualización de imagen inline -->
                              <div v-if="voucherCargado && !voucherError"
                                class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-48">
                                <img
                                  :src="getVoucherUrl(solicitud.voucherpago)"
                                  :alt="'Voucher de pago'"
                                  class="w-full object-contain max-h-48 bg-white"
                                  @load="voucherCargado = true; voucherError = false"
                                  @error="voucherError = true"
                                />
                              </div>

                              <!-- Estado de carga o error del voucher -->
                              <div v-else-if="voucherError"
                                class="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                <Icon icon="mdi:alert-outline" class="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" aria-hidden="true" />
                                <span class="text-xs text-yellow-700 dark:text-yellow-300">
                                  No se pudo cargar la imagen del voucher
                                </span>
                              </div>

                              <!-- Botón para abrir en nueva pestaña (siempre visible si hay URL) -->
                              <button @click="abrirVoucher(solicitud.voucherpago)" type="button"
                                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                <Icon icon="mdi:open-in-new" class="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
                                Abrir Voucher
                              </button>
                            </div>

                            <p v-else class="text-sm text-gray-500 dark:text-gray-400">No disponible</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Auditoría -->
                  <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Icon icon="mdi:history" class="w-5 h-5 mr-2 text-[#C88A2A] shrink-0" aria-hidden="true" />
                      Información de Auditoría
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Creación</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFechaHora(solicitud.fechacreacion) }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Última Modificación</label>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ formatearFechaHora(solicitud.fechamodificacion) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer: solo visible cuando NO está en modo edición -->
              <div v-if="!modoEdicion" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button @click="closeModal"
                  class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ConfirmModal: Cambio de Estado Rápido -->
  <ConfirmModal
    :isOpen="confirmEstado.visible"
    :title="confirmEstado.titulo"
    :message="confirmEstado.mensaje"
    :type="confirmEstado.tipo"
    :confirmText="confirmEstado.textoConfirmar"
    cancelText="Cancelar"
    loadingText="Procesando..."
    :loading="cambiandoEstado"
    @confirm="ejecutarCambioEstado"
    @cancel="cancelarConfirmEstado"
  />

  <!-- ConfirmModal: Guardar Cambios -->
  <ConfirmModal
    :isOpen="confirmGuardar.visible"
    title="Guardar Cambios"
    message="¿Estás seguro de que deseas guardar los cambios realizados en esta solicitud?"
    type="info"
    confirmText="Guardar"
    cancelText="Cancelar"
    loadingText="Guardando..."
    :loading="guardando"
    @confirm="guardarCambios"
    @cancel="confirmGuardar.visible = false"
  />

  <!-- ConfirmModal: Cancelar Edición -->
  <ConfirmModal
    :isOpen="confirmCancelar.visible"
    title="Cancelar Edición"
    message="¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán."
    type="warning"
    confirmText="Sí, cancelar"
    cancelText="Seguir editando"
    @confirm="ejecutarCancelarEdicion"
    @cancel="confirmCancelar.visible = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import { getDetalleSolicitud } from "../actions/getDetalleSolicitud.action";
import { actualizarSolicitud } from "../actions/actualizarSolicitud.action";
import { cambiarEstadoSolicitud } from "../actions/cambiarEstadoSolicitud.action";
import { getOpcionesLista } from "../actions/getOpcionesLista.action";
import { listarTiposMisa } from '../actions/tipoMisa.action';
import { mapOpcionToSelect } from "../interfaces/opcionLista.interface";
import type { IDetalleSolicitud } from "../interfaces/detalleSolicitud.interface";
import type { ISelectOption } from "../interfaces/opcionLista.interface";
import type { ITipoMisa } from "../interfaces/tipoMisa.interface";
import ConfirmModal from "./ConfirmModal.vue";
import DetailModalTextSizeControl from "./DetailModalTextSizeControl.vue";
import { etiquetaPasoRegistro, requiereCampoIntencion } from "../../request/constants/tipoMisaRegistro";
import { resolveTipoMisaNombre } from "../utils/resolveTipoMisaNombre";

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

/** Escala solo el panel de este modal (CSS zoom); preferencia en localStorage. */
const detailTextZoom = ref(1.12);

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

// Estado para voucher
const voucherCargado = ref(false);
const voucherError = ref(false);

// Estado para modales de confirmación
const confirmEstado = ref<{
  visible: boolean;
  accion: 'aprobar' | 'denegar' | 'revision' | null;
  titulo: string;
  mensaje: string;
  tipo: 'success' | 'danger' | 'warning' | 'info';
  textoConfirmar: string;
}>({
  visible: false,
  accion: null,
  titulo: '',
  mensaje: '',
  tipo: 'warning',
  textoConfirmar: 'Confirmar',
});

const confirmGuardar = ref({ visible: false });
const confirmCancelar = ref({ visible: false });

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
  idestadoproceso: null as number | null,
  estado: true,
});

/* ================================
   COMPUTED
================================ */

const mensajeWhatsApp = computed(() => {
  if (!solicitud.value) return "";
  return `Hola ${solicitud.value.nombres}, te contacto respecto a tu solicitud de misa #${solicitud.value.idsolicitud}.`;
});

const nombreTipoDisplay = computed(() => {
  if (!solicitud.value) return "N/A";
  return resolveTipoMisaNombre(
    solicitud.value.idtipomisa,
    solicitud.value.tipomisa ?? null,
    tiposMisa.value,
  );
});

const muestraIntencion = computed(() => {
  if (!solicitud.value) return false;
  return requiereCampoIntencion(
    solicitud.value.idtipomisa,
    nombreTipoDisplay.value === "N/A" ? null : nombreTipoDisplay.value,
  );
});

const mostrarCampoIntencion = computed(() => {
  if (modoEdicion.value) {
    const nombre = tiposMisa.value.find(
      (t) => t.idtipomisa === formEdicion.value.idtipomisa,
    )?.nombre;
    return requiereCampoIntencion(formEdicion.value.idtipomisa, nombre);
  }
  return muestraIntencion.value;
});

const etiquetaLineasTitulo = computed(() => {
  if (!solicitud.value) return "Registros";
  return etiquetaPasoRegistro(
    solicitud.value.idtipomisa,
    nombreTipoDisplay.value === "N/A" ? null : nombreTipoDisplay.value,
  );
});

/* ================================
   VOUCHER HELPERS
================================ */

/**
 * Construye la URL pública correcta del voucher desde Supabase Storage.
 * Si la URL almacenada ya es una URL completa de Supabase, la usa directamente.
 * Si es solo el path relativo (ej: "vouchers/voucher_xxx.jpg"), construye la URL pública.
 */
const getVoucherUrl = (url: string): string => {
  if (!url) return "";

  // Si ya es una URL completa (http/https), usarla directamente
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Verificar si es una URL de Supabase con el formato incorrecto
    // El formato correcto para objetos públicos es:
    // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<file>
    // Si contiene /storage/v1/object/public/ ya está bien formada
    return url;
  }

  // Si es un path relativo, retornarlo tal cual (el componente mostrará error de carga)
  return url;
};

/**
 * Abre el voucher en una nueva pestaña.
 * Intenta la URL directa; si falla, no hay nada más que hacer del lado cliente.
 */
const abrirVoucher = (url: string) => {
  if (!url) return;
  window.open(getVoucherUrl(url), "_blank", "noopener,noreferrer");
};

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
    tiposMisa.value = await listarTiposMisa();
  } catch (error) {
    console.error('Error cargando tipos de misa:', error);
  }
};

const cargarTodasLasOpciones = async (solicitudData: IDetalleSolicitud) => {
  const idsUnicos = new Set<number>();
  if (solicitudData.idtipodocumento) idsUnicos.add(solicitudData.idtipodocumento);
  if (solicitudData.idhorario) idsUnicos.add(solicitudData.idhorario);
  if (solicitudData.idestadoproceso) idsUnicos.add(solicitudData.idestadoproceso);

  const idsArray = Array.from(idsUnicos);
  await Promise.all(idsArray.map(id => cargarOpcionesPorLista(id)));

  opcionesTipoDocumento.value = await cargarOpcionesPorLista(1);
  opcionesHorario.value = await cargarOpcionesPorLista(5);
  opcionesEstado.value = await cargarOpcionesPorLista(7);
};

const cargarDetalle = async () => {
  if (!props.solicitudId) return;

  loading.value = true;
  error.value = null;
  solicitud.value = null;
  voucherCargado.value = false;
  voucherError.value = false;

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
    idtipomisa: solicitud.value.idtipomisa ?? 0,
    idhorario: solicitud.value.idhorario ?? 0,
    fechamisadeseada: solicitud.value.fechamisadeseada,
    fechacelebracion: solicitud.value.fechacelebracion,
    fechasolicitud: solicitud.value.fechasolicitud,
    intencion: solicitud.value.intencion || "",
    montototal: solicitud.value.montototal ?? 0,
    voucherpago: solicitud.value.voucherpago,
    idestadoproceso: solicitud.value.idestadoproceso,
    estado: solicitud.value.estado,
  };

  modoEdicion.value = true;
};

// Solicitar confirmación antes de guardar
const solicitarGuardarCambios = () => {
  confirmGuardar.value.visible = true;
};

// Solicitar confirmación antes de cancelar edición
const solicitarCancelarEdicion = () => {
  confirmCancelar.value.visible = true;
};

// Ejecutar cancelación efectiva tras confirmar
const ejecutarCancelarEdicion = () => {
  confirmCancelar.value.visible = false;
  modoEdicion.value = false;
};

const guardarCambios = async () => {
  if (!solicitud.value) return;

  guardando.value = true;
  error.value = null;

  try {
    await actualizarSolicitud(solicitud.value.idsolicitud, formEdicion.value);
    await cargarDetalle();
    modoEdicion.value = false;
    confirmGuardar.value.visible = false;
    emit("updated");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error al guardar los cambios";

    if (errorMessage.includes('Solicitud actualizada, pero')) {
      confirmGuardar.value.visible = false;
      await cargarDetalle();
      emit("updated");
    } else {
      error.value = errorMessage;
      confirmGuardar.value.visible = false;
    }

    console.error("Error guardando cambios:", err);
  } finally {
    guardando.value = false;
  }
};

// Abrir modal de confirmación para cambio de estado
const solicitarCambioEstado = (accion: 'aprobar' | 'denegar' | 'revision') => {
  const config = {
    aprobar: {
      titulo: 'Aprobar Solicitud',
      mensaje: '¿Estás seguro de aprobar esta solicitud? Se creará automáticamente una misa y mención asociadas.',
      tipo: 'success' as const,
      textoConfirmar: 'Sí, aprobar',
    },
    denegar: {
      titulo: 'Denegar Solicitud',
      mensaje: '¿Estás seguro de denegar esta solicitud? Esta acción cambiará el estado a denegada.',
      tipo: 'danger' as const,
      textoConfirmar: 'Sí, denegar',
    },
    revision: {
      titulo: 'Poner en Revisión',
      mensaje: '¿Estás seguro de poner esta solicitud en revisión?',
      tipo: 'warning' as const,
      textoConfirmar: 'Sí, poner en revisión',
    },
  };

  const c = config[accion];
  confirmEstado.value = {
    visible: true,
    accion,
    titulo: c.titulo,
    mensaje: c.mensaje,
    tipo: c.tipo,
    textoConfirmar: c.textoConfirmar,
  };
};

const cancelarConfirmEstado = () => {
  confirmEstado.value.visible = false;
  confirmEstado.value.accion = null;
};

const ejecutarCambioEstado = async () => {
  if (!solicitud.value || !confirmEstado.value.accion) return;

  cambiandoEstado.value = true;
  try {
    await cambiarEstadoSolicitud(solicitud.value.idsolicitud, confirmEstado.value.accion);
    await cargarDetalle();
    confirmEstado.value.visible = false;
    confirmEstado.value.accion = null;
    emit("updated");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error al cambiar el estado";
    confirmEstado.value.visible = false;
    console.error("Error cambiando estado:", err);
  } finally {
    cambiandoEstado.value = false;
  }
};

const closeModal = () => {
  modoEdicion.value = false;
  emit("close");
};

const getNombreOpcion = (id: number | null | undefined): string => {
  if (id == null) return "N/A";
  const opcion = opcionesCache.value.get(id);
  return opcion?.nombre || "N/A";
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