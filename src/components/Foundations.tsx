const principles = [
  ['Tôn trọng điều kiện khách quan', 'Xuất phát từ điều kiện thực tế, không lấy mong muốn thay cho những gì đang có.', 'Muốn học thêm ngoại ngữ, hãy tính cả lịch học, chi phí và trình độ hiện tại trước khi đặt mục tiêu.'],
  ['Xem xét trong các mối liên hệ', 'Tìm những yếu tố liên quan và vai trò của từng yếu tố, tránh quy mọi việc về một nguyên nhân.', 'Điểm nhóm thấp có thể liên quan đến phân công, kiến thức, thời gian và cách phối hợp; cần xem yếu tố nào thực sự chi phối.'],
  ['Nhìn trong vận động, phát triển', 'Xét quá trình và điều kiện thay đổi; không coi trạng thái hiện tại là bất biến hay cho rằng tiến bộ luôn thẳng tắp.', 'Một lần thuyết trình chưa tốt không quyết định năng lực lâu dài. So sánh các lần luyện tập và điều chỉnh cách chuẩn bị.'],
  ['Gắn nhận thức với thực tiễn', 'Đưa điều đã hiểu vào hoạt động, đối chiếu kết quả và điều chỉnh nhận thức.', 'Thử cách ôn tập mới trong hai tuần, làm bài tự kiểm tra rồi xem kết quả có đáp ứng mục tiêu hay không.'],
]

export default function Foundations() {
  return <section id="co-so" className="py-28 px-6 bg-secondary">
    <div className="max-w-6xl mx-auto">
      <span className="section-label">02 / CƠ SỞ LÝ LUẬN</span>
      <h2 className="text-4xl md:text-5xl font-bold mt-3 max-w-3xl">Triết học giúp chúng ta nhìn và nghĩ như thế nào?</h2>
      <p className="mt-6 max-w-3xl text-muted-foreground">Triết học nghiên cứu những vấn đề chung nhất về thế giới và vị trí của con người trong thế giới. Nó không chỉ là kỹ năng phản biện hay lời khuyên suy nghĩ tích cực.</p>
      <div className="grid md:grid-cols-2 gap-6 my-10">
        <article className="quiz-status"><h3 className="text-xl font-semibold text-primary">Thế giới quan — cách nhìn</h3><p className="mt-3">Những quan điểm chung định hướng cách con người hiểu thế giới và bản thân.</p><p className="mt-3 text-muted-foreground">Ví dụ: khi nhìn việc học trong mối quan hệ với điều kiện sống và nỗ lực cá nhân, bạn tránh xem thành tích là thước đo duy nhất của một con người.</p></article>
        <article className="quiz-status"><h3 className="text-xl font-semibold text-primary">Phương pháp luận — cách tiếp cận</h3><p className="mt-3">Những quan điểm, nguyên tắc định hướng cách nhận thức và hoạt động.</p><p className="mt-3 text-muted-foreground">Ví dụ: trước khi đổi ngành, xác định điều cần tìm hiểu, so sánh các điều kiện và kiểm tra giả định bằng trải nghiệm thực tế.</p></article>
      </div>
      <h3 className="text-2xl font-semibold">Vận dụng trong học phần Triết học Mác–Lênin</h3>
      <p className="mt-3 mb-6 max-w-3xl text-muted-foreground">Phần trên giới thiệu triết học nói chung. Trong học phần Mác–Lênin, thế giới quan duy vật biện chứng và phương pháp luận biện chứng gợi ra các yêu cầu sau; đây không phải toàn bộ nội dung của triết học.</p>
      <div className="grid md:grid-cols-2 gap-x-8">{principles.map(([title, explanation, example]) => <details key={title} className="learning-detail"><summary>{title}</summary><p>{explanation}</p><p className="text-muted-foreground"><strong>Với sinh viên:</strong> {example}</p></details>)}</div>
      <p className="text-sm text-muted-foreground mt-6">Đọc thêm: <a className="source-link" href="#tai-lieu">giáo trình và đề cương học phần [1–2]</a>. Các tình huống minh họa do website biên soạn.</p>
    </div>
  </section>
}
