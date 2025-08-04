'use client';

import { useState } from 'react';

export default function PostmanClonePage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/api/');
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const options: RequestInit = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (['POST', 'PUT'].includes(method)) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
      });

    } catch (error) {
      setResponse({
        error: true,
        message: "Kesalahan saat mengirim permintaan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 font-sans bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">API Request Sender</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2 mb-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>

        {['POST', 'PUT'].includes(method) && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Request Body (JSON)</h2>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-900 text-white"
            />
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Response</h2>
          <div className="p-4 border border-gray-200 rounded-md bg-white min-h-[100px]">
            {loading && <p className="text-gray-500">Loading...</p>}
            {response && (
              <div>
                <div className="mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Status: {response.status || 'ERROR'} {response.statusText || response.message}
                  </span>
                </div>
                <pre className="text-sm bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(response.data || { message: response.message }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}