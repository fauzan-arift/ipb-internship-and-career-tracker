import React from 'react';
import { Check, X } from 'lucide-react';
import Button from '@/components/atoms/Button';

export default function StatusUpdateModal({
  isOpen,
  onClose,
  statuses,
  currentStatus,
  selectedStatus,
  onSelect,
  onSave,
  isSaving,
  isStatusSelected,
  error,
}) {
  if (!isOpen) return null;

  const currentIndex = statuses.findIndex((s) => s.value === currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Ubah Status Lamaran</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Pilih status baru untuk lamaran ini. Status yang bersifat otomatis tidak dapat dipilih secara manual.
        </p>

        <div className="space-y-2">
          {statuses.map((status, index) => {
            const isCurrent = status.value === currentStatus;
            const isSelected = status.value === selectedStatus;
            const isAuto = status.automatic && status.value !== 'Ditolak';
            const isFinal = status.isFinal;
            const isChecked = isStatusSelected(status.value);

            const isDisabled = isAuto || (index <= currentIndex && status.value !== selectedStatus);

            return (
              <div
                key={status.value}
                onClick={() => !isDisabled && onSelect(status.value)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                  ${isCurrent ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}
                  ${isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}
                  ${isSelected && !isDisabled ? 'border-indigo-600 bg-indigo-50' : ''}
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                    ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}
                    ${isDisabled ? 'border-gray-200' : ''}
                  `}
                >
                  {isChecked && <Check size={14} className="text-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      {status.label}
                    </span>
                    {isCurrent && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Final
                      </span>
                    )}
                    {isAuto && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Otomatis
                      </span>
                    )}
                    {isFinal && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Final
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{status.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
          <div className="text-sm text-red-500">
            {error && error}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSaving}>
              Batal
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={onSave}
              disabled={!selectedStatus || selectedStatus === currentStatus || isSaving}
              size="lg"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}