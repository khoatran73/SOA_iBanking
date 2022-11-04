# iBanking SOA

## Run code:

- Yêu cầu: Đã cài đặt môi trường nodejs.

## Server:

- Tại thư mục server trong source code mở terminal ( CLI ) : `npm install` or `yarn add`
- Sau khi lệnh chạy hoàn tất: `npm start` or `yarn start`
- Nếu tại cửa số dòng lệnh CLI :

  `sever is running on port 5000`

  `connect to MongoDB successfully `

  Server start thành công !

## Client:

- Tại thư mục server trong source code mở terminal ( CLI ) : `npm install` or `yarn add`
- Sau khi lệnh chạy hoàn tất: `npm start` or `yarn start` client có thể sẽ start lâu hơn server 1 vài phút.
- Của số web dẫn đến web client sẽ tự bật lên nếu start thành công\

## List account:

- Quản trị viên hệ thống:

      username: admin

      password: 123$%^

- Người dùng đã được tạo sẵn:

      username: super123

      password: 123456

- Hoặc có thể tự tạo mới tài khoản user :

  - Hệ thống -> user -> Tạo mới.
  - Mật khẩu mặc định: 123456 ( sẽ được gửi về email khi đăng kí tạo tài khoản )


    Lưu ý:
      + Email user phải là email thật đang được sử dụng để nhận email gửi mã xác nhận cũng như hóa đơn thanh toán.
      + Sử dụng tài khoản admin để có tạo Học phí cho sinh viên tương ứng cũng như tạo user với email đang sử dụng để nhận email xác nhận thanh toán.
