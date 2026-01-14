export const CarelineBar = () => {
  return (
    <div className="relative z-20 flex justify-start -mt-8">
      <div 
        className="px-16 py-4 rounded-r-full shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%)'
        }}
      >
        <span 
          className="text-white text-base tracking-[0.25em] font-normal"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          HOTLINE : 0274 3 555 666
        </span>
      </div>
    </div>
  );
};
