import dynamic from 'next/dynamic'
const PhotographerPromptStudio = dynamic(() => import('@/components/PhotographerPromptStudio'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Photographer Prompt Studio</h1>
        <PhotographerPromptStudio />
      </div>
    </main>
  )
}
