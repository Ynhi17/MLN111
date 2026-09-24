export default function Conclusion() {
  return <section id="ket-luan" className="pt-4 pb-28 px-6 bg-secondary">
    <div className="max-w-6xl mx-auto">
      <span className="section-label">07 / ĐIỀU MANG THEO</span>
      <h2 className="mt-3 text-4xl md:text-5xl font-bold max-w-3xl">Vậy, chúng ta học Triết học để làm gì?</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {[
          ['01', 'Xây dựng thế giới quan có cơ sở', 'Hiểu bản thân trong mối quan hệ với thế giới. Tình huống nghề nghiệp cho thấy lựa chọn gắn với cả giá trị cá nhân và điều kiện sống.'],
          ['02', 'Rèn luyện phương pháp nhận thức', 'Xem xét mối liên hệ, quá trình và bằng chứng. Tình huống mạng xã hội và quiz giúp bạn thử kiểm tra lý do thay vì kết luận vội.'],
          ['03', 'Hành động có trách nhiệm', 'Vận dụng vào học tập và đời sống, cân nhắc hệ quả rồi điều chỉnh qua thực tiễn. Hãy chọn một việc nhỏ để làm và kiểm tra kết quả.'],
        ].map(([number, title, text]) => <article className="quiz-status" key={number}><span className="section-label">{number}</span><h3 className="text-xl font-semibold my-3">{title}</h3><p className="text-muted-foreground">{text}</p></article>)}
      </div>
      <p className="text-xl md:text-2xl font-semibold max-w-3xl mt-10 text-primary">Giá trị của việc học triết học thể hiện ở cách chúng ta hiểu vấn đề, kiểm tra lý do và hành động có suy xét.</p>
      <p className="mt-4 max-w-3xl text-muted-foreground">Những năng lực này cần được rèn luyện cùng kiến thức chuyên ngành và trải nghiệm; học triết học không tự động bảo đảm thành công hoặc mọi quyết định đều đúng.</p>
      <div id="tai-lieu" className="mt-14 border-t border-border pt-8">
        <h3 className="text-2xl font-semibold">Tài liệu tham khảo</h3>
        <p className="text-sm text-muted-foreground mt-3">Nội dung trên là diễn giải phục vụ học tập, không phải trích nguyên văn. Các ví dụ và phản hồi tương tác do website biên soạn.</p>
        <ol className="mt-5 space-y-5 text-sm max-w-3xl">
          <li>[1] Bộ Giáo dục và Đào tạo (2021), <em>Giáo trình Triết học Mác – Lênin (Dành cho bậc đại học hệ không chuyên lý luận chính trị)</em>, NXB Chính trị quốc gia Sự thật. Thông tin thư mục được đối chiếu tại mục 4.1 của đề cương [2]. <a className="source-link" href="https://nxbctqg.org.vn/xuat-ban-bo-giao-trinh-ly-luan-chinh-tri-danh-cho-bac-dai-hoc.html" target="_blank" rel="noreferrer">Thông tin xuất bản bộ giáo trình ↗</a></li>
          <li>[2] Trường Đại học Ngoại thương, <a className="source-link" href="https://ketoankiemtoan.ftu.edu.vn/wp-content/uploads/2022/03/1.TRI114_Triet-hoc-Mac-Lenin.pdf" target="_blank" rel="noreferrer">Đề cương chi tiết học phần TRI114 — Triết học Mác–Lênin (PDF) ↗</a>. Tham khảo mục tiêu về thế giới quan, phương pháp luận và vận dụng; đây là đề cương, không phải toàn văn giáo trình.</li>
          <li>[3] Stanford Encyclopedia of Philosophy, <a className="source-link" href="https://plato.stanford.edu/entries/critical-thinking/" target="_blank" rel="noreferrer">Critical Thinking ↗</a>. Đọc thêm về xem xét lý do, bằng chứng và giáo dục tư duy phản biện; không dùng nguồn này để đồng nhất toàn bộ triết học với phản biện.</li>
        </ol>
      </div>
    </div>
  </section>
}


