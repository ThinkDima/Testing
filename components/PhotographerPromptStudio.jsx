import React, { useState, useRef } from 'react'

export default function PhotographerPromptStudio() {
  const [title, setTitle] = useState('Untitled Shoot')
  const [models, setModels] = useState([
    { id: 1, role: 'Model 1', description: '', age: '', skinTone: '', mood: '', look: '', gender: '' },
  ])
  const [styling, setStyling] = useState({ clothing: '', accessories: '', direction: '' })
  const [creative, setCreative] = useState({ concept: '', visualTone: '' })
  const [setDesign, setSetDesign] = useState({ backdrop: '', props: '', texture: '' })
  const [lighting, setLighting] = useState({ type: 'Studio (soft)', timeOfDay: 'Golden hour', modifiers: '' })
  const [location, setLocation] = useState({ type: 'Studio', description: '' })
  const [assistant, setAssistant] = useState({ equipment: '', notes: '' })
  const [photographer, setPhotographer] = useState({ angles: '', direction: '', lens: '85mm' })
  const [notes, setNotes] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [promptOutput, setPromptOutput] = useState('')
  const fileInputRef = useRef(null)

  function addModel() {
    setModels(prev => [
      ...prev,
      { id: prev.length + 1, role: `Model ${prev.length + 1}`, description: '', age: '', skinTone: '', mood: '', look: '', gender: '' },
    ])
  }
  function removeModel(id) {
    setModels(prev => prev.filter(m => m.id !== id))
  }
  function updateModel(id, key, value) {
    setModels(prev => prev.map(m => (m.id === id ? { ...m, [key]: value } : m)))
  }

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setUploadedImage({ file, url, name: file.name })
  }

  function buildPrompt() {
    const personaBlocks = []
    const modelBlocks = models.map(m => {
      return `- ${m.role}: ${m.description || 'Detailed physical description (face, hair, body), wardrobe fit, ethnicity/skin tone: ' + (m.skinTone || 'unspecified')}. Age: ${m.age || 'unspecified'}. Mood/look: ${m.mood || 'unspecified'}. Gender: ${m.gender || 'unspecified'}.`
    })
    personaBlocks.push(`Models:\n${modelBlocks.join('\n')}`)
    personaBlocks.push(`Fashion Editor / Stylist:\nClothing: ${styling.clothing || 'unspecified'}. Accessories: ${styling.accessories || 'none'}. Direction: ${styling.direction || 'specify mood & era'}.`)
    personaBlocks.push(`Creative Director:\nConcept: ${creative.concept || 'high-concept description'}. Visual tone: ${creative.visualTone || 'color palette, grain, contrast, cinematic vs documentary'}.`)
    personaBlocks.push(`Set Designer:\nBackdrop/Environment: ${setDesign.backdrop || 'studio or location specifics'}. Props: ${setDesign.props || 'list props'}. Textures & surfaces: ${setDesign.texture || 'describe textures'}.`)
    personaBlocks.push(`Lighting Engineer / Gaffer:\nLighting type: ${lighting.type}. Time of day (if natural): ${lighting.timeOfDay}. Modifiers: ${lighting.modifiers || 'softbox/reflectors/gels'}.`)
    personaBlocks.push(`Location Scout:\nLocation type: ${location.type}. Description/landmarks: ${location.description || 'describe environment and access'}.`)
    personaBlocks.push(`Assistant Photographer / First Assistant:\nEquipment notes: ${assistant.equipment || 'camera bodies, backups, tethers'}. Technical notes: ${assistant.notes || 'battery, cards, gaffer tape'}.`)
    personaBlocks.push(`Photographer:\nAngles & framing: ${photographer.angles || 'wide/medium/tight; low/high'}. Direction to model: ${photographer.direction || 'expressive, candid, posed'}. Lens & settings: ${photographer.lens || 'specify lens'}.`)
    personaBlocks.push(`Extra Notes:\n${notes || 'Any additional artistic or technical constraints.'}`)

    const referenceSection = uploadedImage
      ? `Reference image: use the uploaded image as the visual exemplar. File name: ${uploadedImage.name}. Use it to match pose/texture/color/lighting cues where appropriate.`
      : 'No reference image uploaded.'

    const personaSectionText = personaBlocks.join('\n\n')

    const finalNL = []
    finalNL.push(`${title} — Photorealistic image generation for Google Imagen 4 Ultra.`)
    finalNL.push(referenceSection + '')

    const sceneParts = []
    const aggregatedModels = models
      .map(m => {
        const parts = []
        if (m.description) parts.push(m.description)
        if (m.age) parts.push(`age ${m.age}`)
        if (m.skinTone) parts.push(m.skinTone)
        if (m.mood) parts.push(m.mood)
        if (m.look) parts.push(m.look)
        return parts.join(', ')
      })
      .filter(Boolean)
      .join('; ')

    if (aggregatedModels) sceneParts.push(`Subjects: ${aggregatedModels}.`)
    if (styling.clothing) sceneParts.push(`Styling: ${styling.clothing}; accessories: ${styling.accessories || 'none'}.`)
    if (creative.concept) sceneParts.push(`Concept: ${creative.concept}; visual tone: ${creative.visualTone || 'see persona section'}.`)
    if (setDesign.backdrop) sceneParts.push(`Environment: ${setDesign.backdrop}; props: ${setDesign.props || 'none'}.`)
    sceneParts.push(`Lighting: ${lighting.type} (${lighting.timeOfDay}); modifiers: ${lighting.modifiers || 'as needed'}.`)
    if (location.type) sceneParts.push(`Location: ${location.type} — ${location.description || 'unspecified'}.`)
    if (photographer.angles) sceneParts.push(`Camera: ${photographer.lens} lens; framing: ${photographer.angles}.`)
    if (notes) sceneParts.push(`Notes: ${notes}`)

    finalNL.push(sceneParts.join(' '))
    finalNL.push('Generation instructions: photorealistic, ultra-detailed, 8k-level detail, accurate skin tones, realistic fabric textures, natural bokeh where applicable, coherent perspective, avoid extra limbs or artifacts. Use cinematic color grading if requested in visual tone.')

    const finalPrompt = `/* PERSONA SECTIONS */\n\n${personaSectionText}\n\n/* CONSOLIDATED PROMPT (for Imagen 4 Ultra) */\n\n${finalNL.join('\n\n')}`
    setPromptOutput(finalPrompt)
  }

  function copyToClipboard() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promptOutput)
    }
  }

  function downloadJSON() {
    const payload = {
      title,
      personas: {
        models,
        styling,
        creative,
        setDesign,
        lighting,
        location,
        assistant,
        photographer,
        notes,
      },
      reference: uploadedImage ? { name: uploadedImage.name } : null,
      prompt: promptOutput,
      target: 'Google Imagen 4 Ultra',
      format: 'text/prompt+personas',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_') || 'prompt'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Photographer Prompt Studio</h1>
          <div className="flex items-center gap-3">
            <input
              className="border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Shoot title"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded shadow hover:opacity-90"
              onClick={() => {
                buildPrompt()
              }}
            >
              Generate Prompt
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-7 bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Personas & Inputs</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Reference image</label>
                <div className="mt-2 flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} />
                  {uploadedImage && (
                    <div className="flex items-center gap-3">
                      <img src={uploadedImage.url} alt="uploaded" className="w-20 h-20 object-cover rounded shadow-sm" />
                      <div>
                        <div className="text-sm">{uploadedImage.name}</div>
                        <button className="text-xs text-gray-500" onClick={() => setUploadedImage(null)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Models</h3>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600" onClick={addModel}>
                      + Add model
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {models.map((m) => (
                    <div key={m.id} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-2">
                        <div className="text-sm font-medium">{m.role}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {m.id}</div>
                      </div>
                      <div className="col-span-8 grid grid-cols-2 gap-2">
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Short physical description (hair, face, build)"
                          value={m.description}
                          onChange={(e) => updateModel(m.id, 'description', e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Age (e.g. 28)"
                          value={m.age}
                          onChange={(e) => updateModel(m.id, 'age', e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Skin tone / ethnicity"
                          value={m.skinTone}
                          onChange={(e) => updateModel(m.id, 'skinTone', e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Mood / expression"
                          value={m.mood}
                          onChange={(e) => updateModel(m.id, 'mood', e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Look (e.g. edgy, polished)"
                          value={m.look}
                          onChange={(e) => updateModel(m.id, 'look', e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Gender"
                          value={m.gender}
                          onChange={(e) => updateModel(m.id, 'gender', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 flex flex-col items-end gap-2">
                        <button className="text-red-500 text-sm" onClick={() => removeModel(m.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Fashion Editor / Stylist</h4>
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Clothing overview" value={styling.clothing} onChange={(e) => setStyling({ ...styling, clothing: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Accessories" value={styling.accessories} onChange={(e) => setStyling({ ...styling, accessories: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1" placeholder="Styling direction" value={styling.direction} onChange={(e) => setStyling({ ...styling, direction: e.target.value })} />
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Creative Director</h4>
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Concept / story" value={creative.concept} onChange={(e) => setCreative({ ...creative, concept: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1" placeholder="Visual tone (colors, mood)" value={creative.visualTone} onChange={(e) => setCreative({ ...creative, visualTone: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Set Designer</h4>
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Backdrop / environment" value={setDesign.backdrop} onChange={(e) => setSetDesign({ ...setDesign, backdrop: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Props" value={setDesign.props} onChange={(e) => setSetDesign({ ...setDesign, props: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1" placeholder="Textures / surfaces" value={setDesign.texture} onChange={(e) => setSetDesign({ ...setDesign, texture: e.target.value })} />
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Lighting Engineer / Gaffer</h4>
                  <select className="w-full border rounded px-2 py-1 mb-2" value={lighting.type} onChange={(e) => setLighting({ ...lighting, type: e.target.value })}>
                    <option>Studio (soft)</option>
                    <option>Studio (hard)</option>
                    <option>Natural (sunlight)</option>
                    <option>Mixed</option>
                    <option>High-key</option>
                    <option>Low-key</option>
                  </select>
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Time of day" value={lighting.timeOfDay} onChange={(e) => setLighting({ ...lighting, timeOfDay: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1" placeholder="Modifiers (gels, softboxes)" value={lighting.modifiers} onChange={(e) => setLighting({ ...lighting, modifiers: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Location Scout</h4>
                  <select className="w-full border rounded px-2 py-1 mb-2" value={location.type} onChange={(e) => setLocation({ ...location, type: e.target.value })}>
                    <option>Studio</option>
                    <option>Urban</option>
                    <option>Natural / Outdoors</option>
                    <option>Indoor / Architectural</option>
                    <option>Rented space</option>
                  </select>
                  <input className="w-full border rounded px-2 py-1" placeholder="Location description" value={location.description} onChange={(e) => setLocation({ ...location, description: e.target.value })} />
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-medium mb-2">Assistant Photographer / First Assistant</h4>
                  <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Equipment notes" value={assistant.equipment} onChange={(e) => setAssistant({ ...assistant, equipment: e.target.value })} />
                  <input className="w-full border rounded px-2 py-1" placeholder="Technical notes" value={assistant.notes} onChange={(e) => setAssistant({ ...assistant, notes: e.target.value })} />
                </div>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Photographer</h4>
                <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Angles & framing" value={photographer.angles} onChange={(e) => setPhotographer({ ...photographer, angles: e.target.value })} />
                <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Direction to model" value={photographer.direction} onChange={(e) => setPhotographer({ ...photographer, direction: e.target.value })} />
                <input className="w-full border rounded px-2 py-1" placeholder="Lens (e.g. 35mm, 50mm, 85mm)" value={photographer.lens} onChange={(e) => setPhotographer({ ...photographer, lens: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium">Additional notes</label>
                <textarea className="w-full border rounded px-2 py-2 mt-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else the personas should know..." />
              </div>
            </div>
          </section>

          <aside className="col-span-5">
            <div className="bg-white rounded-2xl p-4 shadow mb-4">
              <h3 className="font-medium">Preview & Output</h3>
              <p className="text-sm text-gray-500 mt-2">Click "Generate Prompt" to build a structured persona prompt and a consolidated prompt optimized for Google Imagen 4 Ultra.</p>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded" onClick={() => { buildPrompt(); }}>
                  Generate
                </button>
                <button className="flex-1 bg-white border px-4 py-2 rounded" onClick={() => { setPromptOutput(''); }}>
                  Clear
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">Preview prompt</label>
                <textarea readOnly value={promptOutput} rows={12} className="w-full bg-gray-50 border rounded p-2 text-sm" />

                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={copyToClipboard}>Copy</button>
                  <button className="px-3 py-2 bg-gray-800 text-white rounded" onClick={downloadJSON}>Download JSON</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <h4 className="font-medium">Quick Presets</h4>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="border rounded px-3 py-2 text-sm text-left" onClick={() => { setStyling({ clothing: 'High fashion couture — monochrome', accessories: 'minimal metallic jewelry', direction: 'Avant-garde, editorial' }); setCreative({ concept: 'Lonely city-dweller', visualTone: 'muted palette, filmic grain' }); }}>
                  Editorial Couture
                </button>
                <button className="border rounded px-3 py-2 text-sm text-left" onClick={() => { setStyling({ clothing: 'Casual streetwear', accessories: 'caps, sneakers', direction: 'Urban, energetic' }); setCreative({ concept: 'Youthful street portrait', visualTone: 'vibrant colors, high contrast' }); }}>
                  Street Style
                </button>
                <button className="border rounded px-3 py-2 text-sm text-left" onClick={() => { setStyling({ clothing: '70s inspired retro', accessories: 'oversized sunglasses', direction: 'Nostalgic, warm' }); setCreative({ concept: 'Retro summer day', visualTone: 'warm tones, slight film fade' }); }}>
                  Retro
                </button>
                <button className="border rounded px-3 py-2 text-sm text-left" onClick={() => { setLighting({ type: 'Natural (sunlight)', timeOfDay: 'Golden hour', modifiers: 'reflector' }); }}>
                  Golden Hour
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">Target: Google Imagen 4 Ultra • Output: persona sections + consolidated prompt • Export: JSON or copy to clipboard.</div>
          </aside>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">Created with ❤️ for photographers — adapt for any image generation backend by adjusting the final instruction block.</footer>
      </div>
    </div>
  )
}
