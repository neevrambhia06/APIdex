'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    category_suggestion: '',
    base_url: '',
    auth_type: 'API Key',
    pricing_tier: 'Free',
    description: '',
    docs_url: '',
    use_cases: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to submit an API');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/submit-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          use_cases: formData.use_cases.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to submit API');
      }
    } catch (error) {
      console.error('Error submitting API:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-display">Submit Your API</h1>
        <p className="text-gray-400 mb-8">
          Help us grow the directory by submitting your API. Our team will review and add it within 48 hours.
        </p>

        {!user ? (
          <div className="p-6 bg-[#0c0c0f] border border-white/10 rounded-lg text-center">
            <p className="mb-4">Please sign in to submit an API</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">API Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  placeholder="e.g., OpenAI API"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  placeholder="e.g., OpenAI"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                name="category_suggestion"
                value={formData.category_suggestion}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="e.g., AI, Weather, Maps"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Base URL</label>
              <input
                type="url"
                name="base_url"
                value={formData.base_url}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="https://api.example.com/v1"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Auth Type</label>
                <select
                  name="auth_type"
                  value={formData.auth_type}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="None">No Authentication</option>
                  <option value="API Key">API Key</option>
                  <option value="OAuth2">OAuth2</option>
                  <option value="SDK">SDK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pricing Tier</label>
                <select
                  name="pricing_tier"
                  value={formData.pricing_tier}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="Brief description of your API (max 500 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Documentation URL</label>
              <input
                type="url"
                name="docs_url"
                value={formData.docs_url}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="https://docs.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Use Cases</label>
              <input
                type="text"
                name="use_cases"
                value={formData.use_cases}
                onChange={handleChange}
                className="w-full p-3 bg-[#0c0c0f] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="Comma-separated list (e.g., Chatbots, Content Generation, AI)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit API'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
