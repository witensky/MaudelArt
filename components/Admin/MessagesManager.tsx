import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Mail, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const MessagesManager = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setMessages(data);
        setLoading(false);
    };

    const markAsRead = async (id: string, current: boolean) => {
        await supabase.from('messages').update({ is_read: !current }).eq('id', id);
        fetchMessages();
    };

    const deleteMessage = async (id: string) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        await supabase.from('messages').delete().eq('id', id);
        fetchMessages();
    };

    if (loading) return <div className="p-10 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-serif text-emerald-950">Boîte de Réception</h2>

            <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                        Aucun message reçu.
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`bg-white p-6 rounded-xl border transition-all ${msg.is_read ? 'border-gray-100 opacity-75' : 'border-emerald-500/30 shadow-sm'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-950 text-sm">{msg.name}</h4>
                                    <p className="text-xs text-gray-500">{msg.email}</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: fr })}
                            </span>
                        </div>

                        <div className="pl-13 ml-13">
                            <h5 className="font-bold text-sm mb-2 text-gray-800">{msg.subject}</h5>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                {msg.message}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                            <button
                                onClick={() => markAsRead(msg.id, msg.is_read)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${msg.is_read ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                            >
                                {msg.is_read ? <EyeOff size={14} /> : <Eye size={14} />}
                                {msg.is_read ? 'Marquer non lu' : 'Marquer lu'}
                            </button>
                            <button
                                onClick={() => deleteMessage(msg.id)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={14} />
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
