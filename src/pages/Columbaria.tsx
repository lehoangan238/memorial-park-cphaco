import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import chuaThienPhuoc from '../assets/CHUA THIEN PHUOC 4.jpg';

const Columbaria = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const moreColumbaria = [
    { title: 'Nhà lưu giữ tro cốt và hốc hỏa táng', image: '/placeholder.svg' },
    { title: 'Các lựa chọn tưởng niệm cho hỏa táng', image: '/placeholder.svg' },
    { title: 'Sự khác biệt giữa nhà lưu giữ tro cốt và lăng mộ', image: '/placeholder.svg' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Dotted Pattern Background */}
      <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <img 
          src={chuaThienPhuoc} 
          alt="Nhà Lưu Giữ Tro Cốt" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-white italic font-light">
            Nhà Lưu Giữ Tro Cốt
          </h1>
        </div>
      </section>

      {/* Video/Intro Section with Blue Overlay */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Video thumbnail with blue overlay */}
          <div className="relative aspect-video bg-[#5b7cfa] overflow-hidden cursor-pointer mb-10">
            <div className="absolute inset-4 bg-slate-300">
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Nội Thất Nhà Lưu Giữ Tro Cốt</span>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
              </div>
            </div>
            <span className="absolute bottom-3 left-4 text-white/80 text-[10px] tracking-[0.2em] uppercase">
              XEM VIDEO
            </span>
          </div>

          {/* Intro text */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-xl md:text-2xl text-slate-700 italic mb-4 leading-relaxed">
              Tái định nghĩa sự tôn kính qua<br />kiến trúc tinh xảo
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Các công trình lưu giữ tro cốt của chúng tôi được thiết kế với sự chú trọng tỉ mỉ đến từng chi tiết, 
              kết hợp hài hòa giữa giá trị truyền thống và thẩm mỹ hiện đại. Mỗi không gian được kiến tạo 
              nhằm mang đến một môi trường trang nghiêm và thanh tịnh.
            </p>
          </div>
        </div>
      </section>

      {/* Our Columbaria Title */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase mb-1">KHÁM PHÁ</p>
          <h2 className="font-serif text-2xl text-slate-700 italic">Các Công Trình Lưu Giữ Tro Cốt</h2>
        </div>
      </section>

      {/* Thumbnail Gallery Row */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Image Left (with carousel) + White Box Right */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-0 shadow-lg">
            {/* Image Left with carousel dots */}
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/3] bg-slate-200">
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Vườn Phương Đông</span>
                </div>
              </div>
              {/* Carousel dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-slate-600' : 'bg-slate-400/50'}`} />
                ))}
              </div>
            </div>
            {/* White Box Right */}
            <div className="lg:w-1/2 bg-white py-8 px-8 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] tracking-[0.15em] uppercase mb-2 text-center">
                THIẾT KẾ TRÁNG LỆ GỢI NHỚ THỜI CỔ ĐẠI
              </p>
              <h3 className="font-serif text-xl text-[#5b7cfa] italic mb-4 text-center">
                Nhà Lưu Giữ Tro Cốt<br />Kiến Trúc Cổ Trung Hoa
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4 text-center">
                Biệt Thự Phương Đông trị giá hàng triệu đô la là kiệt tác đặc trưng của Hoa Viên Nghĩa Trang. 
                Được xây dựng để lưu giữ tro cốt của người đã khuất, nội thất thanh lịch và rộng rãi 
                được thiết kế để truyền tải vẻ sang trọng cổ điển Trung Hoa.
              </p>
              <div className="flex items-center gap-2 justify-center cursor-pointer group">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-4 h-4 rounded-full bg-[#5b7cfa] flex items-center justify-center">
                  <ChevronRight className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Blue Box Left + Image Right (with carousel) */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-0">
            {/* Blue Box Left */}
            <div className="lg:w-[45%] bg-[#5b7cfa] py-8 px-8 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] tracking-[0.15em] uppercase mb-2">
                SỰ AN ỦI TÂM LINH HÒA QUYỆN VỚI CẢM THỨC ĐƯƠNG ĐẠI
              </p>
              <h3 className="font-serif text-xl text-white italic mb-4">
                Nhà Lưu Giữ Tro Cốt Công Giáo
              </h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Nhà Lưu Giữ Tro Cốt Công Giáo nghệ thuật là kiệt tác kiến trúc tang lễ độc nhất vô nhị. 
                Với phong cách độc đáo toát lên đặc trưng Công Giáo riêng biệt, công trình này 
                mang đến sự kết hợp hoàn hảo giữa hai thế giới.
              </p>
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-white/80 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            {/* Image Right with carousel */}
            <div className="lg:w-[55%] relative">
              <div className="aspect-[4/3] bg-slate-200">
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Nội Thất Nhà Lưu Giữ Công Giáo</span>
                </div>
              </div>
              {/* Carousel dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Image Left (with carousel) + Blue Box Right */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-0">
            {/* Image Left with carousel */}
            <div className="lg:w-[55%] relative">
              <div className="aspect-[4/3] bg-slate-200">
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Nội Thất Sang Trọng</span>
                </div>
              </div>
              {/* Carousel dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-slate-600' : 'bg-slate-400/50'}`} />
                ))}
              </div>
            </div>
            {/* Blue Box Right */}
            <div className="lg:w-[45%] bg-[#5b7cfa] py-8 px-8 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] tracking-[0.15em] uppercase mb-2">
                SỰ HÒA QUYỆN HÀI HÒA CỦA TRUYỀN THỐNG
              </p>
              <h3 className="font-serif text-xl text-white italic mb-4">
                Nhà Lưu Giữ Tro Cốt Hiện Đại
              </h3>
              <p className="text-white/80 text-xs leading-relaxed">
                Nhà lưu giữ tro cốt hiện đại được thiết kế theo phong cách nghệ thuật sống động, 
                đặt trong môi trường cát tường thúc đẩy sự thịnh vượng. Thiết kế truyền tải 
                tinh hoa của một kiệt tác vượt thời gian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Blue Box Left + Image Right */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-0">
            {/* Blue Box Left */}
            <div className="lg:w-[45%] bg-[#5b7cfa] py-8 px-8 flex flex-col justify-center">
              <p className="text-white/60 text-[10px] tracking-[0.15em] uppercase mb-2">
                SỰ THỐNG NHẤT CỦA CÁC Ý TƯỞNG
              </p>
              <h3 className="font-serif text-xl text-white italic mb-4">
                Vườn Tro Cốt
              </h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                An táng trong nhà lưu giữ tro cốt không phải là lựa chọn duy nhất cho những ai chọn hỏa táng. 
                Khu D của Hoa Viên Nghĩa Trang là khu đất chôn cất tro cốt lớn nhất tại Việt Nam.
              </p>
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-white/80 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            {/* Image Right */}
            <div className="lg:w-[55%] relative bg-[#5b7cfa] p-4">
              <div className="aspect-[4/3] bg-slate-200">
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                  <span className="text-slate-500 text-sm">Vườn Tro Cốt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: White Card - Image Left + Text Right */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white shadow-lg flex flex-col lg:flex-row overflow-hidden">
            {/* Image Left */}
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/3] bg-slate-200">
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Nội Thất Vần Điệu Cuộc Sống</span>
                </div>
              </div>
            </div>
            {/* Text Right */}
            <div className="lg:w-1/2 py-8 px-8 flex flex-col justify-center">
              <p className="text-slate-400 text-[10px] tracking-[0.15em] uppercase mb-2 text-center">
                KÝ ỨC ĐƯỢC TRÂN QUÝ LÀ NHỮNG TRÁI TIM ĐƯỢC ĐOÀN TỤ
              </p>
              <h3 className="font-serif text-xl text-[#5b7cfa] italic mb-4 text-center">
                Vần Điệu Cuộc Sống
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4 text-center">
                Nếu có một nơi mà sự ra đi không có nghĩa là kết thúc – nơi ký ức sống mãi trong tim – 
                thì nơi đó chính là Vần Điệu Cuộc Sống.
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="text-slate-500 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                  <div className="w-4 h-4 rounded-full bg-[#5b7cfa] flex items-center justify-center">
                    <ChevronRight className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <button className="border border-slate-800 text-slate-800 px-6 py-2 text-[10px] tracking-wider uppercase hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                  KHÁM PHÁ THÊM
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Play Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-center">
            <div className="w-12 h-12 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              <Play className="w-4 h-4 text-slate-400 ml-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Navy with Badge and Cards */}
      <section className="relative py-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#1e2a4a]">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(30,42,74,0.9), rgba(30,42,74,0.5))`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="w-28 h-20 bg-[#5b7cfa] flex flex-col items-center justify-center">
              <p className="text-white/70 text-[8px] tracking-[0.15em] uppercase">ĐỌC THÊM</p>
              <p className="text-white text-xs italic">Hỏa Táng</p>
            </div>
          </div>

          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {moreColumbaria.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-slate-300 mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <span className="text-slate-400 text-xs">Hình {idx + 1}</span>
                  </div>
                </div>
                <h4 className="text-white text-xs leading-tight">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Columbaria;
