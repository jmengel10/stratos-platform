export function Logo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden">
        {/* Curved teal accent */}
        <div className="absolute inset-2 border-t-2 border-[#33A7B5] rounded-full" style={{ transform: 'rotate(-45deg)' }} />
      </div>
      <span className="text-xs font-bold tracking-wider uppercase text-[#0F172A]">STRATOS</span>
    </div>
  );
}