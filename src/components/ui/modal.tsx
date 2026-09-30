'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#23272f]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-[#e9eaec] max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#e9eaec]">
          <h3 className="text-lg font-medium text-[#23272f]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7c818d] hover:text-[#23272f] hover:bg-[#f6f9fe] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
