import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CONTACT } from './contact.data';

interface SocialCard {
    id: string;
    icon: string;
    label: string;
    username: string;
    description: string;
    url: string;
}

const SOCIALS: SocialCard[] = [
    {
        id: 'telegram',
        icon: '/image/telegram-1.jpg',
        label: 'Telegram',
        username: `@${CONTACT.telegram.username}`,
        description: 'Direct chat — usually replies within 24 hours',
        url: `https://t.me/${CONTACT.telegram.username}`,
    },
    {
        id: 'linkedin',
        icon: '/image/linkedin.png',
        label: 'LinkedIn',
        username: 'Pravin Prajapati',
        description: 'Professional network & recommendations',
        url: CONTACT.linkedin,
    },
    {
        id: 'twitter',
        icon: '/image/x.jpg',
        label: 'X (Twitter)',
        username: '@_pravin_py',
        description: 'Follow for AI/ML updates & experiments',
        url: CONTACT.twitter,
    },
    {
        id: 'instagram',
        icon: '/image/instagram.png',
        label: 'Instagram',
        username: '@pravin.py',
        description: 'Behind-the-scenes of projects',
        url: CONTACT.instagram,
    },
    {
        id: 'github',
        icon: '/image/github.png',
        label: 'GitHub',
        username: 'pravin-python',
        description: 'Open source projects & contributions',
        url: CONTACT.github,
    },
    {
        id: 'discord',
        icon: '/image/discord.png',
        label: 'Discord',
        username: 'pravin_py',
        description: 'Join the community or direct message',
        url: CONTACT.discord,
    }
];

export const SocialLinksPanel: React.FC = () => {
    return (
        <div className="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
            <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Social Profiles</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connect on any platform</p>
            </div>

            <div className="space-y-3">
                {SOCIALS.map(s => (
                    <button
                        key={s.id}
                        onClick={() => window.open(s.url, '_blank', 'noopener')}
                        className="w-full flex items-center space-x-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md hover:scale-[1.01] transition-all group text-left"
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden bg-slate-100 dark:bg-slate-700">
                            <img src={s.icon} alt={s.label} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{s.label}</span>
                                <span className="text-xs text-slate-400 font-mono truncate">{s.username}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
};
