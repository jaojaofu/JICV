
import { Language } from './types';

export const APP_STORAGE_KEY = 'h2so4_calc_history';
export const LANG_STORAGE_KEY = 'jicv_acid_lang';
export const NOTIF_STORAGE_KEY = 'jicv_acid_notif_enabled';

export const TRANSLATIONS = {
  vi: {
    title: "JICV AXIT 6%",
    subtitle: "TÍNH TOÁN LƯỢNG PHA AXIT 6%",
    settings: "CÀI ĐẶT",
    language: "Ngôn ngữ",
    calculate: "TÍNH TOÁN",
    result_title: "Kết quả pha chế",
    target_acid: "Axit 6% cần pha",
    pump_acid: "Axit 60% cần bơm",
    pump_water: "Nước RO cần bơm",
    history: "Lịch sử pha chế",
    view_history: "Xem lịch sử pha chế",
    hide_history: "Ẩn lịch sử",
    clear_all: "XÓA HẾT",
    confirm_clear: "Xóa toàn bộ lịch sử?",
    no_data: "Chưa có dữ liệu pha chế",
    batch_name: "Mẻ pha",
    checked: "Đã Check",
    not_checked: "Chưa Check",
    time_remaining: "Còn lại",
    overdue: "Quá hạn",
    checklist_done_at: "Checklist xong lúc",
    alert_unfinished: "⚠️ CẢNH BÁO: MẺ PHA CHƯA HOÀN THÀNH CHECK LIST (>30P)",
    notif_title: "CẢNH BÁO JICV AXIT",
    notif_body: "Mẻ pha đã quá 30 phút nhưng chưa hoàn thành Checklist an toàn!",
    enable_notif: "Thông báo hệ thống",
    notif_on: "Đã bật",
    notif_off: "Đã tắt",
    input_placeholder: "Nhập 1 - 175 (cm)",
    error_nan: "Vui lòng nhập số hợp lệ",
    error_low: "CÒN AXIT MÀ PHA CÁI GÌ",
    error_high: "TRÀN BỒN TÙM LUM",
    handbook: "CẨM NANG VẬN HÀNH",
    tab_checklist: "Checklist",
    tab_safety: "An Toàn",
    tab_emergency: "Ứng Phó",
    save_complete: "LƯU HOÀN THÀNH",
    confirmed_safe: "ĐÃ XÁC NHẬN AN TOÀN",
    need_calc_first: "Cần nhấn \"Tính Toán\" mẻ mới trước khi làm Checklist",
    reset_checklist: "Làm mới",
    confirm_reset_checklist: "Bạn muốn làm mới toàn bộ checklist?",
    install_app: "Cài đặt App vào điện thoại",
    system_ver: "HỆ THỐNG VẬN HÀNH JICV - BẢN 1.3",
    checklist_guide_title: "HƯỚNG DẪN LÀM CHECKLIST",
    checklist_guide_steps: [
      { title: "Bước 1: Tính toán", content: "Sau khi nhấn 'Tính Toán', hệ thống sẽ bắt đầu đếm ngược 30 phút cảnh báo." },
      { title: "Bước 2: Kiểm tra thực tế", content: "Thực hiện kiểm tra PPE và thiết bị theo đúng 5 đầu mục liệt kê bên dưới." },
      { title: "Bước 3: Tích chọn", content: "Chỉ tích chọn khi bạn đã thực sự hoàn thành bước đó tại khu vực sản xuất." },
      { title: "Bước 4: Xác nhận", content: "Nhấn 'Lưu hoàn thành' để hệ thống ghi nhận thời gian và tắt cảnh báo đỏ." }
    ],
    safety_rules_title: "Nguyên tắc an toàn hóa chất",
    emergency_title: "Xử lý sự cố khẩn cấp",
    safety_rules: [
      { title: "QUY TẮC VÀNG", content: "Luôn cho Axit vào Nước. KHÔNG bao giờ đổ nước vào axit đậm đặc vì sẽ gây nổ/bắn hóa chất.", urgent: true },
      { title: "BẢO HỘ CÁ NHÂN", content: "Sử dụng găng tay Nitrile/Neoprene, kính bảo hộ ôm sát mặt và quần áo chống hóa chất.", urgent: false },
      { title: "THÔNG GIÓ", content: "Làm việc tại nơi có hệ thống hút khí hoặc không gian mở thoáng mát.", urgent: false }
    ],
    checklist_items: [
      "Trang bị đầy đủ PPE (Kính, găng tay, tạp dề, ủng).",
      "Kiểm tra bồn chứa và đường ống dẫn (không rò rỉ).",
      "Đã nạp đủ lượng Nước RO cần thiết vào bồn trước.",
      "Bơm Axit 60% từ từ vào dòng nước (Tuyệt đối không đổ ngược).",
      "Đo lại nồng độ sau khi hoàn thành để xác nhận 6%."
    ],
    emergency: [
      { situation: "Dính vào mắt", action: "Rửa ngay lập tức dưới vòi nước sạch ít nhất 15-20 phút. Gọi cấp cứu ngay." },
      { situation: "Tiếp xúc da", action: "Cởi bỏ quần áo nhiễm bẩn. Rửa vùng da bị ảnh hưởng với nhiều nước lạnh liên tục ít nhất 15 phút." }
    ]
  },
  ja: {
    title: "JICV 硫酸 6%",
    subtitle: "硫酸6%希釈計算システム",
    settings: "設定",
    language: "言語選択",
    calculate: "計算実行",
    result_title: "調製結果",
    target_acid: "目標：6%硫酸量",
    pump_acid: "60%硫酸注入量",
    pump_water: "RO水注入量",
    history: "調製履歴",
    view_history: "履歴を表示",
    hide_history: "履歴を隠す",
    clear_all: "全て削除",
    confirm_clear: "全ての履歴を削除しますか？",
    no_data: "データがありません",
    batch_name: "バッチ",
    checked: "確認済",
    not_checked: "未確認",
    time_remaining: "残り",
    overdue: "期限切れ",
    checklist_done_at: "完了時刻",
    alert_unfinished: "⚠️ 警告：チェックリストが未完了です（30分経過）",
    notif_title: "JICV硫酸アラート",
    notif_body: "30分経過しましたが、安全チェックが完了していません！",
    enable_notif: "システム通知",
    notif_on: "オン",
    notif_off: "オフ",
    input_placeholder: "1 - 175 (cm) 入力",
    error_nan: "有効な数値を入力してください",
    error_low: "硫酸が不足しています",
    error_high: "タンクが溢れます！",
    handbook: "運用マニュアル",
    tab_checklist: "チェック",
    tab_safety: "安全",
    tab_emergency: "緊急時",
    save_complete: "保存して完了",
    confirmed_safe: "安全確認済み",
    need_calc_first: "チェックの前に計算を行ってください",
    reset_checklist: "リセット",
    confirm_reset_checklist: "チェックリストをリセットしますか？",
    install_app: "アプリをインストール",
    system_ver: "JICV運用システム - Ver 1.3",
    checklist_guide_title: "チェックリスト使用ガイド",
    checklist_guide_steps: [
      { title: "ステップ1: 計算", content: "計算実行後、30分のアラームカウントダウンが始まります。" },
      { title: "ステップ2: 現場確認", content: "PPEと設備の状態を、以下の5項目に従って確認してください。" },
      { title: "ステップ3: チェック", content: "項目が完了するごとに、チェックボックスを選択してください。" },
      { title: "ステップ4: 保存", content: "「保存して完了」を押すと、履歴が記録されアラートが止まります。" }
    ],
    safety_rules_title: "化学物質安全原則",
    emergency_title: "緊急時の対応",
    safety_rules: [
      { title: "黄金律", content: "常に硫酸を水に加えてください。決して水を濃硫酸に注がないでください。", urgent: true },
      { title: "個人用保護具", content: "ニトリル手袋、ゴーグル、防護服を着用してください。", urgent: false },
      { title: "換気", content: "換気の良い場所、または排気システムのある場所で作業してください。", urgent: false }
    ],
    checklist_items: [
      "PPEを完全に装備（ゴーグル、手袋、エプロン、ブーツ）。",
      "貯蔵タンクと配管の漏れを確認。",
      "あらかじめ必要な量のRO水をタンクに充填。",
      "60%硫酸を水流にゆっくり注入（絶対に逆方向にしない）。",
      "完了後に濃度を再測定し、6%であることを確認。"
    ],
    emergency: [
      { situation: "目に入った場合", action: "すぐに流水で15〜20分間洗い流してください。直ちに救急車を呼んでください。" },
      { situation: "皮膚に付着した場合", action: "汚染された衣服を脱ぎ、冷水で少なくとも15分間洗い流してください。" }
    ]
  }
};
