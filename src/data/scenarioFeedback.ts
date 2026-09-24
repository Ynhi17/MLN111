type Feedback = { focus: string; missing: string; check: string; lesson: string }
const feedback = (focus: string, missing: string, check: string, lesson: string): Feedback => ({ focus, missing, check, lesson })
export const scenarioFeedback: Record<number, Record<string, Feedback>> = {
  1: {
    A: feedback('Bạn dựa vào sự đồng thuận của số đông.', 'Nhiều lượt chia sẻ có thể cùng xuất phát từ một nguồn sai; số đông chưa chứng minh nhận định.', 'Tìm nguồn đầu tiên, dữ liệu gốc và nguồn độc lập trước khi tin hoặc chia sẻ.', 'Phân biệt mức độ phổ biến với căn cứ của tri thức.'),
    B: feedback('Bạn ưu tiên kiểm tra bằng chứng trước khi tin.', 'Một nguồn có vẻ đáng tin vẫn có thể sai hoặc thiếu bối cảnh.', 'Đối chiếu ngày công bố, phương pháp thu thập dữ liệu và ít nhất một nguồn độc lập.', 'Hoài nghi có phương pháp cần đi cùng kiểm chứng, không phủ nhận mọi thứ.'),
    C: feedback('Bạn tìm thêm góc nhìn từ người quen.', 'Bạn bè có thể đọc cùng một nguồn và lặp lại cùng một định kiến.', 'Hỏi họ dựa vào tài liệu nào, rồi truy về dữ liệu thay vì chỉ đếm người đồng ý.', 'Trao đổi mở rộng góc nhìn nhưng không thay thế bằng chứng.'),
    D: feedback('Bạn bảo vệ thời gian và sự chú ý.', 'Bỏ qua không xác định được thông tin đúng hay sai; có thể bỏ lỡ điều ảnh hưởng trực tiếp đến mình.', 'Xem mức độ liên quan và hệ quả nếu không kiểm tra; ưu tiên xác minh thông tin quan trọng.', 'Cân nhắc điều kiện và mục đích của nhận thức trước khi dành công sức.'),
  },
  2: {
    A: feedback('Bạn coi trọng chuyên môn của giảng viên.', 'Uy tín không tự chứng minh rằng chỉ có một cách giải trong mọi điều kiện.', 'Hỏi phạm vi áp dụng, giả thiết và cách chứng minh của phương pháp.', 'Tôn trọng chuyên môn đồng thời xem xét căn cứ và giới hạn của kết luận.'),
    B: feedback('Bạn kết hợp lắng nghe với tự kiểm tra.', 'Tài liệu tìm được có thể dùng giả thiết khác với bài học.', 'So sánh điều kiện đề bài, thử ví dụ và trao đổi nếu kết quả khác nhau.', 'Nhận thức được làm rõ qua đối chiếu lý luận với hoạt động giải quyết vấn đề.'),
    C: feedback('Bạn chủ động làm rõ điều chưa hiểu.', 'Một câu hỏi thiếu bối cảnh có thể biến trao đổi thành tranh luận về người nói.', 'Nêu cụ thể bước lập luận còn vướng và đưa một phương án để cùng kiểm tra.', 'Phản biện nhằm làm rõ vấn đề, không nhằm phủ nhận người có thẩm quyền.'),
    D: feedback('Bạn dành thời gian suy xét trước khi phản hồi.', 'Nếu chỉ ghi chép mà không quay lại, nghi vấn sẽ chưa được giải quyết.', 'Đặt lịch xem lại, thử bài tương tự và ghi câu hỏi gửi giảng viên.', 'Suy nghĩ cần nối với hành động kiểm tra cụ thể.'),
  },
  3: {
    A: feedback('Bạn ưu tiên thu nhập và nhu cầu vật chất.', 'Sức khỏe, giá trị nghề nghiệp và hệ quả công việc có thể bị xem nhẹ.', 'Kiểm tra nhiệm vụ thực tế, chi phí sống, hợp đồng và giới hạn đạo đức của mình.', 'Lựa chọn giá trị phải đặt trong điều kiện cụ thể và trách nhiệm với người khác.'),
    B: feedback('Bạn bảo vệ giá trị cá nhân.', 'Từ chối ngay có thể bỏ qua khả năng điều chỉnh công việc hoặc áp lực tài chính.', 'Xác định điểm xung đột có thật hay do thiếu thông tin; tính phương án tài chính thay thế.', 'Giữ nguyên tắc cần đi cùng nhận thức đúng hoàn cảnh, không chỉ mong muốn.'),
    C: feedback('Bạn tìm khả năng dung hòa các nhu cầu.', 'Không phải xung đột nào cũng thương lượng được, nhất là giới hạn đạo đức.', 'Hỏi rõ phần việc có thể đổi và xác nhận cam kết bằng văn bản.', 'Xem xét quan hệ và khả năng thay đổi, nhưng không giả định mọi bên đều có lợi ích giống nhau.'),
    D: feedback('Bạn thừa nhận còn thiếu thông tin để quyết định.', 'Trì hoãn không tự tạo ra hiểu biết mới và có thể làm mất cơ hội.', 'Thống nhất thời hạn, liệt kê ba thông tin cần tìm và người có thể giúp kiểm chứng.', 'Thận trọng có giá trị khi dẫn đến việc tìm hiểu và hành động.'),
  },
  4: {
    A: feedback('Bạn chú ý đến tốc độ tạo ra sản phẩm.', 'Khẳng định “AI làm được tất cả” không có căn cứ; có đầu ra chưa đồng nghĩa với hiểu và làm chủ kiến thức.', 'Tự giải thích từng bước, đối chiếu kết quả với tài liệu và kiểm tra quy định môn học.', 'Phân biệt công cụ hỗ trợ với năng lực nhận thức và trách nhiệm của người sử dụng.'),
    B: feedback('Bạn coi kiến thức là điều kiện để đánh giá công cụ.', 'Người dùng không kiểm soát hoàn toàn mọi cơ chế hoặc sai sót của hệ thống.', 'Kiểm tra nguồn, thử trường hợp phản ví dụ và tự làm lại phần cốt lõi.', 'Chủ động sử dụng công cụ phải đi cùng hiểu giới hạn và kiểm tra thực tế.'),
    C: feedback('Bạn muốn đầu tư vào năng lực bổ sung cho công nghệ.', 'Ranh giới việc AI làm được thay đổi; bỏ kiến thức nền sẽ làm khó việc đánh giá kết quả.', 'Xem năng lực nền nào cần cho chuyên ngành, thay vì chỉ dự đoán công việc nào sẽ còn lại.', 'Nhìn sự vật trong phát triển, tránh lấy trạng thái công nghệ hiện tại làm bất biến.'),
    D: feedback('Bạn coi trọng việc xác định vấn đề và đặt câu hỏi.', 'Câu hỏi tốt vẫn chưa bảo đảm câu trả lời đúng; AI cũng có thể tạo câu hỏi.', 'Làm rõ mục tiêu, yêu cầu bằng chứng và kiểm tra khả năng áp dụng kết quả.', 'Tư duy có phương pháp kết nối câu hỏi, lý do, kiểm chứng và hành động.'),
  },
  5: {
    A: feedback('Bạn xem lại năng lực hiện tại của mình.', 'Một kỳ thi chưa đủ để kết luận toàn bộ năng lực là yếu kém hoặc không thể thay đổi.', 'Phân tích lỗi theo từng kỹ năng, so với các bài trước và xét sức khỏe, thời gian ôn tập.', 'Đánh giá con người trong quá trình phát triển và điều kiện cụ thể.'),
    B: feedback('Bạn hướng đến khả năng cải thiện.', 'Suy nghĩ tích cực không tự chỉ ra nguyên nhân hay giúp điểm số tăng lên.', 'Chọn một nhóm lỗi, đổi cách luyện tập và kiểm tra lại sau hai tuần.', 'Khả năng phát triển cần điều kiện và hoạt động thực tế để trở thành kết quả.'),
    C: feedback('Bạn đặt câu hỏi về cách đánh giá.', 'Không thể quy lỗi cho hệ thống nếu chưa có bằng chứng; cũng cần xem lại cách chuẩn bị.', 'Đối chiếu bài làm với tiêu chí chấm và xin phản hồi hoặc phúc khảo theo quy định.', 'Xem xét cả yếu tố chủ quan và khách quan, tránh kết luận một chiều.'),
    D: feedback('Bạn chấp nhận rằng hành trình có thể có trở ngại.', 'Bình thường hóa thất bại có thể trở thành lý do không thay đổi cách làm.', 'Xác định hệ quả cần xử lý, nguyên nhân có thể tác động và một bước khắc phục.', 'Nhìn nhận quá trình không có nghĩa là thụ động trước kết quả.'),
  },
}
