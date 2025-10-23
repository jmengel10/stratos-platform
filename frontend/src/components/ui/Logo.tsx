export function Logo() {
  return (
    <div className="flex items-center space-x-3">
      {/* Circle with arc */}
      <div className="relative w-8 h-8">
        <div className="w-8 h-8 bg-navy rounded-full"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-2 border-primary border-t-0 border-r-0 rounded-full"></div>
      </div>
      <span className="text-xl font-bold text-navy">STRATOS</span>
    </div>
  );
}
