/**
 * Contact Center — central configuration.
 *
 * Replace placeholder values with your real details.
 * The Telegram bot token is read from the VITE_TELEGRAM_BOT_TOKEN env var
 * so it never ships in the source code.
 */

export const CONTACT = {
    email: 'pravin.prajapati0126@gmail.com',

    telegram: {
        username: 'pravin_py',       // t.me/<username>
        chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID ?? '',
    },

    linkedin: 'https://linkedin.com/in/pravin-prajapati-706722281',
    twitter: 'https://x.com/_pravin_py',
    instagram: 'https://instagram.com/pravin.py',
    github: 'https://github.com/pravin-python',
    discord: 'https://discord.com/users/pravin_py',

    /** Read from env — never hard-code the token */
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN ?? '',
};

/** Contact method metadata used by the sidebar list */
export interface ContactMethod {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
    { id: 'email', icon: '/image/email.png', title: 'Email', description: 'Send a direct email' },
    { id: 'telegram', icon: '/image/telegram.png', title: 'Telegram Chat', description: 'Open a direct chat' },
    { id: 'bot', icon: '/image/telegram-bot.png', title: 'Telegram Bot', description: 'Send a message via bot' },
    { id: 'social', icon: '🔗', title: 'Social Links', description: 'LinkedIn · GitHub · Discord' },
    { id: 'qr', icon: '/image/qr-code.png', title: 'QR Codes', description: 'Scan to connect instantly' },
];
