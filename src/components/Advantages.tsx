import { motion } from 'framer-motion';
import { Shield, Wallet, Clock, HeartHandshake, Award } from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: 'Quỹ bảo trì RM100 triệu',
    description: 'Đảm bảo duy trì và chăm sóc vĩnh viễn cho khuôn viên nghĩa trang.',
  },
  {
    icon: Wallet,
    title: 'Trả góp 0% lãi suất',
    description: 'Thanh toán linh hoạt theo tháng, không phát sinh lãi suất.',
  },
  {
    icon: Clock,
    title: 'Dịch vụ 24/7',
    description: 'Đội ngũ chuyên nghiệp luôn sẵn sàng hỗ trợ mọi lúc mọi nơi.',
  },
  {
    icon: HeartHandshake,
    title: 'Tư vấn tận tâm',
    description: 'Hướng dẫn chi tiết, giúp gia đình đưa ra quyết định phù hợp.',
  },
  {
    icon: Award,
    title: 'Đạt nhiều giải thưởng',
    description: 'Được công nhận là nhà cung cấp dịch vụ tang lễ hàng đầu châu Á.',
  },
];

export const Advantages = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium uppercase tracking-wider">Tại sao chọn Nirvana</span>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mt-3 mb-4">
            5 Lợi Ích Khi Lập Kế Hoạch Trước
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sự chuẩn bị chu đáo hôm nay giúp gia đình bạn an tâm và tránh được những gánh nặng trong tương lai.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 card-shadow hover:shadow-xl transition-all duration-300 border border-border hover:border-gold/30"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-7 h-7 text-gold group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
