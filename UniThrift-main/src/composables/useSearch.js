import { ref } from 'vue'

// Shared search state across all pages
export const searchQuery = ref('')

export const useSearch = () => {
  return { searchQuery }
}
