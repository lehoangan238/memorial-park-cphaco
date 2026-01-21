import { ChevronRight, Phone, Mail } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const FuneralService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-amber-100 to-pink-100" />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 text-center px-4 pt-16">
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-2">Nơi An Nghỉ Vĩnh Hằng</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-slate-700 font-light">
            Dịch Vụ Tang Lễ
          </h1>
        </div>
      </section>

      {/* Introduction - Hoa Viên Life Plan */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-slate-400 text-xs tracking-[0.3em] uppercase mb-4">DỊCH VỤ TANG LỄ</p>
            <h2 className="font-serif text-3xl md:text-4xl text-slate-700 italic">
              Gói Dịch Vụ Hoa Viên Bình Dương
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Description */}
            <div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Việc chuẩn bị tang lễ là một công việc phức tạp và nhạy cảm. Dù là chuẩn bị trước hay trong lúc cần thiết, việc biết bắt đầu từ đâu và quyết định những gì cần làm có thể khiến nhiều người lo lắng, đặc biệt với những ai chưa từng trực tiếp tham gia vào việc tổ chức tang lễ. Với hơn 15 năm kinh nghiệm trong lĩnh vực dịch vụ tang lễ và chăm sóc người đã khuất, Hoa Viên Bình Dương thấu hiểu những khó khăn này.
              </p>
              <div className="flex items-center gap-3 cursor-pointer group">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Right - Checklist */}
            <div className="space-y-4">
              {[
                'Tư vấn và hỗ trợ gia đình',
                'Dịch vụ tẩm liệm và nhập quan',
                'Chuẩn bị lễ viếng và tang lễ',
                'Điều phối nghi thức theo tôn giáo (Phật giáo, Công giáo, Tin lành)',
                'Dịch vụ di quan và an táng',
                'Các sản phẩm và dịch vụ bổ sung'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video/Showcase Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-center text-slate-400 text-xs tracking-[0.3em] uppercase mb-6">XEM VIDEO</p>
          
          <div className="relative aspect-[21/10] bg-gradient-to-br from-amber-100 via-amber-50 to-slate-100 flex items-center justify-center cursor-pointer group">
            <span className="text-slate-400 text-sm absolute">Không gian Hoa Viên Bình Dương</span>
            
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Process */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="hidden md:block w-24 h-px bg-slate-300" />
            <h2 className="font-serif text-2xl md:text-3xl text-[#5b7cfa] italic">
              Quy Trình Phục Vụ
            </h2>
            <div className="hidden md:block w-24 h-px bg-slate-300" />
          </div>
          <p className="text-slate-500 text-sm max-w-xl mx-auto text-center mb-16">
            Với Gói Dịch Vụ Hoa Viên Bình Dương, chúng tôi đảm bảo mọi nhu cầu được chăm sóc chu đáo qua bốn bước đơn giản, để gia đình có thể tập trung vào việc tiễn đưa người thân.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#5b7cfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2">Bước 1: Tư Vấn</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Lựa chọn gói dịch vụ phù hợp. Đội ngũ tư vấn viên sẽ hỗ trợ mọi thắc mắc của gia đình.</p>
            </div>

            <div className="text-center md:mt-20">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#5b7cfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2">Bước 2: Di Chuyển</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Đội ngũ chuyên nghiệp sẽ hỗ trợ việc di chuyển và chuẩn bị cho người đã khuất trước lễ viếng.</p>
            </div>

            <div className="text-center md:mt-20">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#5b7cfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2">Bước 3: Thủ Tục</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Chúng tôi hỗ trợ hoàn tất mọi giấy tờ và thủ tục pháp lý cần thiết để gia đình yên tâm.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#5b7cfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2">Bước 4: Tổ Chức Tang Lễ</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Đội ngũ chuyên nghiệp sẽ tổ chức tang lễ theo đúng nghi thức và mong muốn của gia đình.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Select Funeral Homes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Nhà tang lễ 1</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Nhà tang lễ 2</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Nhà tang lễ 3</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Nhà tang lễ 4</span>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-700 mb-4">
                Hệ Thống Nhà Tang Lễ
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Lựa chọn từ hệ thống nhà tang lễ hiện đại của chúng tôi, mỗi cơ sở được thiết kế để mang đến không gian trang nghiêm và ấm cúng cho lễ viếng.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Các cơ sở của chúng tôi có hội trường rộng rãi, phòng gia đình riêng biệt và đầy đủ tiện nghi hiện đại để phục vụ các nghi lễ với mọi quy mô.
              </p>
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-[#5b7cfa] text-sm">Xem tất cả địa điểm</span>
                <ChevronRight className="w-4 h-4 text-[#5b7cfa] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products - Urns & Caskets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-700">
              Bình Tro Cốt & Quan Tài
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { name: 'Bình Tro Cốt Cổ Điển', price: 'Từ 5.000.000 VNĐ' },
              { name: 'Bình Tro Cốt Cao Cấp', price: 'Từ 12.000.000 VNĐ' },
              { name: 'Bình Tro Cốt Thiết Kế', price: 'Từ 25.000.000 VNĐ' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mb-4 rounded-lg">
                  <span className="text-slate-400 text-sm">{item.name}</span>
                </div>
                <p className="text-slate-600 text-sm">{item.name}</p>
                <p className="text-[#5b7cfa] text-xs mt-1">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="aspect-[21/9] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center rounded-lg shadow-sm">
            <span className="text-slate-400 text-sm">Quan Tài Cao Cấp với Hoa Trang Trí</span>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-white/70 text-xs tracking-widest uppercase mb-2">Bộ Sưu Tập Cao Cấp</p>
            <h2 className="font-serif text-3xl md:text-4xl">Vĩnh Hằng Viên</h2>
          </div>
        </div>
      </section>

      {/* Features - 6 Reasons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-700 mb-2">
                6 Lý Do
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                để tin tưởng Hoa Viên Bình Dương với dịch vụ tang lễ
              </p>
              
              <div className="space-y-0">
                {[
                  'Uy tín với dịch vụ chuyên nghiệp và tận tâm',
                  'Đa dạng lựa chọn phù hợp mọi nhu cầu và ngân sách',
                  'Được bảo đảm bởi quỹ tín thác độc lập',
                  'Dịch vụ tang lễ trọn gói bởi đội ngũ chuyên nghiệp',
                  'Đường dây nóng hỗ trợ 24/7: 0869 555 444',
                  'Linh hoạt trong phương thức thanh toán'
                ].map((reason, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between py-4 border-b border-slate-100 cursor-pointer group"
                  >
                    <div className="flex items-start gap-0">
                      <div className="w-1 h-full min-h-[40px] bg-[#5b7cfa] mr-4" />
                      <span className="text-slate-700 text-sm leading-relaxed">{reason}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#5b7cfa] flex items-center justify-center flex-shrink-0 ml-4 relative">
                      <div className="w-2 h-0.5 bg-[#5b7cfa]" />
                      <div className="w-0.5 h-2 bg-[#5b7cfa] absolute" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="relative mb-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Đội ngũ nữ nhân viên</span>
                </div>
                <div className="absolute top-4 -right-2 bottom-4 w-1 bg-[#5b7cfa]" />
              </div>
              
              <h3 className="font-serif text-2xl text-[#5b7cfa] italic mb-2">
                Đội Ngũ Nữ Chuyên Nghiệp
              </h3>
              <p className="text-slate-700 text-sm font-medium mb-4">
                Bảo vệ sự tôn nghiêm cho người thân nữ của bạn
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Với mục đích bảo vệ sự tôn nghiêm cho người đã khuất là nữ giới, Hoa Viên Bình Dương tự hào giới thiệu đội ngũ nhân viên nữ chuyên nghiệp đầu tiên tại Việt Nam. Đội ngũ bao gồm các chuyên viên tẩm liệm, chuyên viên trang điểm, và người điều phối nghi lễ - tất cả đều là nữ - để phục vụ bà, mẹ và con gái của bạn với sự tôn trọng và danh dự cao nhất.
              </p>
              
              <button className="px-4 py-2 border border-[#5b7cfa] text-[#5b7cfa] text-xs hover:bg-[#5b7cfa] hover:text-white transition-colors">
                Dịch Vụ Chăm Sóc & Phục Hồi Di Hài
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-slate-700 mb-8">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[#5b7cfa] text-white text-sm rounded hover:bg-[#4a5cc5] transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Gọi Ngay: 0869 555 444
            </button>
            <button className="px-8 py-3 border-2 border-[#5b7cfa] text-[#5b7cfa] text-sm rounded hover:bg-[#5b7cfa] hover:text-white transition-colors flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Gửi Tin Nhắn
            </button>
          </div>
        </div>
      </section>

      {/* NEW & LIMITED PERIOD PLAN Section */}
      <section className="py-16 bg-[#7b8fc7]">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-white text-xl md:text-2xl font-semibold tracking-wide mb-3">
            GÓI DỊCH VỤ ƯU ĐÃI ĐẶC BIỆT
          </h2>
          <p className="text-white/80 text-sm mb-8">
            Khám phá các Gói Dịch Vụ Hoa Viên hoặc tìm hiểu thêm về <span className="font-semibold">Gói Ưu Đãi Đặc Biệt - An Bình Plus+</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-[#5b6caa] text-white text-xs tracking-wider hover:bg-[#4a5a99] transition-colors">
              GÓI AN BÌNH PLUS+
            </button>
            <button className="px-6 py-2 bg-[#5b6caa] text-white text-xs tracking-wider hover:bg-[#4a5a99] transition-colors">
              GÓI MIỀN BẮC
            </button>
            <button className="px-6 py-2 bg-[#5b6caa] text-white text-xs tracking-wider hover:bg-[#4a5a99] transition-colors">
              GÓI MIỀN TRUNG
            </button>
            <button className="px-6 py-2 bg-[#5b6caa] text-white text-xs tracking-wider hover:bg-[#4a5a99] transition-colors">
              GÓI MIỀN NAM
            </button>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 via-orange-100 to-pink-100 flex items-center justify-center shadow-xl">
                <span className="text-slate-500 text-sm">Gia đình hạnh phúc</span>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-[#5b7cfa] italic leading-tight">
                Hướng dẫn lựa chọn<br />đơn vị dịch vụ<br />tang lễ
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Việc lựa chọn đơn vị dịch vụ tang lễ phù hợp không chỉ quan trọng trong việc đảm bảo mọi nhu cầu và mong muốn của gia đình được đáp ứng, mà còn là sự hỗ trợ không thể thiếu. Một đơn vị dịch vụ tang lễ tốt sẽ giúp gia đình giảm bớt gánh nặng và căng thẳng trong việc tổ chức tang lễ, để gia đình có thể tập trung vào những điều quan trọng hơn trong thời điểm đau buồn.
              </p>
              <div className="flex items-center gap-3 cursor-pointer group">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-slate-700 text-sm font-medium mb-6">
                5 điều cần cân nhắc khi chọn đơn vị dịch vụ tang lễ
              </p>
              
              <div className="space-y-0">
                {[
                  'Tôn giáo và văn hóa',
                  'Dịch vụ và sản phẩm',
                  'Ngân sách và chi phí',
                  'Cơ sở vật chất',
                  'Sự thoải mái của gia đình'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-200 cursor-pointer group">
                    <div className="flex items-center gap-0">
                      <div className="w-1 h-6 bg-[#5b7cfa] mr-4" />
                      <span className="text-slate-600 text-sm">{item}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-0.5 bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-16 bg-[#1a2744]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-center mb-8">
            <div className="bg-[#5b7cfa] px-4 py-2">
              <span className="text-white text-[10px] tracking-wider uppercase">BƯỚC TIẾP THEO</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center cursor-pointer group">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-slate-400 text-xs">Chuẩn bị trước</span>
              </div>
              <p className="text-white/70 text-xs mb-2">Lên kế hoạch trước để an tâm hơn</p>
              <p className="text-white text-sm group-hover:text-[#5b7cfa] transition-colors">Dịch Vụ Chuẩn Bị Trước</p>
            </div>

            <div className="text-center cursor-pointer group">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-slate-400 text-xs">Tư vấn</span>
              </div>
              <p className="text-white/70 text-xs mb-2">Nhận sự hỗ trợ khi bạn cần</p>
              <p className="text-white text-sm group-hover:text-[#5b7cfa] transition-colors">Đặt Lịch Tư Vấn</p>
            </div>

            <div className="text-center cursor-pointer group">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-600 to-slate-700 mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-slate-400 text-xs">Liên hệ</span>
              </div>
              <p className="text-white/70 text-xs mb-2">Chúng tôi sẵn sàng giải đáp mọi thắc mắc</p>
              <p className="text-white text-sm group-hover:text-[#5b7cfa] transition-colors">Liên Hệ Ngay</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FuneralService;
