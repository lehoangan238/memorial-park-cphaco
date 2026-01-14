import { useState } from 'react';
import { Play, ChevronRight, ChevronDown } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageCarousel } from '../components/ImageCarousel';

// Import Long Phụng images
import longPhung1 from '../assets/Khu long phung.jpg';
import longPhung2 from '../assets/Khu long phung 2.jpg.png';
import longPhung3 from '../assets/Long Phụng 3.jpg';
import songThan1 from "@/assets/mo-song-than-1.jpg"
import songThan2 from "@/assets/mo-song-than-2.jpg"
import songThan3 from "@/assets/mo-song-than-3.jpg"
import moDon1 from "@/assets/vinh-hang-dai.jpg"
import moDoi1 from "@/assets/mo-doi.jpg"
import khuGiaToc from "@/assets/khu-gia-toc .jpg"
import trucLamBichThuy1 from "@/assets/truc-lam-bich-thuy-1.jpg"
import trucLamBichThuy2 from "@/assets/truc-lam-bich-thuy-2.jpg"
import trucLamBichThuy3 from "@/assets/truc-lam-bich-thuy-3.jpg"
// Placeholder images - replace with actual images
const giaTocImages = [
  khuGiaToc
];

const trucLamImages = [
  trucLamBichThuy1,
  trucLamBichThuy2,
  trucLamBichThuy3
];

const moDoiImages = [
  moDoi1
];

const songThanImages = [
  songThan1,
  songThan2,
  songThan3,
];

const moDonImages = [
  moDon1
];

const longPhungImages = [
  longPhung1,
  longPhung2,
  longPhung3,
];

