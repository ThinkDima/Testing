import { useState } from 'react';

export default function PhotographerPromptStudio() {
  const [models, setModels] = useState(1);
  const [formData, setFormData] = useState({
    modelDetails: '',
    stylist: '',
    creativeDirector: '',
    setDesigner: '',
    lighting: '',
    location: '',
    assistant: '',
    photographer: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePrompt = () => {
    return `
Models: ${models} person(s) - ${formData.modelDetails}
Stylist: ${formData.stylist}
Creative Director: ${formData.creativeDirector}
Set Designer: ${formData.setDesigner}
Lighting: ${formData.lighting}
Location: ${formData.location}
Assistant: ${formData.assistant}
Photographer: ${formData.photographer}
    `.trim();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Photographer Prompt Studio</h1>

      <label className="block mb-2 font-semibold">Number of Models</label>
      <input type="number" min="1" value={models} onChange={(e) => setModels(e.target.value)} className="border p-2 mb-4 w-full rounded" />

      <label className="block mb-2 font-semibold">Model Details</label>
      <textarea name="modelDetails" value={formData.modelDetails} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Mood, look, skin color, age, etc." />

      <label className="block mb-2 font-semibold">Fashion Editor / Stylist</label>
      <textarea name="stylist" value={formData.stylist} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Clothing, accessories, styling direction" />

      <label className="block mb-2 font-semibold">Creative Director</label>
      <textarea name="creativeDirector" value={formData.creativeDirector} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Overall concept, visual tone" />

      <label className="block mb-2 font-semibold">Set Designer</label>
      <textarea name="setDesigner" value={formData.setDesigner} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Backdrop or environment" />

      <label className="block mb-2 font-semibold">Lighting Engineer / Gaffer</label>
      <textarea name="lighting" value={formData.lighting} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Lighting setup or time of day" />

      <label className="block mb-2 font-semibold">Location Scout</label>
      <textarea name="location" value={formData.location} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Location details" />

      <label className="block mb-2 font-semibold">Assistant Photographer</label>
      <textarea name="assistant" value={formData.assistant} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Equipment and technical setup" />

      <label className="block mb-2 font-semibold">Photographer</label>
      <textarea name="photographer" value={formData.photographer} onChange={handleChange} className="border p-2 mb-4 w-full rounded" placeholder="Angles, direction of models" />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Generated Prompt:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generatePrompt()}</pre>
      </div>
    </div>
  );
}
