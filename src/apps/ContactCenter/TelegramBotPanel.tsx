import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { CONTACT } from './contact.data';

const MAX_MSG_LENGTH = 500;
const RATE_LIMIT_MS = 5000;

export const TelegramBotPanel: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const cooldownRef = useRef(false);

    const isValid = name.trim().length > 0 && message.trim().length > 0 && message.length <= MAX_MSG_LENGTH;

    const handleSend = async () => {
        if (!isValid || cooldownRef.current) return;

        if (!CONTACT.botToken || !CONTACT.telegram.chatId) {
            setStatus('error');
            setErrorMsg('Bot is not configured. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID.');
            return;
        }

        // Rate limit
        cooldownRef.current = true;
        setTimeout(() => { cooldownRef.current = false; }, RATE_LIMIT_MS);

        setStatus('sending');
        setErrorMsg('');

        const text = [
            '📨 *New Message from WebOS Portfolio*',
            '',
            `*Name:* ${name.trim()}`,
            email.trim() ? `*Email:* ${email.trim()}` : '',
            '',
            '*Message:*',
            message.trim(),
        ].filter(Boolean).join('\n');

        try {
            const res = await fetch(`https://api.telegram.org/bot${CONTACT.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CONTACT.telegram.chatId,
                    text,
                    parse_mode: 'Markdown',
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.description || `Telegram API error (${res.status})`);
            }

            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
            setTimeout(() => setStatus('idle'), 4000);
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Network error — please try again.');
        }
    };

    return (
        <div className="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-400/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Send via Telegram Bot</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Message delivered directly to my Telegram</p>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-3 flex-1">
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Email <span className="text-slate-400">(optional)</span></label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Message * <span className="text-slate-400 float-right">{message.length}/{MAX_MSG_LENGTH}</span>
                    </label>
                    <textarea
                        value={message}
                        onChange={e => { if (e.target.value.length <= MAX_MSG_LENGTH) setMessage(e.target.value); }}
                        placeholder="Type your message..."
                        rows={4}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />
                </div>
            </div>

            {/* Status */}
            {status === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Message Delivered ✓</span>
                </div>
            )}
            {status === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Send button */}
            <button
                onClick={handleSend}
                disabled={!isValid || status === 'sending' || cooldownRef.current}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center shadow-sm ${!isValid || status === 'sending'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
                    }`}
            >
                <Send className="w-4 h-4 mr-2" />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
        </div>
    );
};
