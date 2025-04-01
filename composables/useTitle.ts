import { useHead } from '#imports'

export const useSiteConfig = () => {
  const { $apiFetch } = useNuxtApp()

  const updateConfig = async () => {
    try {
      const response = await $apiFetch('/api/setting/get-landing-page')
      const { title, logo_url } = response?.data || {}
      
      useHead({
        title,
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