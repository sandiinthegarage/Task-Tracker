export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border-3 border-fg p-4 bg-gray-100 animate-pulse min-h-[120px] rounded-none"
        />
      ))}
    </div>
  );
}
