
import { DilutionConfig } from './types';

export const DEFAULT_CONFIG: DilutionConfig = {
  sourceConcentration: 60,
  targetConcentration: 6,
};

export const APP_STORAGE_KEY = 'h2so4_calc_history';

export const CHECKLIST_ITEMS = [
  "Trang bị đầy đủ PPE (Kính, găng tay, tạp dề, ủng).",
  "Kiểm tra bồn chứa và đường ống dẫn (không rò rỉ).",
  "Đã nạp đủ lượng Nước RO cần thiết vào bồn trước.",
  "Khởi động hệ thống khuấy (nếu có).",
  "Bơm Axit 60% từ từ vào dòng nước (Tuyệt đối không đổ ngược).",
  "Kiểm tra nhiệt độ dung dịch trong quá trình pha.",
  "Đo lại nồng độ sau khi hoàn thành để xác nhận 6%.",
  "Vệ sinh thiết bị và khóa các van an toàn."
];

export const SAFETY_RULES = [
  { title: "QUY TẮC VÀNG", content: "Luôn cho Axit vào Nước. KHÔNG bao giờ đổ nước vào axit đậm đặc vì sẽ gây nổ/bắn hóa chất.", urgent: true },
  { title: "BẢO HỘ CÁ NHÂN", content: "Sử dụng găng tay Nitrile/Neoprene, kính bảo hộ ôm sát mặt và quần áo chống hóa chất.", urgent: false },
  { title: "THÔNG GIÓ", content: "Làm việc tại nơi có hệ thống hút khí hoặc không gian mở thoáng mát.", urgent: false },
  { title: "ĂN UỐNG", content: "Tuyệt đối không ăn uống hoặc hút thuốc trong khu vực lưu trữ và pha chế hóa chất.", urgent: false }
];

export const EMERGENCY_RESPONSE = [
  { situation: "Dính vào mắt", action: "Rửa ngay lập tức dưới vòi nước sạch ít nhất 15-20 phút. Giữ mắt mở to. Gọi cấp cứu ngay." },
  { situation: "Tiếp xúc da", action: "Cởi bỏ quần áo nhiễm bẩn. Rửa vùng da bị ảnh hưởng với nhiều nước lạnh liên tục ít nhất 15 phút." },
  { situation: "Hít phải hơi", action: "Di chuyển nạn nhân ra nơi thoáng khí ngay lập tức. Nếu khó thở, hỗ trợ oxy nếu có thể." },
  { situation: "Tràn đổ axit", action: "Khoanh vùng khu vực. Sử dụng vôi bột (CaO) hoặc Soda Ash (Na2CO3) để trung hòa trước khi dọn dẹp." }
];
