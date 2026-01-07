export const CarelineBar = () => {
  return (
    <div className="flex justify-center py-4">
      <div 
        className="px-16 py-4 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)'
        }}
      >
        <span 
          className="text-white text-base tracking-[0.25em] font-normal"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          ĐƯỜNG DÂY NÓNG : 1800-88-1818
        </span>
      </div>
    </div>
  );
};
