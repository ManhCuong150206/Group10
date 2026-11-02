# Nhóm 10 — Portfolio thành viên

Trang tổng hợp portfolio của 6 thành viên Nhóm 10, làm bằng HTML, CSS và JavaScript thuần (không dùng framework hay thư viện ngoài).

## Thành viên

| # | Họ tên | Portfolio |
|---|--------|-----------|
| 1 | Chúc Mạnh Cường | [Xem](https://manhcuong150206.github.io/portfolio/) |
| 2 | Nguyễn Minh Nhựt | [xem](https://nmnhut0310.github.io/Minh-Nhut/) |
| 3 | Nguyễn Đức Phát | [Xem](https://phatnd8119-bit.github.io/portfoliocv/) |
| 4 | Mai Đàm Công Thành | [Xem](https://subsetjury.github.io/portfo/) |
| 5 | Nguyễn Duy Thuần | [Xem](https://thuannd1205-cmd.github.io/PORTFOLIO/) |
| 6 | Phan Nguyên Vũ | [Xem](https://vuphan20072006-commits.github.io/Porfolio-PhanNguyenVu/) |

## Tính năng

- **Băng chuyền 3D:** các thẻ xếp thành đường hầm theo trục Z. Mỗi lần chuyển thẻ, thẻ hiện tại bay vút qua camera và thẻ phía sau lao lên thay thế.
- **Nền vũ trụ:** các ngôi sao vẽ bằng canvas bay theo chiều sâu, kéo vệt (warp) mỗi khi chuyển thẻ và lệch nhẹ theo chuột.
- **Thẻ thành viên:** monogram chữ cái đầu có vòng quỹ đạo quay, mỗi người một tông màu riêng, thẻ nhấp nhô nhẹ như sóng.
- **Hỗ trợ truy cập:** điều hướng bằng bàn phím, nhãn ARIA, và tự giảm hiệu ứng khi hệ thống bật `prefers-reduced-motion`.

## Cách điều hướng

- Nút mũi tên trái/phải, hoặc phím `←` `→`
- Bấm vào chấm tròn hoặc bấm trực tiếp vào thẻ phía sau
- Vuốt ngang (điện thoại) hoặc lăn chuột trên băng chuyền

## Cấu trúc

```
├── index.html   # Nội dung và 6 thẻ thành viên
├── style.css    # Giao diện, hiệu ứng 3D, thẻ, sóng
└── script.js    # Băng chuyền 3D, nền sao, điều khiển
```

## Chạy thử

Mở `index.html` bằng trình duyệt là dùng được, không cần cài đặt hay build.

