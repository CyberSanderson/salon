'use client'

import { useState } from 'react'

export default function InstallationCode({ userId }: { userId: string }) {
  const [scriptCopied, setScriptCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // The script tag for website embedding
  const codeSnippet = `<script src="https://www.ariahdesk.com/widget.js" data-bot-id="${userId}" async defer></script>`

  // The shareable booking link for social media
  const bookingLink = `https://www.ariahdesk.com/book/${userId}`

  const handleCopyScript = () => {
    navigator.clipboard.writeText(codeSnippet)
    setScriptCopied(true)
    setTimeout(() => setScriptCopied(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Install Your Chatbot on Your Website</h2>
        <p className="mt-2 text-gray-600">
          To add the chat widget to your website, copy the code below and paste it right before the closing <strong>&lt;/body&gt;</strong> tag.
        </p>
        <div className="mt-4 p-4 bg-gray-900 rounded-md text-white font-mono text-sm relative">
          <code>{codeSnippet}</code>
          <button
            onClick={handleCopyScript}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md"
          >
            {scriptCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Your Personal Booking Link</h2>
        <p className="mt-2 text-gray-600">
          For your Instagram bio, Facebook page, or anywhere else, use this direct link to your AI booking page.
        </p>
        <div className="mt-4 p-4 bg-gray-900 rounded-md text-white font-mono text-sm relative">
          <code>{bookingLink}</code>
          <button
            onClick={handleCopyLink}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-md"
          >
            {linkCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}