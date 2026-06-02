import { ReactNode } from 'react';

interface InputProps {
  label: string;
  children: ReactNode;
}

export function Campo({ label, children }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = `w-full bg-white border border-gray-300 rounded px-4 py-4 text-gray-800 text-base
  shadow-[3px_3px_0_rgba(0,0,0,0.12)] outline-none focus:border-[#1a237e] transition-all`;

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputCls + ' appearance-none bg-white'}>
      {props.children}
    </select>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={4} className={inputCls + ' resize-none'} />;
}

export function BotaoSalvar({ loading, label = 'SALVAR' }: { loading?: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#FFD700] text-gray-900 text-lg font-bold tracking-widest uppercase
                 py-5 rounded-lg mt-4 shadow-[4px_4px_0_rgba(0,0,0,0.22)]
                 active:shadow-none active:translate-x-1 active:translate-y-1
                 transition-all duration-75 disabled:opacity-60"
    >
      {loading ? 'SALVANDO...' : label}
    </button>
  );
}

export function MensagemSucesso({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl text-center max-w-sm w-full">
        <div className="text-5xl mb-4">✅</div>
        <p className="font-bold text-gray-800 text-lg mb-4">{msg}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#1a237e] text-white font-bold py-4 rounded-xl text-base"
        >
          OK
        </button>
      </div>
    </div>
  );
}
