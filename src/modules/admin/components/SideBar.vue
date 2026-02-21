<template>
  <!-- Mobile Overlay -->
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMobileOpen"
      @click="toggleMobileSidebar"
      class="fixed inset-0 bg-black/50 z-[99998] lg:hidden"
    />
  </transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out z-[99999] flex flex-col',
      {
        // Desktop
        'lg:w-[290px]': isExpanded,
        'lg:w-[90px]': !isExpanded,
        // Mobile
        'w-[290px]': true,
        'translate-x-0': isMobileOpen,
        '-translate-x-full lg:translate-x-0': !isMobileOpen,
      },
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Header with Logo & Close Button (Mobile) -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
      <router-link 
        to="/" 
        class="flex items-center gap-3 overflow-hidden"
        @click="isMobileOpen && toggleMobileSidebar()"
      >
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-lg">C</span>
        </div>
        <transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <span
            v-if="shouldShowText"
            class="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
          >
            Catedral San Pedro
          </span>
        </transition>
      </router-link>

      <!-- Close button (Mobile only) -->
      <button
        @click="toggleMobileSidebar"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <nav class="space-y-6">
        <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
          <!-- Group Title -->
          <div class="mb-3">
            <h2
              :class="[
                'text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 transition-all duration-200',
                shouldShowText ? 'text-left' : 'lg:text-center',
              ]"
            >
              <template v-if="shouldShowText">
                {{ menuGroup.title }}
              </template>
              <span v-else class="flex justify-center">•••</span>
            </h2>
          </div>

          <!-- Menu Items -->
          <ul class="space-y-1">
            <li v-for="(item, index) in menuGroup.items" :key="item.name">
              <!-- Button with submenu -->
              <button
                v-if="item.subItems"
                @click="toggleSubmenuLocal(groupIndex, index)"
                :class="[
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  {
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': isSubmenuOpen(groupIndex, index),
                    'text-gray-700 dark:text-gray-300': !isSubmenuOpen(groupIndex, index),
                  },
                  shouldShowText ? 'lg:justify-start' : 'lg:justify-center',
                ]"
              >
                <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <component :is="item.icon" class="w-5 h-5" />
                </span>
                <span
                  v-if="shouldShowText"
                  class="font-medium text-sm flex-1 text-left"
                >
                  {{ item.name }}
                </span>
                <ChevronDown
                  v-if="shouldShowText"
                  :class="[
                    'w-4 h-4 transition-transform duration-200 flex-shrink-0',
                    { 'rotate-180': isSubmenuOpen(groupIndex, index) },
                  ]"
                />
              </button>

              <!-- Link without submenu -->
              <router-link
                v-else-if="item.path"
                :to="item.path"
                @click="isMobileOpen && toggleMobileSidebar()"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  {
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm': isActive(item.path),
                    'text-gray-700 dark:text-gray-300': !isActive(item.path),
                  },
                  shouldShowText ? 'lg:justify-start' : 'lg:justify-center',
                ]"
              >
                <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <component :is="item.icon" class="w-5 h-5" />
                </span>
                <span
                  v-if="shouldShowText"
                  class="font-medium text-sm"
                >
                  {{ item.name }}
                </span>
              </router-link>

              <!-- Submenu -->
              <transition
                @enter="startTransition"
                @after-enter="endTransition"
                @before-leave="startTransition"
                @after-leave="endTransition"
              >
                <div
                  v-show="isSubmenuOpen(groupIndex, index) && shouldShowText"
                  class="overflow-hidden"
                >
                  <ul class="mt-1 space-y-1 ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    <li v-for="subItem in item.subItems" :key="subItem.name">
                      <router-link
                        :to="subItem.path"
                        @click="isMobileOpen && toggleMobileSidebar()"
                        :class="[
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                          'hover:bg-gray-100 dark:hover:bg-gray-800',
                          {
                            'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium': isActive(subItem.path),
                            'text-gray-600 dark:text-gray-400': !isActive(subItem.path),
                          },
                        ]"
                      >
                        <span class="flex-1">{{ subItem.name }}</span>
                        <span class="flex items-center gap-1">
                          <span
                            v-if="subItem.new"
                            class="px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
                          >
                            new
                          </span>
                          <span
                            v-if="subItem.pro"
                            class="px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded"
                          >
                            pro
                          </span>
                        </span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </transition>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <div 
      v-if="shouldShowText"
      class="px-5 py-4 border-t border-gray-200 dark:border-gray-800"
    >
      <!-- <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ userName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
        </div>
      </div> -->
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSidebar } from "@/composables/useSidebar";
import { 
  LayoutDashboard, 
  FileText, 
  Church,
  Box,
  ChevronDown,
  X,
  Newspaper
} from "lucide-vue-next";

interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

interface MenuItem {
  icon: any;
  name: string;
  path?: string;
  subItems?: SubItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface User {
  nombre: string;
  correo: string;
}

const route = useRoute();

const {
  isExpanded,
  isMobileOpen,
  isHovered,
  setIsHovered,
  toggleMobileSidebar,
} = useSidebar();

const openSubmenuLocal = ref<string | null>(null);
const user = ref<User | null>(null);

// Computed para determinar cuándo mostrar el texto
const shouldShowText = computed(() => {
  return isExpanded.value || isMobileOpen.value || isHovered.value;
});

// Computed para obtener las iniciales del usuario
// const userInitials = computed(() => {
//   if (!user.value?.nombre) return 'U';
//   const names = user.value.nombre.split(' ');
//   if (names.length >= 2) {
//     return (names[0][0] + names[1][0]).toUpperCase();
//   }
//   return names[0][0].toUpperCase();
// });

// Computed para el nombre del usuario
const userName = computed(() => {
  return user.value?.nombre || 'Usuario';
});

// Computed para el correo del usuario
const userEmail = computed(() => {
  return user.value?.correo || 'usuario@ejemplo.com';
});

const menuGroups = ref<MenuGroup[]>([
  {
    title: "Principal",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Solicitudes",
        path: "/solicitudes",
        icon: FileText,
      },
    ]
  },
  {
    title: "Gestión",
    items: [
      {
        name: "Misas",
        path: "/misas",
        icon: Church
      },
      {
        name: "Tipos de Misa",
        path: "/tipos-misa",
        icon: Box
      },
      {
        name: "Noticias",
        path: "/noticias",
        icon: Newspaper // Importa: import { Newspaper } from "lucide-vue-next";
      },
    ]
  }
]);

const isActive = (path: string): boolean => route.path === path;

const toggleSubmenuLocal = (groupIndex: number, itemIndex: number): void => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenuLocal.value = openSubmenuLocal.value === key ? null : key;
};

const handleMouseEnter = () => {
  if (!isExpanded.value && !isMobileOpen.value) {
    setIsHovered(true);
  }
};

const handleMouseLeave = () => {
  setIsHovered(false);
};

const isAnySubmenuRouteActive = computed((): boolean => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenuLocal.value === key ||
    (isAnySubmenuRouteActive.value &&
      (menuGroups.value[groupIndex]?.items?.[itemIndex]?.subItems?.some(
        (subItem) => isActive(subItem.path)
      ) ??
        false))
  );
};

const startTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "0px";
  htmlEl.style.overflow = "hidden";
  requestAnimationFrame(() => {
    htmlEl.style.height = htmlEl.scrollHeight + "px";
  });
};

const endTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "";
  htmlEl.style.overflow = "";
};

// Cargar usuario desde localStorage
const loadUser = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
/* Scrollbar personalizado */
:deep(.scrollbar-thin)::-webkit-scrollbar {
  width: 6px;
}

:deep(.scrollbar-thin)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.scrollbar-thin)::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

:deep(.dark .scrollbar-thin)::-webkit-scrollbar-thumb {
  background: #4a5568;
}

:deep(.scrollbar-thin)::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

:deep(.dark .scrollbar-thin)::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>