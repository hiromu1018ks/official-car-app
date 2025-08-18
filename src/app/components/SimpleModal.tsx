import { Button } from "@/components/ui/button.tsx";

export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SimpleModal = ({
  isOpen,
  onClose,
  title,
  children,
}: SimpleModalProps) => {
  return (
    <div
      id="modal"
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${isOpen ? "flex" : "hidden"} items-center justify-center z-50`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-white/20">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="p-8">{children}</div>
        <div className="px-8 py-6 border-t border-gray-100">
          <Button onClick={onClose}>閉じる</Button>
        </div>
      </div>
    </div>
  );
};
