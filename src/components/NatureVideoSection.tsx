import { motion } from 'framer-motion';

const easeOut = [0.22, 1, 0.36, 1] as const;

export const NatureVideoSection = () => {
  // YouTube video ID - từ link: https://youtu.be/qmpvttOdpjo?si=xh5qIV9tVI1lYyTa
  const youtubeVideoId = "qmpvttOdpjo";

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="w-full"
        >
          {/* Video Title (Optional) */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-slate-800 mb-4 font-serif font-medium">
              Khám Phá Hoa Viên Bình Dương
            </h2>
            <p className="text-slate-600 text-base font-body">
              Tham quan không gian yên bình và trang trọng của Hoa Viên Nghĩa Trang Bình Dương
            </p>
          </div>

          {/* YouTube Video Embed - Full Width */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl max-w-none">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&showinfo=0`}
              title="Hoa Viên Bình Dương - Video Giới Thiệu"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