const BurialPlots = () => {
  const [isExpandedMoDon, setIsExpandedMoDon] = useState(false);
  const [isExpandedLongPhung, setIsExpandedLongPhung] = useState(false);
  const [isExpandedGiaToc, setIsExpandedGiaToc] = useState(false);
  const [isExpandedIntro, setIsExpandedIntro] = useState(false);
  const [expandedConsideration, setExpandedConsideration] = useState<number | null>(null);

  const considerations = [
    {
      title: 'Vị trí và khoảng cách',
      content: 'Ưu tiên khu vực thuận tiện di chuyển từ TP.HCM/Thuận An (thời gian đi lại, đường lớn, dễ tìm). Nên chọn lô mộ ở cung đường nội bộ dễ vào, có bãi đỗ xe gần, người lớn tuổi đi thăm không vất vả.'
    },
    {
      title: 'Phong thủy & không gian',
      content: 'Lưu ý hướng lô mộ, địa thế cao ráo, thoáng, nhìn ra cây xanh, hồ nước, gần dòng chảy lành giúp vượng khí cho con cháu. Hạn chế vị trí thấp trũng, ẩm, gần chỗ nước tụ hoặc khu vực quá ồn ào, nhiều xe cộ.'
    },
    {
      title: 'Loại hình mộ phù hợp',
      content: 'Hoa Viên Bình Dương có nhiều loại: mộ đơn, mộ đôi, mộ song thân, mộ phu thê, mộ gia tộc… mỗi loại hợp một nhu cầu và ngân sách khác nhau. Nên xác định trước: an táng một người, vợ chồng, cha mẹ hay cả dòng tộc để chọn khu và diện tích hợp lý, tránh phải đổi chỗ sau này.'
    },
    {
      title: 'Giá bán & chi phí lâu dài',
      content: 'Cần hỏi rõ giá lô mộ theo khu, diện tích, vị trí (gần trục chính, gần công trình tâm linh sẽ giá cao hơn). Tính thêm: phí xây mộ, bia mộ, trang trí, phí chăm sóc – bảo dưỡng định kỳ (thường tăng theo thị trường) và chi phí thăm viếng mỗi năm.'
    },
    {
      title: 'Pháp lý & thời hạn sử dụng',
      content: 'Kiểm tra kỹ: dự án được cấp phép, hợp đồng sử dụng đất huyệt mộ rõ ràng, có ghi đầy đủ quyền và nghĩa vụ, điều khoản chuyển nhượng – thừa kế. Hỏi rõ thời hạn sử dụng huyệt mộ (lâu dài theo quy định nhà nước) và quy định nếu sau này nhà nước thay đổi quy hoạch.'
    },
    {
      title: 'Dịch vụ tang lễ & chăm sóc mộ',
      content: 'Hoa Viên Bình Dương có cung cấp gói trọn: tổ chức lễ tang, hỏa táng, an táng, lưu tro cốt, xe đưa rước, hỗ trợ nghi lễ theo tập quán Nam Bộ, Công giáo, Phật giáo… Hỏi rõ các dịch vụ sau an táng: dọn dẹp, trồng hoa, cắt cỏ, thắp nhang ngày lễ/tết, báo cáo hình ảnh cho gia đình ở xa.'
    },
    {
      title: 'Cơ sở vật chất & công trình tâm linh',
      content: 'Xem thực tế: đường nội bộ, nhà chờ, nhà vệ sinh, hệ thống chiếu sáng, cây xanh, quy hoạch tổng thể có sạch, thoáng, văn minh không. Nhiều gia đình thích lô gần chùa, nhà nguyện, tượng Phật/chúa, đài tưởng niệm… để tiện cúng viếng và cảm thấy yên tâm về mặt tâm linh.'
    },
    {
      title: 'Uy tín đơn vị & hỗ trợ về sau',
      content: 'Tìm hiểu đơn vị quản lý: thời gian hoạt động, quy mô (Hoa Viên Bình Dương hiện là một trong những công viên nghĩa trang lớn, quy hoạch lâu dài, pháp lý minh bạch). Hỏi kỹ chế độ chăm sóc khách hàng: sau khi mua còn được tư vấn phong thủy, thiết kế – xây mộ, hỗ trợ khi có thay đổi nhu cầu trong gia đình hay không.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src={moDoi1}
          alt="Đất Mộ Phần"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 pt-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light italic">
            Đất Mộ Phần
          </h1>
          <p className="text-white/70 text-base mt-4 italic">
            Nét yên bình tự nhiên và vẻ đẹp thanh tịnh
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-slate-400 text-[10px] tracking-[0.25em] uppercase mb-3">GIỚI THIỆU</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#5b7cfa] italic mb-6">
            
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-4xl mx-auto text-left">
              Một ngôi nhà yên bình giữa thiên nhiên hài hòa, nơi lưu giữ trọn vẹn tình thân và giá trị cội nguồn. Tại Hoa Viên Nghĩa Trang Bình Dương, mỗi khu mộ được kiến tạo nên từ sự giao hòa của cảnh sắc thanh thoát và tâm huyết gìn giữ truyền thống. Không gian nơi đây mang đến cảm giác an lành, thân thuộc – chốn trở về cho những ai trân quý nét đẹp đoàn viên, muốn vun đắp di sản gia đình bền vững cho mai sau.
            </p>
            
            {/* Expandable content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpandedIntro ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="text-slate-500 text-sm leading-relaxed max-w-4xl mx-auto text-left mt-4">
                Từng khuôn viên là sự kết hợp giữa phong thủy thuận lợi và kiến trúc tinh tế, tôn vinh dấu ấn riêng của mỗi gia tộc, để mỗi lần trở về, lòng người luôn tìm thấy sự bình yên và tự hào về nguồn cội.
              </p>
            </div>
            
            <div 
              className="flex justify-end mt-4"
              onClick={() => setIsExpandedIntro(!isExpandedIntro)}
            >
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">
                  {isExpandedIntro ? 'THU GỌN' : 'XEM THÊM'}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center transition-transform duration-300">
                  {isExpandedIntro ? (
                    <ChevronDown className="w-3 h-3 text-white" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Video + Commitment Box */}
          <div className="flex flex-col lg:flex-row gap-0 mt-12">
            {/* Video */}
            <div className="lg:w-[70%] relative">
              <div className="aspect-video bg-slate-200 relative overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/jmmw1jmVzQg?rel=0"
                  title="Hoa Viên Bình Dương"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
            {/* Commitment Box */}
            <div className="lg:w-[30%] flex flex-col">
              <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase mb-2 text-right pr-4 pt-2">X E M</p>
              <div className="bg-[#5b7cfa] text-white p-6 flex-1 flex flex-col justify-center text-center">
                <h3 className="font-serif text-2xl italic mb-4">
                  Cam Kết<br />Của Chúng Tôi
                </h3>
                <p className="text-white/80 text-xs leading-relaxed mb-3">
                  Một cam kết vượt qua mọi ranh giới được gắn kết bởi tình yêu chân thành.
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  Tại Hoa Viên Bình Dương, hãy yên tâm rằng việc thực hiện cam kết đó là lời hứa của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Burial Plot Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Title */}
          <div className="text-center mb-12">
            <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase mb-2">K H Á M  P H Á</p>
            <h2 className="font-serif text-3xl text-[#5b7cfa] italic">Các Loại Đất Mộ Phần</h2>
          </div>

          {/* Two Cards Side by Side */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card - Khu Mộ Gia Tộc */}
            <div className="bg-white shadow-lg p-6">
              {/* Image Carousel */}
              <div className="shadow-md mb-6">
                <ImageCarousel images={giaTocImages} alt="Khu Mộ Gia Tộc" />
              </div>
              <p className="text-slate-400 text-[10px] tracking-[0.15em] uppercase mb-2 text-center">UỐNG NƯỚC NHỚ NGUỒN</p>
              <h3 className="font-serif text-xl text-[#5b7cfa] mb-3 text-center">Khu Mộ Gia Tộc</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                Trong hành trình cuộc sống, trái tim của mỗi người Việt luôn hướng về cội nguồn, nơi gia đình và ngôi nhà là biểu tượng của sự gắn kết, lòng hiếu thảo, và tinh thần "uống nước nhớ nguồn". Từ xa xưa đến hiện đại, ngôi nhà không chỉ là chốn trú ngụ mà còn là mái ấm lưu giữ tinh thần, nơi các thế hệ quây quần bên bàn thờ tổ tiên, gìn giữ di sản văn hóa Việt. Dù ở đâu hay đi xa đến đâu, chúng ta luôn khao khát trở về nơi ấy – nơi tình thân mãi trường tồn.
              </p>

              {/* Expandable content */}
              <div className={`overflow-hidden transition-all duration-300 ${isExpandedGiaToc ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                  Khu Mộ Gia Tộc tại Hoa Viên Nghĩa Trang Bình Dương hiện thực hóa khát vọng ấy. Đây là không gian an nghỉ thanh tịnh, nơi thiên nhiên hòa quyện cùng tâm linh, mang lại bình an cho người đã khuất và phúc lành cho con cháu. Với hơn 300 hecta cây xanh, hồ nước trong lành, các không gian tâm linh vừa hiện đại vừa tôn vinh truyền thống, Khu Mộ Gia Tộc không chỉ là nơi tưởng nhớ mà còn là món quà yêu thương, nơi kết nối gia đình qua các thế hệ.
                </p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer mb-4 justify-center"
                onClick={() => setIsExpandedGiaToc(!isExpandedGiaToc)}
              >
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">
                  {isExpandedGiaToc ? 'THU GỌN' : 'XEM THÊM'}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center transition-transform duration-300">
                  {isExpandedGiaToc ? (
                    <ChevronDown className="w-3 h-3 text-white rotate-180" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <button className="border border-slate-700 text-slate-700 px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
            </div>

            {/* Right Card - Khu Trúc Lâm Bích Thủy & Khu Mộ Gia Tộc */}
            <div className="bg-white shadow-lg p-6">
              {/* Khu Trúc Lâm Bích Thủy */}
              <h3 className="font-serif text-xl text-[#5b7cfa] mb-3 text-center">Khu Trúc Lâm Bích Thủy</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                Khu Trúc Lâm Bích Thủy tọa trên thế đất rồng cuộn hổ ngồi, nơi có cây cối xanh mát và dòng suối chảy kết hợp lại, tạo nên một không gian thanh tịnh hài hòa với thiên nhiên. Gợi lên hình ảnh một nơi an nghỉ lý tưởng nơi phúc đức và sự bình an được lưu giữ.
              </p>
              <div className="flex justify-center mb-6">
                <button className="border border-slate-700 text-slate-700 px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
              {/* Image Carousel */}
              <div className="shadow-md">
                <ImageCarousel images={trucLamImages} alt="Khu Trúc Lâm Bích Thủy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mộ Đôi & Mộ Song Thân Section - Blue Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card - Mộ Đôi */}
            <div className="bg-[#5b7cfa] shadow-lg p-6">
              {/* Image Carousel */}
              <div className="border border-white/40 mb-6">
                <ImageCarousel images={moDoiImages} alt="Khu Mộ Đôi" />
              </div>
              <p className="text-white/70 text-[10px] tracking-[0.15em] uppercase mb-2 text-center">SỢI DÂY GẮN BÓ VĨNH CỬU</p>
              <h3 className="font-serif text-xl text-white mb-3 text-center">Khu Mộ Đôi</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4 text-center">
                Khu mộ đôi tại Hoa Viên Nghĩa Trang Bình Dương lưu giữ sợi dây gắn bó vĩnh cửu là tình thân và ước nguyện đoàn viên, để mỗi thế hệ đều có thể tìm về nguồn cội trong không gian yên bình, đậm nét truyền thống.
              </p>
              <p className="text-white/80 text-sm leading-relaxed mb-4 text-center">
                Từng khuôn viên được chăm chút như mái nhà sum vầy, gìn giữ hơi ấm đoàn viên để tiếng yêu thương còn vang mãi, trở thành di sản tình thân quý giá cho các thế hệ sau này.
              </p>
              <div className="flex justify-center">
                <button className="border border-white text-white px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-white hover:text-[#5b7cfa] transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
            </div>

            {/* Right Card - Mộ Song Thân */}
            <div className="bg-[#5b7cfa] shadow-lg p-6">
              <p className="text-white/70 text-[10px] tracking-[0.15em] uppercase mb-2 text-center">HIẾU KÍNH BẬC SINH THÀNH</p>
              <h3 className="font-serif text-xl text-white italic mb-3 text-center">Khu Mộ Song Thân</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4 text-center">
                Khu Mộ Song Thân là nơi gửi trọn hiếu kính của con cháu đến bậc sinh thành, tọa lạc tại vị trí đắc địa bên những công trình tâm linh thiêng liêng. Từng khuôn viên được thiết kế riêng biệt, hòa quyện cảnh sắc thanh tịnh cùng phong thủy vượng lành.
              </p>
              <p className="text-white/80 text-sm leading-relaxed mb-4 text-center">
                Đây không chỉ là nơi an nghỉ sum vầy, mà còn là di sản trường tồn – lưu giữ dấu ấn gia tộc và tự hào lan tỏa qua bao thế hệ.
              </p>
              <div className="flex justify-center mb-6">
                <button className="border border-white text-white px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-white hover:text-[#5b7cfa] transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
              {/* Image Carousel */}
              <div className="border border-white/40">
                <ImageCarousel images={songThanImages} alt="Khu Mộ Song Thân" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* White Cards Section - Mộ Đơn & Long Phụng */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Card - Mộ Đơn */}
            <div className="bg-white shadow-lg p-6">
              {/* Image Carousel */}
              <div className="shadow-md mb-6">
                <ImageCarousel images={moDonImages} alt="Khu Mộ Đơn" />
              </div>
              <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase mb-2 text-center">NƠI YÊN NGHỈ VĨNH HẰNG</p>
              <h3 className="font-serif text-xl text-[#5b7cfa] mb-4 text-center">Mộ Đơn</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                Lưu giữ tình sâu nghĩa nặng - Tại Hoa Viên Bình Dương, khu mộ đơn được quy hoạch hài hòa trong không gian xanh mát, yên tĩnh và trang trọng. Mỗi mộ được bố trí theo nguyên tắc phong thủy âm trạch: tọa sơn hướng thủy, lưng tựa núi, mặt hướng dòng nước sinh khí giúp người mất an nghỉ thanh thản, con cháu đời sau hưởng phúc lộc lâu dài.
              </p>

              {/* Expandable content */}
              <div className={`overflow-hidden transition-all duration-300 ${isExpandedMoDon ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                  Vị trí lô huyệt nằm tại các khu đất cao ráo, thông thoáng, không bị đọng nước, có trường khí tốt, bao quanh bởi cây xanh, tạo nên thế "Minh Đường tụ thủy" – tụ khí sinh tài, vượng vận hậu nhân. Các yếu tố như phương vị, long mạch, mạch khí và thế đất đều được khảo sát kỹ lưỡng bởi đội ngũ chuyên gia phong thủy nhiều kinh nghiệm.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                  Với thiết kế hài hòa, vật liệu bền vững, và không gian tĩnh lặng, linh thiêng, mỗi lô huyệt mộ đơn không chỉ là nơi an nghỉ vĩnh hằng mà còn là chốn để con cháu tìm về tưởng niệm, báo hiếu và gửi gắm tâm linh. Toàn khu được quy hoạch khoa học, thuận tiện chăm sóc, phù hợp với nhiều điều kiện tài chính khác nhau, mang lại sự yên tâm tuyệt đối cho thân nhân người đã khuất.
                </p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer mb-4 justify-center"
                onClick={() => setIsExpandedMoDon(!isExpandedMoDon)}
              >
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">
                  {isExpandedMoDon ? 'THU GỌN' : 'XEM THÊM'}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center transition-transform duration-300">
                  {isExpandedMoDon ? (
                    <ChevronDown className="w-3 h-3 text-white rotate-180" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <button className="border border-slate-700 text-slate-700 px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
            </div>

            {/* Right Card - Khu Long Phụng */}
            <div className="bg-white shadow-lg p-6">
              <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase mb-2 text-center">VƯỢNG KHÍ TỤ LINH, AN BÌNH HẬU THẾ</p>
              <h3 className="font-serif text-xl text-[#5b7cfa] mb-4 text-center">Khu Long Phụng</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                Khu mộ Long Phụng tại Hoa Viên Nghĩa Trang Bình Dương là một không gian an nghỉ được thiết kế theo phong thủy, tọa lạc ở vị trí đắc địa: tựa lưng vào núi và hướng ra sông. Nơi đây hội tụ năng lượng tốt lành từ các công trình tâm linh xung quanh như Chùa Thiên Phước, Hồn Việt và Linh Hoa Tuệ Đàn, mang lại sự yên bình và phúc đức cho gia đình.
              </p>

              {/* Expandable content */}
              <div className={`overflow-hidden transition-all duration-300 ${isExpandedLongPhung ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                  Khi an táng người quá cố, thì tâm linh quan trọng là chọn hướng gối đầu cho người chết được siêu thoát "tịnh độ". Khu mộ cho phép linh hoạt lựa chọn vị trí và hướng, tôn vinh truyền thống và được xem là nơi gửi gắm niềm tin, mang lại thịnh vượng cho con cháu mai sau.
                </p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer mb-4 justify-center"
                onClick={() => setIsExpandedLongPhung(!isExpandedLongPhung)}
              >
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">
                  {isExpandedLongPhung ? 'THU GỌN' : 'XEM THÊM'}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center transition-transform duration-300">
                  {isExpandedLongPhung ? (
                    <ChevronDown className="w-3 h-3 text-white rotate-180" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button className="border border-slate-700 text-slate-700 px-6 py-2.5 text-[10px] tracking-wider uppercase hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  NHẬN BÁO GIÁ
                </button>
              </div>
              {/* Image Carousel */}
              <div className="shadow-md">
                <ImageCarousel images={longPhungImages} alt="Khu Long Phụng" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 360° View Section */}
      <section className="py-16 bg-[#9bb0d4]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-white/80 text-[10px] tracking-[0.25em] uppercase mb-2">X E M</p>
          <h2 className="text-white text-lg tracking-[0.1em] uppercase mb-4">HOA VIÊN BÌNH DƯƠNG</h2>

          {/* Video */}
          <div className="relative aspect-video bg-slate-200 shadow-xl">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <span className="text-slate-400 text-sm">Toàn Cảnh Hoa Viên</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/10">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Considerations Section */}
      <section>
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-[#4a5fa8] to-[#5b6db8] py-12 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-normal leading-snug max-w-lg">
                8 điều cần cân nhắc khi<br />chọn nơi an táng
              </h2>
              <div className="relative -mr-24 lg:-mr-40">
                <img
                  src="https://www.nirvana.com.my/wp-content/uploads/2020/09/1660a.jpg"
                  alt="Gia Đình Hạnh Phúc"
                  className="w-[380px] md:w-[480px] lg:w-[560px] aspect-[4/3] object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* White List Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              {considerations.map((item, idx) => (
                <div key={idx} className="border-l-2 border-[#5b7cfa] pl-4">
                  <div
                    className="flex items-center justify-between py-3 cursor-pointer"
                    onClick={() => setExpandedConsideration(expandedConsideration === idx ? null : idx)}
                  >
                    <span className="text-slate-700 text-sm font-medium">{idx + 1}. {item.title}</span>
                    <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300">
                      {expandedConsideration === idx ? (
                        <ChevronDown className="w-3 h-3 text-white" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedConsideration === idx ? 'max-h-[300px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      { /*   <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
    
            <div className="relative">
          
              <div className="absolute top-4 left-4 right-0 bottom-0 bg-slate-200" />
        
              <div className="relative shadow-sm">
                <div className="aspect-[4/3] bg-slate-100">
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">Gia Đình Trong Công Viên</span>
                  </div>
                </div>
              </div>
            </div>

         
            <div>
              <h3 className="font-serif text-2xl text-[#5b7cfa] mb-6">
                Sự khác biệt giữa công viên tưởng niệm và nghĩa trang
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Khi lập kế hoạch trước hoặc tìm kiếm nơi an nghỉ cho người thân, bạn có thể gặp các thuật ngữ "công viên tưởng niệm" và "nghĩa trang". Đôi khi bạn có thể nghe thấy hai thuật ngữ này được sử dụng thay thế cho nhau. Hai thuật ngữ này có cùng ý nghĩa không? Mặc dù mục đích có thể giống nhau, nhưng công viên tưởng niệm và nghĩa trang thực sự khác biệt rõ rệt.
              </p>
              <div className="flex items-center gap-2 cursor-pointer justify-end">
                <span className="text-slate-500 text-[10px] tracking-wider uppercase">XEM THÊM</span>
                <div className="w-5 h-5 rounded-full bg-[#5b7cfa] flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default BurialPlots;
