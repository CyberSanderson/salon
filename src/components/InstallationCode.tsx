'use client'

import { useState } from 'react'

export default function InstallationCode({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false)

  // Construct the script tag with the user's unique ID
  const codeSnippet = `<script src="https://www.ariahdesk.com/widget.js" data-bot-id="${userId}" async defer></script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset the "Copied!" message after 2 seconds
  }

  return (
    <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Install Your Chatbot</h2>
      <p className="mt-2 text-gray-600">
        To add the chat widget to your website, copy the code below and paste it right before the closing <strong>&lt;/body&gt;</strong> tag on every page you want it to appear.
      </p>
      <div className="mt-4 p-4 bg-gray-900 rounded-md text-white font-mono text-sm relative">
        <code>{codeSnippet}</code>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}