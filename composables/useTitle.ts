import { useHead } from '#imports'

export const useSiteConfig = () => {
  const { $apiFetch } = useNuxtApp()

  const updateConfig = async () => {
    try {
      const response = await $apiFetch('/api/setting/get-landing-page')
      const { title, logo_url, companyName } = response?.data || {}
      
      useHead({
        title: companyName ? `Studio Raya 2025 - ${companyName}` : 'Studio Raya 2025',
        link: [
          {
            rel: 'icon',
            type: 'image/png',
            href: logo_url
          }
        ]
      })
    } catch (error) {
      console.error('Error fetching site config:', error)
    }
  }

  return {
    updateConfig
  }
} 